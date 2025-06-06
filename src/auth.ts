import { json as parseBodyJson } from 'body-parser';
import { Express } from 'express';

import ClientAPI from './api';
import config from './config';
import { RSAEncryptionHandler, TokenHandler } from './cryptoUtil';
import Database, { DatabaseOpCode } from './database';
import Mailer from './email';
import { defaultLogger, NamedLogger } from './log';
import { createNivEncryptedRules, rateLimitWithTrigger, sendDatabaseResponse, validateRequestBody } from './netUtil';

/**
 * Bundles code for client authentication into a single class.
 */
export class ClientAuth {
    private static instance: ClientAuth | null = null;

    readonly db: Database;
    readonly app: Express;
    readonly mailer: Mailer;
    readonly encryption: RSAEncryptionHandler;
    readonly logger: NamedLogger;

    private readonly sessionTokens: TokenHandler<string> = new TokenHandler<string>();;
    private readonly recentPasswordResetEmails: Map<string, number> = new Map(); // last email time per username

    readonly ready: Promise<any>;

    private constructor(db: Database, app: Express, mailer: Mailer) {
        this.db = db;
        this.app = app;
        this.mailer = mailer;
        this.logger = new NamedLogger(defaultLogger, 'ClientAuth');
        this.encryption = new RSAEncryptionHandler(this.logger);
        createNivEncryptedRules(this.encryption, 'auth');
        this.createEndpoints();
        this.ready = Promise.all([this.encryption.ready]);
        setInterval(() => this.encryption.rotateKeys(), config.rsaKeyRotateInterval * 3600000);
    }

    /**
     * Create HTTP endpoints
     */
    private createEndpoints() {
        if (config.sessionExpireTime < 6) this.logger.warn('sessionExpireTime is set to a low value! This will result in frequent sign outs! Is this intentional?');
        setInterval(() => this.recentPasswordResetEmails.forEach((v, k) => {
            if (this.recentPasswordResetEmails.get(k)! < performance.now() - config.recoveryEmailTimeout * 60000) this.recentPasswordResetEmails.delete(k);
        }), config.recoveryEmailTimeout * 60000);
        this.app.get('/auth/publicKey', (req, res) => {
            res.json(this.encryption.publicKey);
        });
        this.app.get('/auth/login', (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, 'Session ' + this.encryption.sessionID, this.logger);
            else sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, 'Session ' + this.encryption.sessionID, this.logger);
        });
        this.app.post('/auth/login', rateLimitWithTrigger({
            windowMs: 200,
            limit: 2,
            message: 'Too many login attempts'
        }, (req, res) => this.logger.warn(`Login rate limiting triggered by ${req.ip}`)), parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            password: 'required|encryptedLen-auth:1024,1'
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, 'Already signed in', this.logger);
                return;
            }
            const username = req.body.username;
            const password = await this.encryption.decrypt(req.body.password);
            if (password === null) {
                this.logger.error(`${req.method} ${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.checkAccount(req.body.username, password);
            if (check == DatabaseOpCode.SUCCESS) {
                const token = this.sessionTokens.createToken(username, config.sessionExpireTime * 3600);
                res.cookie('sessionToken', token, {
                    expires: new Date(this.sessionTokens.tokenExpiration(token)!),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                });
            }
            sendDatabaseResponse(req, res, check, { [DatabaseOpCode.UNAUTHORIZED]: 'Incorrect password' }, this.logger, username);
        });
        this.app.post('/auth/signup', rateLimitWithTrigger({
            windowMs: 60000,
            limit: config.maxSignupPerMinute,
            message: 'Too many account creation requests'
        }, (req, res) => this.logger.warn(`Signup rate limiting triggered by ${req.ip}`)), parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            password: 'required|encryptedLen-auth:1024,1',
            email: 'required|encryptedEmail-auth',
            email2: 'encryptedEmail-auth',
            firstName: 'required|string|length:32,1',
            lastName: 'required|string|length:32,1',
            organization: 'string|length:64',
            languages: 'arrayUnique|length:32',
            'languages.*': `required|string|in:${ClientAPI.validAccountData.languages.join()}`,
            grade: `required|integer|in:${ClientAPI.validAccountData.grades.join()}`,
            experience: `required|integer|in:${ClientAPI.validAccountData.experienceLevels.join()}`
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Already signed in', this.logger);
                return;
            }
            const username = req.body.username;
            const password = await this.encryption.decrypt(req.body.password);
            const email = await this.encryption.decrypt(req.body.email);
            const email2 = req.body.email2 != undefined ? await this.encryption.decrypt(req.body.email2) : '';
            if (password === null || email === null || email2 === null) {
                this.logger.error(`${req.method} ${req.path} fail: password/email decrypt failed after verification`);
                res.status(503).send('Password/email decryption error');
                return;
            }
            const check = await this.db.createAccount(username, password, {
                email: email,
                email2: email2,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                organization: req.body.organization ?? '',
                grade: req.body.grade,
                experience: req.body.experience,
                languages: req.body.languages
            });
            if (check == DatabaseOpCode.SUCCESS) {
                this.logger.info(`${username} @ ${req.ip} | Created account`);
                const token = this.sessionTokens.createToken(username, config.sessionExpireTime * 3600);
                res.cookie('sessionToken', token, {
                    expires: new Date(this.sessionTokens.tokenExpiration(token) ?? (Date.now() + 3600000)),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                });
            }
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.post('/auth/requestRecovery', rateLimitWithTrigger({
            windowMs: 1000,
            limit: 10,
            message: 'Too many account recovery requests'
        }, (req, res) => this.logger.warn(`Recovery request rate limit triggered by ${req.ip}`)), parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            email: 'required|encryptedEmail-auth',
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Signed in', this.logger);
                return;
            }
            const username = req.body.username;
            const email = await this.encryption.decrypt(req.body.email);
            if (email === null) {
                this.logger.error(`${req.method} ${req.path} fail: email decrypt failed after verification`);
                res.status(503).send('Email decryption error');
                return;
            }
            // rate limiting by username as well (significantly longer timeout) to combat email spam
            if (this.recentPasswordResetEmails.get(username) ?? -Infinity >= performance.now() - config.recoveryEmailTimeout * 60000) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Too many recovery requests for this account', this.logger, username, 'Check account');
                return;
            }
            this.recentPasswordResetEmails.set(username, performance.now());
            const data = await this.db.getAccountData(username);
            if (typeof data != 'object') {
                sendDatabaseResponse(req, res, data, {}, this.logger, username, 'Check account');
                return;
            }
            if (email != data.email) {
                sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger, username, 'Check account');
                return;
            }
            this.logger.info(`${username} @ ${req.ip} | Account recovery via email started`);
            const recoveryPassword = await this.db.getRecoveryPassword(username);
            if (typeof recoveryPassword != 'string') {
                // this definitely shouldn't happen EVER
                sendDatabaseResponse(req, res, DatabaseOpCode.ERROR, {}, this.logger, username, 'Send email');
                return;
            }
            // no html injection for you lol
            const mailErr = await this.mailer.sendFromTemplate('password-reset', [email], 'Reset Password', [
                ['name', data.displayName.replaceAll('<', '&lt;')],
                ['user', encodeURI(username)],
                ['pass', encodeURI(recoveryPassword)]
            ], `Hello ${data.displayName}!\nYou recently requested a password reset. Reset it here: https://${config.hostname}/recovery/?user=${encodeURI(username)}&pass=${encodeURI(recoveryPassword)}.\nNot you? You can ignore this email.`);
            if (mailErr !== undefined) {
                sendDatabaseResponse(req, res, DatabaseOpCode.ERROR, {}, this.logger, username, 'Send email');
                return;
            }
            sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, {}, this.logger, username, 'Send email');
            this.logger.info(`${username} @ ${req.ip} | Sent recovery email to ${email}`);
        });
        this.app.post('/auth/recovery', rateLimitWithTrigger({
            windowMs: 1000,
            limit: 10,
            message: 'Too many account recovery requests'
        }, (req, res) => this.logger.warn(`Recovery rate limit triggered by ${req.ip}`)), parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            recoveryPassword: 'required|encryptedLen-auth:1024,1',
            newPassword: 'required|encryptedLen-auth:1024,1'
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.method} ${req.path}: 403 Signed in`);
                res.status(403).send('Cannot recover account while signed in');
                return;
            }
            const username = req.body.username;
            const recoveryPassword = await this.encryption.decrypt(req.body.recoveryPassword);
            const newPassword = await this.encryption.decrypt(req.body.newPassword);
            if (recoveryPassword === null || newPassword === null) {
                this.logger.error(`${req.method} ${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.changeAccountPasswordToken(username, recoveryPassword, newPassword);
            if (check == DatabaseOpCode.SUCCESS) this.logger.info(`${username} @ ${req.ip} | Account recovered & password reset`);
            sendDatabaseResponse(req, res, check, { [DatabaseOpCode.UNAUTHORIZED]: 'Incorrect recovery password (perhaps a successful login rotated it?)' }, this.logger, username);
        });
        this.app.put('/auth/changePassword', parseBodyJson(), validateRequestBody({
            password: 'required|encryptedLen-auth:1024,1',
            newPassword: 'required|encryptedLen-auth:1024,1'
        }, this.logger), async (req, res) => {
            if (!this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.method} ${req.path}: 401 Unauthorized`);
                res.status(401).send('Cannot change password while not logged in');
                return;
            }
            const username = this.sessionTokens.getTokenData(req.cookies.sessionToken);
            const password = await this.encryption.decrypt(req.body.password);
            const newPassword = await this.encryption.decrypt(req.body.newPassword);
            if (username === null || password === null || newPassword === null) {
                this.logger.error(`${req.method} ${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.changeAccountPassword(username, password, newPassword);
            if (check == DatabaseOpCode.SUCCESS) {
                this.logger.info(`${username} @ ${req.ip} | Password reset`);
                res.clearCookie('sessionToken');
                this.sessionTokens.removeToken(req.cookies.sessionToken);
            }
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.delete('/auth/delete', parseBodyJson(), validateRequestBody({
            password: 'required|encryptedLen-auth:1024,1'
        }, this.logger), async (req, res) => {
            if (!this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.method} ${req.path}: 401 Unauthorized`);
                res.status(401).send('Cannot delete account while not logged in');
                return;
            }
            const username = this.sessionTokens.getTokenData(req.cookies.sessionToken);
            const password = await this.encryption.decrypt(req.body.password);
            if (typeof username != 'string' || password === null) {
                this.logger.error(`${req.method} ${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.deleteAccount(username, password);
            if (check == DatabaseOpCode.SUCCESS) {
                this.logger.info(`${username} @ ${req.ip} | Deleted account`);
                res.clearCookie('sessionToken');
                this.sessionTokens.removeToken(req.cookies.sessionToken);
            }
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.delete('/auth/logout', (req, res) => {
            if (!this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, 'Logged out', this.logger);
                return;
            }
            res.clearCookie('sessionToken');
            const username = this.sessionTokens.getTokenData(req.cookies.sessionToken);
            this.sessionTokens.removeToken(req.cookies.sessionToken);
            sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, 'Logged out', this.logger, username ?? undefined);
        });
        // reserve /auth path
        this.app.use('/auth/*', (req, res) => res.sendStatus(404));
    }

    /**
     * Check if a session token exists and is connected to a username.
     * @param token Session token string
     * @returns Token is valid
     */
    isTokenValid(token: any): boolean {
        return this.sessionTokens.tokenExists(token);
    }

    /**
     * Get the username associated with a session token.
     * @param token Session token string
     * @returns Username, or null if not connected to a username
     */
    getTokenUsername(token: any): string | null {
        return this.sessionTokens.getTokenData(token);
    }

    /**
     * Initialize the ClientAuth system.
     * @param db Database connection
     * @param app Express app (HTTP server) to attach API to
     * @param mailer SMTP mailing server connection
     */
    static init(db: Database, app: Express, mailer: Mailer): ClientAuth {
        return this.instance = this.instance ?? new ClientAuth(db, app, mailer);
    }

    /**
     * Get the ClientAuth system.
     */
    static use(): ClientAuth {
        if (this.instance === null) throw new TypeError('ClientAuth init() must be called before use()');
        return this.instance;
    }
}

export default ClientAuth;
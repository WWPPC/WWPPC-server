import { json as parseBodyJson } from 'body-parser';
import { Express } from 'express';
import { extend as nivExtend, extendMessages as nivExtendMessages, Validator } from 'node-input-validator';

import ClientAPI from './api';
import config from './config';
import { RSAEncryptionHandler, TokenHandler } from './cryptoUtil';
import Database, { DatabaseOpCode } from './database';
import Mailer from './email';
import { defaultLogger, NamedLogger } from './log';
import { validateRequestBody, rateLimitWithTrigger, reverse_enum, sendDatabaseResponse } from './util';

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
        nivExtend('encrypted', async ({ value }: any) => {
            if (!(value instanceof Buffer)) return false;
            return typeof (await this.encryption.decrypt(value)) == 'string';
        });
        nivExtend('encryptedEmail', async ({ value }: any) => {
            if (!(value instanceof Buffer)) return false;
            return await new Validator({
                v: await this.encryption.decrypt(value)
            }, {
                v: 'email|length:64,1'
            }).check();
        });
        nivExtend('encryptedLen', async ({ value, args }: any) => {
            if (args.length < 1 || args.length > 2) throw new Error('Invalid seed for rule encryptedLen');
            if (!(value instanceof Buffer)) return false;
            return await new Validator({
                v: await this.encryption.decrypt(value)
            }, {
                v: `string|length:${args[0]}${args.length > 1 ? `,${args[1]}` : ''}`
            }).check();
        });
        nivExtendMessages({
            encrypted: 'The :attribute must be RSA-OAEP encrypted using the server public key',
            encryptedEmail: 'The :attribute must be a valid e-mail address and RSA-OAEP encrypted using the server public key',
            encryptedLen: 'The :attribute must be a valid length and RSA-OAEP encrypted using the server public key',
        }, 'en')
        this.createEndpoints();
        this.ready = Promise.all([this.encryption.ready]);
        setInterval(() => this.encryption.rotateKeys(), config.rsaKeyRotateInterval * 3600000);
    }

    private createEndpoints() {
        if (config.sessionExpireTime < 6) this.logger.warn('sessionExpireTime is set to a low value! This will result in frequent sign outs! Is this intentional?');
        setInterval(() => this.recentPasswordResetEmails.forEach((v, k) => {
            if (this.recentPasswordResetEmails.get(k)! < performance.now() - config.recoveryEmailTimeout * 60000) this.recentPasswordResetEmails.delete(k);
        }), config.recoveryEmailTimeout * 60000);
        this.app.get('/auth/publicKey', (req, res) => {
            res.send(this.encryption.publicKey);
        });
        this.app.post('/auth/login', parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            password: 'required|encryptedLen:1024,1'
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.path}: 200 Already signed in`);
                res.status(200).send('Already signed in');
                return;
            }
            const username = req.body.username;
            const password = await this.encryption.decrypt(req.body.password);
            if (typeof password != 'string') {
                this.logger.error(`${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.checkAccount(req.body.username, password);
            sendDatabaseResponse(req, res, check, { [DatabaseOpCode.INCORRECT_CREDENTIALS]: 'Incorrect password' }, this.logger, username);
        });
        this.app.post('/auth/signup', rateLimitWithTrigger({
            windowMs: 60000,
            limit: config.maxSignupPerMinute,
            message: 'Too many account creation requests'
        }, (req, res) => this.logger.warn(`Signup rate limiting triggered by ${req.ip}`)), parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            password: 'required|encryptedLen:1024,1',
            email: 'required|encryptedEmail',
            firstName: 'required|string|length:32,1',
            lastName: 'required|string|length:32,1',
            school: 'required|string|length:64,1',
            languages: 'required|arrayUnique|length:32',
            'languages.*': `required|string|in:${ClientAPI.validAccountData.languages.join()}`,
            grade: `required|integer|in:${ClientAPI.validAccountData.grades.join()}`,
            experience: `required|integer|in:${ClientAPI.validAccountData.experienceLevels.join()}`
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.path}: 403 Signed in`);
                res.status(403).send('Cannot create account while signed in');
                return;
            }
            const username = req.body.username;
            const password = await this.encryption.decrypt(req.body.password);
            const email = await this.encryption.decrypt(req.body.email);
            if (typeof password != 'string' || typeof email != 'string') {
                this.logger.error(`${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.createAccount(username, password, {
                email: email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                school: req.body.school,
                grade: req.body.grade,
                experience: req.body.experience,
                languages: req.body.languages
            });
            if (check == DatabaseOpCode.SUCCESS) {
                this.logger.info(`Created account: ${username} (${req.ip})`);
                const token = this.sessionTokens.createToken(username, config.sessionExpireTime);
                res.cookie('sessionToken', token);
            }
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.post('/auth/requestRecovery', rateLimitWithTrigger({
            windowMs: 1000,
            limit: 10,
            message: 'Too many account recovery requests'
        }, (req, res) => this.logger.warn(`Recovery request rate limit triggered by ${req.ip}`)), parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            email: 'required|encryptedEmail',
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.path}: 403 Signed in`);
                res.status(403).send('Cannot request account recovery while signed in');
                return;
            }
            const username = req.body.username;
            const email = await this.encryption.decrypt(req.body.email);
            if (typeof email != 'string') {
                this.logger.error(`${req.path} fail: email decrypt failed after password verification`);
                res.status(503).send('Email decryption error');
                return;
            }
            // rate limiting by username as well (significantly longer timeout) to combat email spam
            if (this.recentPasswordResetEmails.get(username) ?? -Infinity >= performance.now() - config.recoveryEmailTimeout * 60000) {
                this.logger.info(`${req.path} fail: too many requests (${username}, ${req.ip})`);
                res.status(403).send('Too many recovery requests for this account');
                return;
            }
            this.recentPasswordResetEmails.set(username, performance.now());
            const data = await this.db.getAccountData(username);
            if (typeof data != 'object') {
                sendDatabaseResponse(req, res, data, {}, this.logger, username, 'Check account');
                return;
            }
            if (email != data.email) {
                sendDatabaseResponse(req, res, DatabaseOpCode.INCORRECT_CREDENTIALS, {}, this.logger, username, 'Check account');
                return;
            }
            this.logger.info(`Account recovery via email started: ${username} (${req.ip})`);
            const recoveryPassword = await this.db.getRecoveryPassword(username);
            if (typeof recoveryPassword != 'string') {
                // this definitely shouldn't happen EVER
                this.logger.error(`${req.path} fail: get recovery password ${reverse_enum(DatabaseOpCode, data)} (${username}, ${req.ip})`);
                res.sendStatus(503);
                return;
            }
            const mailErr = await this.mailer.sendFromTemplate('password-reset', [email], 'Reset Password', [
                ['name', data.displayName],
                ['user', encodeURI(username)],
                ['pass', encodeURI(recoveryPassword)]
            ], `Hallo ${data.displayName}!\nYou recently requested a password reset. Reset it here: https://${config.hostname}/recovery/?user=${encodeURI(username)}&pass=${encodeURI(recoveryPassword)}.\nNot you? You can ignore this email.`);
            if (mailErr !== undefined) {
                this.logger.error(`${req.path} fail: email error ${mailErr.message} (${username}, ${req.ip})`);
                res.status(503).send('Send email - Internal email error');
                return;
            }
            this.logger.info(`${req.path}: SUCCESS - sent email to ${email} for ${username} (${req.ip})`);
            res.status(200).send('Send email - Success');
        });
        this.app.post('/auth/recovery', rateLimitWithTrigger({
            windowMs: 1000,
            limit: 10,
            message: 'Too many account recovery requests'
        }, (req, res) => this.logger.warn(`Recovery rate limit triggered by ${req.ip}`)), parseBodyJson(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            recoveryPassword: 'required|encryptedLen:1024,1',
            newPassword: 'required|encryptedLen:1024,1'
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.path}: 403 Signed in`);
                res.status(403).send('Cannot recover account while signed in');
                return;
            }
            const username = req.body.username;
            const recoveryPassword = await this.encryption.decrypt(req.body.recoveryPassword);
            const newPassword = await this.encryption.decrypt(req.body.newPassword);
            if (typeof recoveryPassword != 'string' || typeof newPassword != 'string') {
                this.logger.error(`${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.changeAccountPasswordToken(username, recoveryPassword, newPassword);
            if (check == DatabaseOpCode.SUCCESS) this.logger.info(`${req.path} success: Account recovered, password reset for ${username} (${req.ip})`);
            sendDatabaseResponse(req, res, check, { [DatabaseOpCode.INCORRECT_CREDENTIALS]: 'Incorrect recovery password (perhaps a successful login rotated it?)' }, this.logger, username);
        });
        this.app.put('/auth/changePassword', parseBodyJson(), validateRequestBody({
            password: 'required|encryptedLen:1024,1',
            newPassword: 'required|encryptedLen:1024,1'
        }, this.logger), async (req, res) => {
            if (!this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.path}: 401 Unauthorized`);
                res.status(401).send('Cannot change password while not logged in');
                return;
            }
            const username = this.sessionTokens.getTokenData(req.cookies.sessionToken);
            const password = await this.encryption.decrypt(req.body.password);
            const newPassword = await this.encryption.decrypt(req.body.newPassword);
            if (typeof username != 'string' || typeof password != 'string' || typeof newPassword != 'string') {
                this.logger.error(`${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.changeAccountPassword(username, password, newPassword);
            if (check == DatabaseOpCode.SUCCESS) this.logger.info(`${req.path} success: Password changed for ${username} (${req.ip})`);
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.delete('/auth/delete', parseBodyJson(), validateRequestBody({
            password: 'required|encryptedLen:1024,1'
        }, this.logger), async (req, res) => {
            if (!this.sessionTokens.tokenExists(req.cookies.sessionToken)) {
                if (config.debugMode) this.logger.debug(`${req.path}: 401 Unauthorized`);
                res.status(401).send('Cannot delete account while not logged in');
                return;
            }
            const username = this.sessionTokens.getTokenData(req.cookies.sessionToken);
            const password = await this.encryption.decrypt(req.body.password);
            if (typeof username != 'string' || typeof password != 'string') {
                this.logger.error(`${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.deleteAccount(username, password);
            if (check == DatabaseOpCode.SUCCESS) this.logger.info(`${req.path} success: Deleted ${username} (${req.ip})`);
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        // reserve /auth path
        this.app.use('/auth/*', (req, res) => res.sendStatus(404));
    }

    isTokenValid(token: any): boolean {
        return this.sessionTokens.tokenExists(token);
    }

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
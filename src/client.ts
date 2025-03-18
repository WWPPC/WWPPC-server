import bodyParser from 'body-parser';
import { Express } from 'express';
import { extendMessages as nivExtendMessages, extend as nivExtend, Validator } from 'node-input-validator';

import config from './config';
import { RSAEncryptionHandler, TokenHandler } from './cryptoUtil';
import Database, { AccountData, AccountOpResult, Score, TeamData, TeamOpResult } from './database';
import Mailer from './email';
import Logger, { defaultLogger, NamedLogger } from './log';
import { rateLimitWithTrigger, reverse_enum } from './util';

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
        const validLanguages = ['python', 'c', 'cpp', 'cs', 'java', 'js', 'sql', 'asm', 'php', 'swift', 'pascal', 'ruby', 'rust', 'scratch', 'g', 'ktx', 'lua', 'bash'];
        const validGrades = [8, 9, 10, 11, 12, 13, 14];
        const validExperienceLevels = [0, 1, 2, 3, 4];
        setInterval(() => this.recentPasswordResetEmails.forEach((v, k) => {
            if (this.recentPasswordResetEmails.get(k)! < performance.now() - config.recoveryEmailTimeout * 60000) this.recentPasswordResetEmails.delete(k);
        }), config.recoveryEmailTimeout * 60000);
        this.app.get('/auth/publicKey', (req, res) => {
            res.send(this.encryption.publicKey);
        });
        this.app.post('/auth/login', bodyParser.json(), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies)) {
                res.status(200).send('Already signed in');
                return;
            }
            const validator = new Validator(req.body, {
                username: 'required|lowerAlphaNumDash|length:16,1',
                password: 'required|encryptedLen:1024,1'
            });
            validator.doBail = !config.debugMode;
            if (!await validator.check()) {
                if (config.debugMode) this.logger.warn(`/auth/login fail: ${validator.errors} (${req.ip})`);
                res.status(400).send(validator.errors);
                return;
            }
            const username = req.body.username;
            const password = await this.encryption.decrypt(req.body.password);
            if (typeof password != 'string') {
                this.logger.error('/auth/login fail: password decrypt failed after password verification');
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.checkAccount(req.body.username, password);
            if (config.debugMode) this.logger.info(`/auth/login: ${reverse_enum(AccountOpResult, check)} (${username}, ${req.ip})`);
            switch (check) {
                case AccountOpResult.SUCCESS:
                    this.sessionTokens.createToken(username, config.sessionExpireTime);
                    res.sendStatus(200);
                    break;
                case AccountOpResult.NOT_EXISTS:
                    res.status(404).send('Account not found');
                    break;
                case AccountOpResult.INCORRECT_CREDENTIALS:
                    res.status(401).send('Incorrect password');
                    break;
                case AccountOpResult.ERROR:
                    this.logger.error(`/auth/login error (${username}, ${req.ip})`);
                    res.sendStatus(503);
                    break;
                default:
                    this.logger.error(`/auth/login unexpected AccountOpResult ${reverse_enum(AccountOpResult, check)}`);
                    res.sendStatus(503);
            }
        });
        this.app.post('/auth/signup', rateLimitWithTrigger({
            windowMs: 60000,
            limit: config.maxSignupPerMinute,
            message: 'Too many account creation requests'
        }, (req, res) => this.logger.warn(`Signup rate limiting triggered by ${req.ip}`)), bodyParser.json(), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.token)) {
                res.status(403).send('Cannot create account while signed in');
                return;
            }
            const validator = new Validator(req.body, {
                username: 'required|lowerAlphaNumDash|length:16,1',
                password: 'required|encryptedLen:1024,1',
                email: 'required|encryptedEmail',
                firstName: 'required|string|length:32',
                lastName: 'required|string|length:32',
                school: 'required|string|length:64',
                languages: 'required|arrayUnique|length:32',
                'languages.*': `required|string|in:${validLanguages.join()}`,
                grade: `required|integer|in:${validGrades.join()}`,
                experience: `required|integer|in:${validExperienceLevels.join()}`
            });
            validator.doBail = !config.debugMode;
            if (!await validator.check()) {
                if (config.debugMode) this.logger.warn(`/auth/signup fail: ${validator.errors} (${req.ip})`);
                res.status(400).send(validator.errors);
                return;
            }
            if ()
                const username = req.body.username;
            const password = await this.encryption.decrypt(req.body.password);
            if (typeof password != 'string') {
                this.logger.error('/auth/signup fail: password decrypt failed after password verification');
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.createAccount(username, password, {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                school: req.body.school,
                grade: req.body.grade,
                experience: req.body.experience,
                languages: req.body.languages
            });
            if (config.debugMode) this.logger.info(`/auth/signup: ${reverse_enum(AccountOpResult, check)} (${username}, ${req.ip})`);
            switch (check) {
                case AccountOpResult.SUCCESS:
                    this.sessionTokens.createToken(username, config.sessionExpireTime);
                    this.logger.info(`Created account: ${username} (${req.ip})`);
                    res.sendStatus(200);
                    break;
                case AccountOpResult.ALREADY_EXISTS:
                    res.status(409).send('Account already exists');
                    break;
                case AccountOpResult.ERROR:
                    this.logger.error(`/auth/signup error (${username}, ${req.ip})`);
                    res.sendStatus(503);
                    break;
                default:
                    this.logger.error(`/auth/signup unexpected AccountOpResult ${reverse_enum(AccountOpResult, check)}`);
                    res.sendStatus(503);
            }
        });
        this.app.post('/auth/requestRecovery', rateLimitWithTrigger({
            windowMs: 1000,
            limit: 10,
            message: 'Too many account recovery requests'
        }, (req, res) => this.logger.warn(`Recovery request rate limit triggered by ${req.ip}`)), bodyParser.json(), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.token)) {
                res.status(403).send('Cannot request account recovery while signed in');
                return;
            }
            const validator = new Validator(req.body, {
                username: 'required|lowerAlphaNumDash|length:16,1',
                email: 'required|encryptedEmail',
            });
            validator.doBail = !config.debugMode;
            if (!await validator.check()) {
                if (config.debugMode) this.logger.warn(`/auth/requestRecovery fail: ${validator.errors} (${req.ip})`);
                res.status(400).send(validator.errors);
                return;
            }
            const username = req.body.username;
            const email = await this.encryption.decrypt(req.body.email);
            if (typeof email != 'string') {
                this.logger.error('/auth/requestRecovery fail: email decrypt failed after password verification');
                res.status(503).send('Email decryption error');
                return;
            }
            // rate limiting by username as well (significantly longer timeout) to combat email spam
            if (this.recentPasswordResetEmails.get(username) ?? -Infinity >= performance.now() - config.recoveryEmailTimeout * 60000) {
                this.logger.info(`/auth/requestRecovery fail: too many requests (${username}, ${req.ip})`);
                res.status(403).send('Too many recovery requests for this account');
                return;
            }
            this.recentPasswordResetEmails.set(username, performance.now());
            const data = await this.db.getAccountData(username);
            if (typeof data != 'object') {
                if (config.debugMode) this.logger.debug(`/auth/requestRecovery fail: ${reverse_enum(AccountOpResult, data)} (${username}, ${req.ip})`);
                switch (data) {
                    case AccountOpResult.NOT_EXISTS:
                        res.status(404).send('Account not found');
                        break;
                    case AccountOpResult.ERROR:
                        this.logger.error(`/auth/requestRecovery error (${username}, ${req.ip})`);
                        res.sendStatus(503);
                    default:
                        this.logger.error(`/auth/requestRecovery unexpected AccountOpResult ${reverse_enum(AccountOpResult, data)}`);
                        res.sendStatus(503);
                }
                return;
            }
            if (email != data.email) {
                this.logger.info(`/auth/requestRecovery fail: incorrect email (${username}, ${req.ip})`);
                res.status(401).send('Incorrect email');
                return;
            }
            this.logger.info(`Account recovery via email started: ${username} (${req.ip})`);
            const recoveryPassword = await this.db.getRecoveryPassword(username);
            if (typeof recoveryPassword != 'string') {
                // this definitely shouldn't happen EVER
                this.logger.error(`/auth/requestRecovery fail: get recovery password ${reverse_enum(AccountOpResult, data)} (${username}, ${req.ip})`);
                res.sendStatus(503);
                return;
            }
            const mailErr = await this.mailer.sendFromTemplate('password-reset', [email], 'Reset Password', [
                ['name', data.displayName],
                ['user', encodeURI(username)],
                ['pass', encodeURI(recoveryPassword)]
            ], `Hallo ${data.displayName}!\nYou recently requested a password reset. Reset it here: https://${config.hostname}/recovery/?user=${encodeURI(creds.username)}&pass=${encodeURI(recoveryPassword)}.\nNot you? You can ignore this email.`);
            if (mailErr !== undefined) {
                this.logger.error(`/auth/requestRecovery fail: email error ${mailErr.message} (${username}, ${req.ip})`);
                res.status(503).send('Internal email error');
                return;
            }
            this.logger.info(`/auth/requestRecovery success: sent email to ${email} for ${username} (${req.ip})`);
            res.send(200);
        });
        this.app.post('/auth/recovery', rateLimitWithTrigger({
            windowMs: 1000,
            limit: 10,
            message: 'Too many account recovery requests'
        }, (req, res) => this.logger.warn(`Recovery rate limit triggered by ${req.ip}`)), bodyParser.json(), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.token)) {
                res.status(403).send('Cannot recover account while signed in');
                return;
            }
            const validator = new Validator(req.body, {
                username: 'required|lowerAlphaNumDash|length:16,1',
                recoveryPassword: 'required|encryptedLen:1024,1',
                newPassword: 'required|encryptedLen:1024,1'
            });
            validator.doBail = !config.debugMode;
            if (!await validator.check()) {
                if (config.debugMode) this.logger.warn(`/auth/recovery fail: ${validator.errors} (${req.ip})`);
                res.status(400).send(validator.errors);
                return;
            }
            const username = req.body.username;
            const recoveryPassword = await this.encryption.decrypt(req.body.recoveryPassword);
            const newPassword = await this.encryption.decrypt(req.body.newPassword);
            if (typeof recoveryPassword != 'string' || typeof newPassword != 'string') {
                this.logger.error('/auth/recovery fail: password decrypt failed after password verification');
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.changeAccountPasswordToken(username, recoveryPassword, newPassword);
            if (config.debugMode) this.logger.info(`/auth/recovery: ${reverse_enum(AccountOpResult, check)} (${username}, ${req.ip})`);
            switch (check) {
                case AccountOpResult.SUCCESS:
                    this.logger.info(`/auht/recovery success: Account recovered, password reset for ${username} (${req.ip})`);
                    res.sendStatus(200);
                    break;
                case AccountOpResult.NOT_EXISTS:
                    res.status(404).send('Account not found');
                    break;
                case AccountOpResult.INCORRECT_CREDENTIALS:
                    res.status(401).send('Incorrect recovery password (perhaps a successful login rotated it?)');
                    break;
                case AccountOpResult.ERROR:
                    this.logger.error(`/auth/recovery error (${username}, ${req.ip})`);
                    res.sendStatus(503);
                    break;
                default:
                    this.logger.error(`/auth/recovery unexpected AccountOpResult ${reverse_enum(AccountOpResult, check)}`);
                    res.sendStatus(503);
            }
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
     * @param {Database} db Database connection
     * @param {Express} app Express app (HTTP server) to attach API to
     * @param {Mailer} mailer SMTP mailing server connection
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

    async handleSocketConnection(s: ServerSocket): Promise<void> {
        const socket = s;
        // add remaining listeners
        socket.on('setUserData', async (data: { firstName: string, lastName: string, displayName: string, profileImage: string, bio: string, school: string, grade: number, experience: number, languages: string[] }, cb: (res: AccountOpResult) => any) => {
            if (config.debugMode) socket.logWithId(this.logger.info, 'Updating user data');
            if (data == null || typeof data.firstName != 'string' || data.firstName.length > 32 || typeof data.lastName != 'string' || data.lastName.length > 32 || typeof data.displayName != 'string'
                || data.displayName.length > 32 || typeof data.profileImage != 'string' || Buffer.byteLength(data.profileImage, 'base64url') > config.maxProfileImgSize || typeof data.bio != 'string' || data.bio.length > 2048
                || typeof data.school != 'string' || data.school.length > 64 || typeof data.grade != 'number' || typeof data.experience != 'number'
                || !Array.isArray(data.languages) || data.languages.length > 64 || data.languages.some((v) => typeof v != 'string' || v.length > 64) || typeof cb != 'function') {
                socket.kick('invalid setUserData payload');
                return;
            }
            // some fields aren't used, so it doesn't matter
            const userDat: AccountData = {
                username: socket.username,
                email: '',
                firstName: data.firstName,
                lastName: data.lastName,
                displayName: data.displayName,
                profileImage: data.profileImage,
                bio: data.bio,
                school: data.school,
                grade: data.grade,
                experience: data.experience,
                languages: data.languages,
                registrations: [],
                pastRegistrations: [],
                team: ''
            };
            const res = await this.database.updateAccountData(socket.username, userDat);
            cb(res);
            if (config.debugMode) socket.logWithId(this.logger.debug, 'Update user data: ' + reverse_enum(AccountOpResult, res));
        });
        socket.on('changeCredentials', async (creds: { password: RSAEncrypted, newPassword: RSAEncrypted, token: string, session: number }, cb: (res: AccountOpResult) => any) => {
            if (creds == null || typeof cb != 'function') {
                socket.kick('null credentials');
                return;
            }
            if (creds.session !== this.clientEncryption.sessionID) {
                // different session would fail to decode
                cb(AccountOpResult.SESSION_EXPIRED);
                return;
            }
            const password = await this.clientEncryption.decrypt(creds.password);
            const newPassword = await this.clientEncryption.decrypt(creds.newPassword)
            if (typeof password != 'string' || typeof newPassword != 'string' || !this.database.validate(socket.username, password) || !this.database.validate(socket.username, newPassword)) {
                socket.kick('invalid credentials');
                return;
            }
            socket.logWithId(this.logger.info, 'Changing credentials');
            const recaptchaRes = await checkRecaptcha(creds.token);
            if (recaptchaRes != AccountOpResult.SUCCESS) {
                cb(recaptchaRes);
                socket.logWithId(this.logger.info, 'Delete credentials: ' + reverse_enum(AccountOpResult, recaptchaRes));
                return;
            }
            const res = await this.database.changeAccountPassword(socket.username, password, newPassword);
            cb(res);
            socket.logWithId(this.logger.info, 'Change credentials: ' + reverse_enum(AccountOpResult, res));
        });
        socket.on('deleteCredentials', async (creds: { password: RSAEncrypted, token: string, session: number }, cb: (res: AccountOpResult) => any) => {
            if (creds == null || typeof cb != 'function') {
                socket.kick('null credentials');
                return;
            }
            if (creds.session !== this.clientEncryption.sessionID) {
                // different session would fail to decode
                cb(AccountOpResult.SESSION_EXPIRED);
                return;
            }
            const password = await this.clientEncryption.decrypt(creds.password);
            if (typeof password != 'string' || !this.database.validate(socket.username, password)) {
                socket.kick('invalid credentials');
                return;
            }
            socket.logWithId(this.logger.info, 'Deleting credentials');
            const recaptchaRes = await checkRecaptcha(creds.token);
            if (recaptchaRes != AccountOpResult.SUCCESS) {
                cb(recaptchaRes);
                socket.logWithId(this.logger.info, 'Delete credentials: ' + reverse_enum(AccountOpResult, recaptchaRes));
                return;
            }
            const res = await this.database.deleteAccount(socket.username, password);
            cb(res);
            socket.logWithId(this.logger.info, 'Delete credentials: ' + reverse_enum(AccountOpResult, res));
        });
        socket.on('joinTeam', async (data: { code: string, token: string }, cb: (res: TeamOpResult) => any) => {
            if (data == null || typeof data.code != 'string' || typeof data.token != 'string' || typeof cb != 'function') {
                socket.kick('invalid joinTeam payload');
            }
            if (config.debugMode) socket.logWithId(this.logger.info, 'Joining team: ' + data.code);
            const respond = (code: TeamOpResult) => {
                cb(code);
                if (config.debugMode) socket.logWithId(this.logger.info, 'Join team: ' + reverse_enum(TeamOpResult, code));
            };
            const recaptchaRes = await checkRecaptcha(data.token);
            if (recaptchaRes != AccountOpResult.SUCCESS) {
                respond(recaptchaRes == AccountOpResult.CAPTCHA_FAILED ? TeamOpResult.CAPTCHA_FAILED : TeamOpResult.ERROR);
                return;
            }
            // first join so can check team data
            const res = await this.database.setAccountTeam(socket.username, data.code, true);
            if (res != TeamOpResult.SUCCESS) { respond(res); return; }
            const userData = await this.database.getAccountData(socket.username);
            const teamData = await this.database.getTeamData(socket.username);
            if (typeof teamData != 'object') { respond(teamData); return; }
            const resetTeam = async () => {
                const res2 = await this.database.setAccountTeam(socket.username, socket.username);
                if (res2 != TeamOpResult.SUCCESS) socket.logWithId(this.logger.warn, 'Join team failed but could not reset team! Code: ' + reverse_enum(TeamOpResult, res2));
            };
            if (typeof userData != 'object') {
                respond(userData == AccountOpResult.NOT_EXISTS ? TeamOpResult.NOT_EXISTS : TeamOpResult.ERROR);
                await resetTeam();
                return;
            }
            // nonexistent teams
            if (teamData.members.length == 1) {
                respond(TeamOpResult.NOT_EXISTS);
                await resetTeam();
                return;
            }
            // make sure won't violate restrictions
            const contests = await this.database.readContests({ id: userData.registrations });
            if (contests == null) { respond(TeamOpResult.ERROR); resetTeam(); return; }
            if (contests.some((c) => c.maxTeamSize < teamData.members.length)) {
                respond(TeamOpResult.CONTEST_MEMBER_LIMIT);
                await resetTeam();
                return;
            }
            const res2 = await this.database.unregisterAllContests(socket.username);
            if (res2 != TeamOpResult.SUCCESS) {
                respond(res2);
                await resetTeam();
                return;
            }
            // already set team before
            respond(TeamOpResult.SUCCESS);
            // update join code here
            if (typeof teamData == 'object') socket.emit('teamJoinCode', teamData.joinCode);
        });
        socket.on('leaveTeam', async (cb: (res: TeamOpResult) => any) => {
            if (typeof cb != 'function')
                if (config.debugMode) socket.logWithId(this.logger.info, 'Leaving team');
            const res = await this.database.setAccountTeam(socket.username, socket.username);
            cb(res);
            const teamData = await this.database.getTeamData(socket.username);
            if (typeof teamData == 'object') socket.emit('teamJoinCode', teamData.joinCode);
        });
        socket.on('kickTeam', async (data: { user: string, token: string }, cb: (res: TeamOpResult) => any) => {
            if (data == null || typeof data.user != 'string' || typeof data.token != 'string' || typeof cb != 'function') {
                socket.kick('invalid kickTeam payload');
            }
            if (config.debugMode) socket.logWithId(this.logger.info, 'Kicking user from team: ' + data.user);
            const respond = (code: TeamOpResult) => {
                cb(res);
                if (config.debugMode) socket.logWithId(this.logger.info, 'Kick user: ' + reverse_enum(TeamOpResult, code));
            };
            const recaptchaRes = await checkRecaptcha(data.token);
            if (recaptchaRes != AccountOpResult.SUCCESS) {
                respond(recaptchaRes == AccountOpResult.CAPTCHA_FAILED ? TeamOpResult.CAPTCHA_FAILED : TeamOpResult.ERROR);
                return;
            }
            const res = await this.database.setAccountTeam(data.user, data.user);
            respond(res);
        });
        socket.on('setTeamData', async (data: { teamName: string, teamBio: string }, cb: (res: TeamOpResult) => any) => {
            if (config.debugMode) socket.logWithId(this.logger.info, 'Updating team data');
            if (data == null || typeof data.teamName != 'string' || data.teamName.length > 32 || typeof data.teamBio != 'string' || data.teamBio.length > 1024 || typeof cb != 'function') {
                socket.kick('invalid setTeamData payload');
                return;
            }
            // some fields aren't used, so it doesn't matter
            const teamDat: TeamData = {
                id: '',
                name: data.teamName,
                bio: data.teamBio,
                members: [],
                joinCode: ''
            };
            const res = await this.database.updateTeamData(socket.username, teamDat);
            cb(res);
            if (config.debugMode) socket.logWithId(this.logger.debug, 'Update team data: ' + reverse_enum(AccountOpResult, res));

        });
        this.database.getTeamData(socket.username).then((data) => {
            if (typeof data == 'object') socket.emit('teamJoinCode', data.joinCode);
        });
        this.database.getAccountData(socket.username).then((data) => {
            if (typeof data == 'object') socket.emit('privateUserData', { email: data.email });
        });
        // hand off to ContestManager
        this.contestManager.addUser(socket);
        this.upsolveManager.addUser(socket);
    }
}

// client interfaces that are sometimes used
/**Slightly modified version of client Contest */
export interface ClientContest {
    readonly id: string
    rounds: ClientRound[]
    startTime: number
    endTime: number
}
/**Slightly modified version of client Round */
export interface ClientRound {
    readonly contest: string
    readonly number: number
    problems: ClientProblem[]
    startTime: number
    endTime: number
}
/**Slightly modified version of client Problem */
export interface ClientProblem {
    readonly id: string
    readonly contest: string
    readonly round: number
    readonly number: number
    name: string
    author: string
    content: string
    constraints: { memory: number, time: number }
    submissions: ClientSubmission[]
    status: ClientProblemCompletionState
}
/**Slightly modified version of client Submission */
export interface ClientSubmission {
    time: number
    lang: string
    scores: Score[]
    status: ClientProblemCompletionState
}
/**Client enum for completion state of problems */
export enum ClientProblemCompletionState {
    /**Not attempted */
    NOT_UPLOADED = 0,
    /**Uploaded but not graded, can still be changed */
    UPLOADED = 1,
    /**Submitted but not graded, submissions locked */
    SUBMITTED = 2,
    /**Submitted, graded, and passed all subtasks */
    GRADED_PASS = 3,
    /**Submitted, graded, and failed all subtasks */
    GRADED_FAIL = 4,
    /**Submitted, graded, passed at least one subtask and failed at least one subtask */
    GRADED_PARTIAL = 5,
    /**Error loading status */
    ERROR = 6
}
/**Client enum for submission response codes */
export enum ContestUpdateSubmissionResult {
    SUCCESS = 0,
    FILE_TOO_LARGE = 1,
    LANGUAGE_NOT_ACCEPTABLE = 2,
    PROBLEM_NOT_SUBMITTABLE = 3,
    ERROR = 4
}

export default ClientAuth;
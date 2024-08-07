import { Express } from 'express';
import { Socket as SocketIOSocket } from 'socket.io';

import config from './config';
import ContestManager from './contest';
import { RSAEncrypted, RSAEncryptionHandler } from './cryptoUtil';
import Database, { AccountData, AccountOpResult, Score, TeamData, TeamOpResult } from './database';
import Mailer from './email';
import Logger from './log';
import { validateRecaptcha } from './recaptcha';
import UpsolveManager from './upsolve';
import { reverse_enum } from './util';

/**
 * Bundles code for client networking into a single class.
 */
export class ClientHost {
    readonly clientEncryption: RSAEncryptionHandler;
    readonly database: Database;
    readonly app: Express;
    readonly contestManager: ContestManager;
    readonly upsolveManager: UpsolveManager;
    readonly mailer: Mailer;
    readonly logger: Logger;

    readonly #recentSignups = new Map<string, number>();
    readonly #recentPasswordResetEmails = new Set<string>();

    readonly ready: Promise<any>;

    /**
     * @param {Database} db Database connection
     * @param {Express} app Express app (HTTP server) to attach API to
     * @param {ContestManager} contests Contest manager instance
     * @param {UpsolveManager} upsolve Upsolve manager instance
     * @param {Mailer} mailer SMTP server connection
     * @param {Logger} logger Logging instance
     */
    constructor(db: Database, app: Express, contests: ContestManager, upsolve: UpsolveManager, mailer: Mailer, logger: Logger) {
        this.database = db;
        this.app = app;
        this.contestManager = contests;
        this.upsolveManager = upsolve;
        this.mailer = mailer;
        this.logger = logger;
        this.clientEncryption = new RSAEncryptionHandler(this.logger);
        this.ready = Promise.all([this.clientEncryption.ready]);

        // general api endpoints
        const clientConfig = {
            maxProfileImgSize: config.maxProfileImgSize,
            contests: Object.entries(config.contests).reduce((p, [cId, cConfig]) => {
                if (cConfig == undefined) return p;
                p[cId] = {
                    rounds: cConfig.rounds,
                    submitSolver: cConfig.submitSolver,
                    acceptedSolverLanguages: cConfig.acceptedSolverLanguages,
                    maxSubmissionSize: cConfig.maxSubmissionSize
                };
                return p;
            }, {})
        };
        app.get('/api/config', (req, res) => {
            res.json(clientConfig);
        });
        app.get('/api/userData/:username', async (req, res) => {
            const data = await this.database.getAccountData(req.params.username);
            if (data == AccountOpResult.NOT_EXISTS) res.sendStatus(404);
            else if (data == AccountOpResult.ERROR) res.sendStatus(500);
            else {
                const data2 = structuredClone(data);
                data2.email = '';
                res.json(data2);
            }
        });
        app.get('/api/teamData/:username', async (req, res) => {
            const data = await this.database.getTeamData(req.params.username);
            if (data == TeamOpResult.NOT_EXISTS) res.sendStatus(404);
            else if (data == TeamOpResult.ERROR) res.sendStatus(500);
            else {
                const data2 = structuredClone(data);
                data2.joinCode = '';
                res.json(data2);
            }
        });
        // reserve /api path
        app.use('/api/*', (req, res) => res.sendStatus(404));

        if (config.rsaKeyRotateInterval < 3600000) logger.warn('rsaKeyRotateInterval is set to a low value! This will result in frequent sign outs! Is this intentional?');
        setInterval(() => this.clientEncryption.rotateKeys(), config.rsaKeyRotateInterval);
        setInterval(() => this.#recentSignups.forEach((val, key) => this.#recentSignups.set(key, Math.max(val - 1, 0))), 1000);
        setInterval(() => this.#recentPasswordResetEmails.clear(), 600000);
    }

    /**
     * Add normal handlers for a client Socket.IO connection.
     * Performs authentication with reCAPTCHA, then adds user-specific endpoints over Socket.IO
     * @param {ServerSocket} s SocketIO connection (with modifications)
     */
    async handleSocketConnection(s: ServerSocket): Promise<void> {
        const socket = s;

        // await credentials before allowing anything (in a weird way)
        socket.username = '[not signed in]';
        if (config.debugMode) socket.logWithId(this.logger.debug, 'Connection established, sending public key and requesting credentials');
        socket.emit('getCredentials', { key: this.clientEncryption.publicKey, session: this.clientEncryption.sessionID });
        const checkRecaptcha = async (token: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> => {
            const recaptchaResponse = await validateRecaptcha(token, socket.ip);
            if (recaptchaResponse instanceof Error) {
                this.logger.error('reCAPTCHA verification failed:');
                this.logger.error(recaptchaResponse.message);
                if (recaptchaResponse.stack) this.logger.error(recaptchaResponse.stack);
                return AccountOpResult.ERROR;
            } else if (recaptchaResponse == undefined || recaptchaResponse.success !== true || recaptchaResponse.score < 0.8) {
                if (config.debugMode) {
                    socket.logWithId(this.logger.debug, 'reCAPTCHA verification failed:');
                    socket.logWithId(this.logger.debug, JSON.stringify(recaptchaResponse), true);
                }
                return AccountOpResult.INCORRECT_CREDENTIALS;
            } else if (config.debugMode) {
                socket.logWithId(this.logger.debug, 'reCAPTCHA verification successful:');
                socket.logWithId(this.logger.debug, JSON.stringify(recaptchaResponse), true);
            }
            return AccountOpResult.SUCCESS;
        };
        if (await new Promise((resolve, reject) => {
            socket.on('credentials', async (creds: { username: string, password: RSAEncrypted, token: string, session: number, signupData?: { firstName: string, lastName: string, email: string, school: string, grade: number, experience: number, languages: string[] } }, cb: (res: AccountOpResult) => any) => {
                if (creds == undefined || typeof cb != 'function') {
                    socket.kick('null credentials');
                    resolve(true);
                    return;
                }
                if (creds.session !== this.clientEncryption.sessionID) {
                    // different session would fail to decode
                    cb(AccountOpResult.SESSION_EXPIRED);
                    return;
                }
                const password = await this.clientEncryption.decrypt(creds.password);
                if (password instanceof Buffer) {
                    // for some reason decoding failed, redirect to login
                    cb(AccountOpResult.INCORRECT_CREDENTIALS);
                    if (config.debugMode) socket.logWithId(this.logger.debug, 'Credentials failed to decode');
                }
                if (typeof creds.username != 'string' || typeof password != 'string' || !this.database.validate(creds.username, password) || typeof creds.token != 'string') {
                    socket.kick('invalid credentials');
                    resolve(true);
                    return;
                }
                socket.username = creds.username;
                if (config.debugMode) socket.logWithId(this.logger.debug, 'Successfully received credentials');
                const recaptchaRes = await checkRecaptcha(creds.token);
                if (recaptchaRes != AccountOpResult.SUCCESS) {
                    cb(recaptchaRes);
                    return;
                }
                // actually create/check account
                if (creds.signupData != undefined) {
                    // spam prevention
                    if ((this.#recentSignups.get(socket.ip) ?? 0) > config.maxSignupPerMinute) {
                        socket.kick('too many sign-ups');
                        return;
                    }
                    this.#recentSignups.set(socket.ip, (this.#recentSignups.get(socket.ip) ?? 0) + 60);
                    // even more validation
                    if (typeof creds.signupData.firstName != 'string' || creds.signupData.firstName.length > 32 || typeof creds.signupData.lastName != 'string' || creds.signupData.lastName.length > 32 || typeof creds.signupData.email != 'string'
                        || creds.signupData.email.length > 32 || typeof creds.signupData.school != 'string' || creds.signupData.school.length > 64 || !Array.isArray(creds.signupData.languages) || creds.signupData.languages.find((v) => typeof v != 'string') !== undefined
                        || typeof creds.signupData.experience != 'number' || typeof creds.signupData.grade != 'number' || creds.token == undefined || typeof creds.token != 'string') {
                        socket.kick('invalid sign up data');
                        resolve(true);
                        return;
                    }
                    if (config.debugMode) socket.logWithId(this.logger.info, 'Signing up');
                    const res = await this.database.createAccount(creds.username, password, {
                        email: creds.signupData.email,
                        firstName: creds.signupData.firstName,
                        lastName: creds.signupData.lastName,
                        school: creds.signupData.school,
                        languages: creds.signupData.languages,
                        grade: creds.signupData.grade,
                        experience: creds.signupData.experience,
                    });
                    cb(res);
                    if (config.debugMode) socket.logWithId(this.logger.debug, 'Sign up: ' + reverse_enum(AccountOpResult, res));
                    if (res == 0) {
                        socket.removeAllListeners('credentials');
                        socket.removeAllListeners('requestRecovery');
                        socket.removeAllListeners('recoverCredentials');
                        resolve(false);
                    }
                } else {
                    if (config.debugMode) socket.logWithId(this.logger.info, 'Logging in');
                    const res = await this.database.checkAccount(creds.username, password);
                    cb(res);
                    if (config.debugMode) socket.logWithId(this.logger.debug, 'Log in: ' + reverse_enum(AccountOpResult, res));
                    if (res == 0) {
                        socket.removeAllListeners('credentials');
                        socket.removeAllListeners('requestRecovery');
                        socket.removeAllListeners('recoverCredentials');
                        resolve(false);
                    }
                }
            });
            socket.on('requestRecovery', async (creds: { username: string, email: string, token: string, session: number }, cb: (res: AccountOpResult) => any) => {
                if (creds == undefined || typeof cb != 'function') {
                    socket.kick('null credentials');
                    resolve(true);
                    return;
                }
                if (creds.session !== this.clientEncryption.sessionID) {
                    // different session would fail to decode
                    cb(AccountOpResult.SESSION_EXPIRED);
                    return;
                }
                if (typeof creds.username != 'string' || typeof creds.email != 'string' || !this.database.validate(creds.username, 'dummyPass') || typeof creds.token != 'string') {
                    socket.kick('invalid credentials');
                    return;
                }
                socket.logWithId(this.logger.info, 'Received request to send recovery email');
                const recaptchaRes = await checkRecaptcha(creds.token);
                if (recaptchaRes != AccountOpResult.SUCCESS) {
                    cb(recaptchaRes);
                    return;
                }
                const data = await this.database.getAccountData(creds.username);
                if (typeof data != 'object') {
                    cb(data);
                    if (config.debugMode) socket.logWithId(this.logger.debug, 'Could not send recovery email: ' + reverse_enum(AccountOpResult, data));
                    else if (data == AccountOpResult.ERROR) socket.logWithId(this.logger.error, 'Could not send recovery email: ' + reverse_enum(AccountOpResult, data));
                    return;
                }
                if (creds.email !== data.email) {
                    cb(AccountOpResult.INCORRECT_CREDENTIALS);
                    if (config.debugMode) socket.logWithId(this.logger.debug, 'Could not send recovery email: INCORRECT_CREDENTIALS');
                    return;
                }
                socket.logWithId(this.logger.info, 'Account recovery via email password reset started');
                if (this.#recentPasswordResetEmails.has(creds.username)) {
                    cb(AccountOpResult.ALREADY_EXISTS);
                    socket.logWithId(this.logger.warn, 'Account recovery email could not be sent because of rate limiting');
                    return;
                }
                const recoveryPassword = await this.database.getRecoveryPassword(creds.username);
                if (typeof recoveryPassword != 'string') {
                    cb(recoveryPassword);
                    if (config.debugMode) socket.logWithId(this.logger.debug, 'Could not send recovery email: ' + reverse_enum(AccountOpResult, recoveryPassword));
                    return;
                }
                const res = await this.mailer.sendFromTemplate('password-reset', [creds.email], 'Reset Password', [
                    ['name', data.displayName],
                    ['user', encodeURI(creds.username)],
                    ['pass', encodeURI(recoveryPassword)]
                ], `Hallo ${data.displayName}!\nYou recently requested a password reset. Reset it here: https://${config.hostname}/recovery/?user=${encodeURI(creds.username)}&pass=${encodeURI(recoveryPassword)}.\nNot you? You can ignore this email.`);
                if (res instanceof Error) {
                    socket.logWithId(this.logger.info, `Account recovery email could not be sent due to error: ${res.message}`);
                    cb(AccountOpResult.ERROR);
                    return;
                }
                this.#recentPasswordResetEmails.add(creds.username);
                cb(AccountOpResult.SUCCESS);
                socket.logWithId(this.logger.info, `Account recovery email was sent successfully (sent to ${creds.email})`);
                // remove the listener to try and combat spam some more
                socket.removeAllListeners('recoverCredentials');
            });
            socket.on('recoverCredentials', async (creds: { username: string, recoveryPassword: RSAEncrypted, newPassword: RSAEncrypted, token: string, session: number }, cb: (res: AccountOpResult) => any) => {
                if (creds == undefined || typeof cb != 'function') {
                    socket.kick('null credentials');
                    resolve(true);
                    return;
                }
                if (creds.session !== this.clientEncryption.sessionID) {
                    // different session would fail to decode
                    cb(AccountOpResult.SESSION_EXPIRED);
                    return;
                }
                const recoveryPassword = await this.clientEncryption.decrypt(creds.recoveryPassword);
                const newPassword = await this.clientEncryption.decrypt(creds.newPassword);
                if (typeof creds.username != 'string' || typeof recoveryPassword != 'string' || typeof newPassword != 'string' || !this.database.validate(creds.username, newPassword) || typeof creds.token != 'string') {
                    socket.kick('invalid credentials');
                    return;
                }
                socket.logWithId(this.logger.info, 'Received request to recover credentials');
                const recaptchaRes = await checkRecaptcha(creds.token);
                if (recaptchaRes != AccountOpResult.SUCCESS) {
                    cb(recaptchaRes);
                    return;
                }
                const res = await this.database.changeAccountPasswordToken(creds.username, recoveryPassword, newPassword);
                socket.logWithId(this.logger.info, 'Recover account: ' + reverse_enum(AccountOpResult, res));
                cb(res);
                // remove the listener to try and combat spam some more
                socket.removeAllListeners('recoverCredentials');
            });
        })) {
            if (config.debugMode) socket.logWithId(this.logger.debug, 'Authentication failed');
            return;
        }

        // only can reach this point after signing in
        if (config.debugMode) socket.logWithId(this.logger.debug, 'Authentication successful');
        socket.join(socket.username);

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
                respond(recaptchaRes == AccountOpResult.INCORRECT_CREDENTIALS ? TeamOpResult.INCORRECT_CREDENTIALS : TeamOpResult.ERROR);
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
                respond(recaptchaRes == AccountOpResult.INCORRECT_CREDENTIALS ? TeamOpResult.INCORRECT_CREDENTIALS : TeamOpResult.ERROR);
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

/**
 * Socket.IO connection with username, IP, logging, and kick function.
 */
export interface ServerSocket extends SocketIOSocket {
    kick(reason: string): void
    logWithId(logMethod: (s: string, logOnly?: boolean) => void, message: string, logOnly?: boolean): void
    ip: string
    username: string
}

export function createServerSocket(socket: SocketIOSocket, ip: string, logger: Logger): ServerSocket {
    const s2 = socket as ServerSocket;
    s2.kick = function (reason) {
        this.logWithId(logger.warn, 'Kicked for violating restrictions: ' + reason);
        socket.removeAllListeners();
        socket.disconnect();
    };
    s2.logWithId = (logMethod, message, logOnly) => {
        logMethod.call(logger, `${s2.username} @ ${s2.ip} | ${message}`, logOnly);
    };
    s2.ip = ip;
    s2.username = '';
    return s2;
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

export default ClientHost;
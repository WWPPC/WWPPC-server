import { json as parseBodyJson } from 'body-parser';
import { Express } from 'express';

import ClientAuth from './auth';
import config from './config';
import Database, { DatabaseOpCode } from './database';
import Mailer from './email';
import { defaultLogger, NamedLogger } from './log';
import { reverse_enum, sendDatabaseResponse, validateRequestBody } from './util';

/**
 * Bundles general API functions into a single class.
 */
export class ClientAPI {
    private static instance: ClientAPI | null = null;

    /**
     * Valid input values for fields within account data.
     */
    static readonly validAccountData = {
        languages: ['python', 'c', 'cpp', 'cs', 'java', 'js', 'sql', 'asm', 'php', 'swift', 'pascal', 'ruby', 'rust', 'scratch', 'g', 'ktx', 'lua', 'bash'] as const,
        grades: [8, 9, 10, 11, 12, 13, 14] as const,
        experienceLevels: [0, 1, 2, 3, 4] as const
    } as const;

    readonly db: Database;
    readonly app: Express;
    readonly mailer: Mailer;
    readonly logger: NamedLogger;

    private readonly clientConfig = {
        maxProfileImgSize: config.maxProfileImgSize,
        contests: Object.entries(config.contests).reduce<Record<string, object>>((p: Record<string, object>, [cId, cConfig]) => {
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

    private constructor(db: Database, app: Express, mailer: Mailer) {
        this.db = db;
        this.app = app;
        this.mailer = mailer;
        this.logger = new NamedLogger(defaultLogger, 'ClientAPI');
        this.createEndpoints();
    }

    private createEndpoints() {
        // always public
        this.app.get('/api/config', (req, res) => res.json(this.clientConfig));
        this.app.get('/api/userData/:username', async (req, res) => {
            const data = await this.db.getAccountData(req.params.username);
            if (config.debugMode) this.logger.debug(`${req.path}: ${typeof data == 'object' ? 'SUCCESS' : reverse_enum(DatabaseOpCode, data)} (${req.ip})`);
            if (data == DatabaseOpCode.NOT_EXISTS) res.sendStatus(404);
            else if (data == DatabaseOpCode.ERROR) res.sendStatus(500);
            else {
                // some info we don't want public
                const data2 = structuredClone(data);
                data2.email = '';
                res.json(data2);
            }
        });
        this.app.get('/api/teamData/:username', async (req, res) => {
            const data = await this.db.getTeamData(req.params.username);
            if (config.debugMode) this.logger.debug(`${req.path}: ${typeof data == 'object' ? 'SUCCESS' : reverse_enum(DatabaseOpCode, data)} (${req.ip})`);
            if (data == DatabaseOpCode.NOT_EXISTS) res.sendStatus(404);
            else if (data == DatabaseOpCode.ERROR) res.sendStatus(500);
            else {
                // some info we don't want public
                const data2 = structuredClone(data);
                data2.joinCode = '';
                res.json(data2);
            }
        });
        this.app.get('/api/coffee', (req, res) => {
            this.logger.warn(`Attempt to brew coffee using teapot (${req.ip})`);
            res.sendStatus(418);
        });
        // account & team management
        const auth = ClientAuth.use();
        this.app.use('/api/self/*', (req, res, next) => {
            if (auth.isTokenValid(req.cookies.sessionToken)) {
                // save username so don't have to check if token disappeared between this and later handlers
                req.cookies.tempUsername = auth.getTokenUsername(req.cookies.sessionToken);
                next();
            } else {
                if (config.debugMode) this.logger.debug(`${req.path}: 401 Unauthorized`);
                res.sendStatus(401);
            }
        });
        this.app.get('/api/self/userData', async (req, res) => {
            const username = req.cookies.tempUsername;
            const data = await this.db.getAccountData(username);
            if (config.debugMode) this.logger.debug(`${req.path}: ${typeof data == 'object' ? 'SUCCESS' : reverse_enum(DatabaseOpCode, data)} (${req.ip})`);
            if (typeof data == 'object') res.json(data);
            else sendDatabaseResponse(req, res, data, username, {}, this.logger);
        });
        this.app.put('/api/self/userData', parseBodyJson(), validateRequestBody({
            firstName: 'required|string|length:32,1',
            lastName: 'required|string|length:32,1',
            displayName: 'required|string|length:64,1',
            profileImage: `required|mime:jpg,png,webp|size:${config.maxProfileImgSize}`,
            bio: 'required|string|length:2048',
            school: 'required|string|length:64,1',
            languages: 'required|arrayUnique|length:32',
            'languages.*': `required|string|in:${ClientAPI.validAccountData.languages.join()}`,
            grade: `required|integer|in:${ClientAPI.validAccountData.grades.join()}`,
            experience: `required|integer|in:${ClientAPI.validAccountData.experienceLevels.join()}`
        }, this.logger), async (req, res) => {
            const username = req.cookies.tempUsername;
            const check = await this.db.updateAccountData(username, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.displayName,
                profileImage: req.body.profileImage,
                bio: req.body.bio,
                school: req.body.school,
                languages: req.body.languages,
                grade: req.body.grade,
                experience: req.body.experience
            });
            sendDatabaseResponse(req, res, check, username, {}, this.logger);
        });
        this.app.get('/api/self/teamData', async (req, res) => {
            const username = req.cookies.tempUsername;
            const data = await this.db.getTeamData(username);
            if (config.debugMode) this.logger.debug(`${req.path}: ${typeof data == 'object' ? 'SUCCESS' : reverse_enum(DatabaseOpCode, data)} (${req.ip})`);
            if (typeof data == 'object') res.json(data);
            else sendDatabaseResponse(req, res, data, username, {}, this.logger);
        });
        this.app.put('/api/self/teamData', parseBodyJson(), validateRequestBody({
            teamName: 'required|string|length:32,1',
            teamBio: 'required|string|length:1024'
        }, this.logger), async (req, res) => {
            const username = req.cookies.tempUsername;
            const check = await this.db.updateTeamData(username, {
                name: req.body.teamName,
                bio: req.body.teamBio
            });
            if (config.debugMode) this.logger.debug(`${req.path}: ${reverse_enum(DatabaseOpCode, check)} (${username}, ${req.ip})`);
            sendDatabaseResponse(req, res, check, username, {}, this.logger);
        });
        this.app.post('/api/self/joinTeam', parseBodyJson(), validateRequestBody({
            code: 'required|alphaDash|length:6,6'
        }), async (req, res) => {
            const username = req.cookies.tempUsername;
            // join the team first to be able to check rules for joining (a bit buh)
            const joinCheck = await this.db.setAccountTeam(username, req.body.code, true);
        });
        const socket = s;
        socket.on('joinTeam', async (data: { code: string, token: string }, cb: (res: DatabaseOpCode) => any) => {
            if (data == null || typeof data.code != 'string' || typeof data.token != 'string' || typeof cb != 'function') {
                socket.kick('invalid joinTeam payload');
            }
            if (config.debugMode) socket.logWithId(this.logger.info, 'Joining team: ' + data.code);
            const respond = (code: DatabaseOpCode) => {
                cb(code);
                if (config.debugMode) socket.logWithId(this.logger.info, 'Join team: ' + reverse_enum(DatabaseOpCode, code));
            };
            const recaptchaRes = await checkRecaptcha(data.token);
            if (recaptchaRes != DatabaseOpCode.SUCCESS) {
                respond(recaptchaRes == DatabaseOpCode.CAPTCHA_FAILED ? DatabaseOpCode.CAPTCHA_FAILED : DatabaseOpCode.ERROR);
                return;
            }
            // first join so can check team data
            const res = await this.db.setAccountTeam(socket.username, data.code, true);
            if (res != DatabaseOpCode.SUCCESS) { respond(res); return; }
            const userData = await this.db.getAccountData(socket.username);
            const teamData = await this.db.getTeamData(socket.username);
            if (typeof teamData != 'object') { respond(teamData); return; }
            const resetTeam = async () => {
                const res2 = await this.db.setAccountTeam(socket.username, socket.username);
                if (res2 != DatabaseOpCode.SUCCESS) socket.logWithId(this.logger.warn, 'Join team failed but could not reset team! Code: ' + reverse_enum(DatabaseOpCode, res2));
            };
            if (typeof userData != 'object') {
                respond(userData == DatabaseOpCode.NOT_EXISTS ? DatabaseOpCode.NOT_EXISTS : DatabaseOpCode.ERROR);
                await resetTeam();
                return;
            }
            // nonexistent teams
            if (teamData.members.length == 1) {
                respond(DatabaseOpCode.NOT_EXISTS);
                await resetTeam();
                return;
            }
            // make sure won't violate restrictions
            const contests = await this.db.readContests({ id: userData.registrations });
            if (contests == null) { respond(DatabaseOpCode.ERROR); resetTeam(); return; }
            if (contests.some((c) => c.maxTeamSize < teamData.members.length)) {
                respond(DatabaseOpCode.CONTEST_MEMBER_LIMIT);
                await resetTeam();
                return;
            }
            const res2 = await this.db.unregisterAllContests(socket.username);
            if (res2 != DatabaseOpCode.SUCCESS) {
                respond(res2);
                await resetTeam();
                return;
            }
            // already set team before
            respond(DatabaseOpCode.SUCCESS);
            // update join code here
            if (typeof teamData == 'object') socket.emit('teamJoinCode', teamData.joinCode);
        });
        socket.on('leaveTeam', async (cb: (res: DatabaseOpCode) => any) => {
            if (typeof cb != 'function')
                if (config.debugMode) socket.logWithId(this.logger.info, 'Leaving team');
            const res = await this.db.setAccountTeam(socket.username, socket.username);
            cb(res);
            const teamData = await this.db.getTeamData(socket.username);
            if (typeof teamData == 'object') socket.emit('teamJoinCode', teamData.joinCode);
        });
        socket.on('kickTeam', async (data: { user: string, token: string }, cb: (res: DatabaseOpCode) => any) => {
            if (data == null || typeof data.user != 'string' || typeof data.token != 'string' || typeof cb != 'function') {
                socket.kick('invalid kickTeam payload');
            }
            if (config.debugMode) socket.logWithId(this.logger.info, 'Kicking user from team: ' + data.user);
            const respond = (code: DatabaseOpCode) => {
                cb(res);
                if (config.debugMode) socket.logWithId(this.logger.info, 'Kick user: ' + reverse_enum(DatabaseOpCode, code));
            };
            const recaptchaRes = await checkRecaptcha(data.token);
            if (recaptchaRes != DatabaseOpCode.SUCCESS) {
                respond(recaptchaRes == DatabaseOpCode.CAPTCHA_FAILED ? DatabaseOpCode.CAPTCHA_FAILED : DatabaseOpCode.ERROR);
                return;
            }
            const res = await this.db.setAccountTeam(data.user, data.user);
            respond(res);
        });
    }

    /**
     * Initialize the client API.
     * @param {Database} db Database connection
     * @param {Express} app Express app (HTTP server) to attach API to
     * @param {Mailer} mailer SMTP mailing server connection
     */
    static init(db: Database, app: Express, mailer: Mailer): ClientAPI {
        return this.instance = this.instance ?? new ClientAPI(db, app, mailer);
    }

    /**
     * Get the client API instance.
     */
    static use(): ClientAPI {
        if (this.instance === null) throw new TypeError('ClientAPI init() must be called before use()');
        return this.instance;
    }
}

export default ClientAPI;
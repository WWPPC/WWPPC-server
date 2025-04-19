import bodyParser from 'body-parser';
import { Express, NextFunction, Request, Response } from 'express';

import ClientAPI, { ClientContest } from './api';
import config from './config';
import ContestManager from './contest';
import { RSAEncryptionHandler, TokenHandler } from './cryptoUtil';
import Database, { AdminPerms, Contest, DatabaseOpCode } from './database';
import { defaultLogger, FileLogger, MultiLogger, NamedLogger } from './log';
import { createNivEncryptedRules, LongPollEventEmitter, NamespacedLongPollEventEmitter, sendDatabaseResponse, validateRequestBody } from './netUtil';
import { TeamScore } from './scorer';
import { is_in_enum, isUUID } from './util';

/**Permissions that can be given to access tokens */
enum AdminAccessTokenPerms {
    /**Read leaderboards of ongoing contests */
    READ_CONTESTS = 'readLeaderboards'
}

/**
 * Bundles administrator API into a single class.
 */
export class AdminAPI {
    private static instance: AdminAPI | null = null;

    readonly db: Database;
    readonly app: Express;
    readonly logger: NamedLogger;
    readonly encryption: RSAEncryptionHandler;
    private readonly sessionTokens: TokenHandler<string> = new TokenHandler<string>();
    private readonly accessTokens: TokenHandler<AdminAccessTokenPerms[]> = new TokenHandler<AdminAccessTokenPerms[]>();
    private readonly longPollingGlobal: LongPollEventEmitter<{
        contests: string[]
    }>;
    private readonly longPollingContests: NamespacedLongPollEventEmitter<{
        contestData: ClientContest
        contestScoreboards: { scores: ({ team: number } & TeamScore)[], frozen: boolean }
        contestNotifications: never
    }>;

    private constructor(db: Database, app: Express) {
        this.db = db;
        this.app = app;
        this.logger = new NamedLogger(defaultLogger, 'AdminAPI');
        this.encryption = new RSAEncryptionHandler(this.logger);
        this.longPollingGlobal = new LongPollEventEmitter(this.logger);
        this.longPollingContests = new NamespacedLongPollEventEmitter(this.logger);
        createNivEncryptedRules(this.encryption, 'admin');
        this.createEndpoints();
    }

    /**
     * Create HTTP endpoints
     */
    private createEndpoints() {
        this.logger.info('Attaching admin portal to /admin/');
        const contestManager = ContestManager.use();
        // require authentication for everything except login
        this.app.use('/admin/*', (req, res, next) => {
            if (req.baseUrl == '/admin/login' || req.baseUrl == '/admin/authLogin' || req.baseUrl == '/admin/publicKey') next();
            else if (!this.sessionTokens.tokenExists(req.cookies.adminToken) && !this.accessTokens.tokenExists(req.cookies.adminAccessToken)) sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger);
            else next();
        });
        this.app.get('/admin/publicKey', (req, res) => {
            res.json(this.encryption.publicKey);
        });
        this.app.get('/admin/login', (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.adminToken) || this.accessTokens.tokenExists(req.cookies.adminAccessToken)) sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, {}, this.logger);
            else sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger);
        });
        this.app.post('/admin/login', bodyParser.json(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            password: 'required|encryptedLen-admin:1024,1'
        }, this.logger), async (req, res) => {
            if (this.sessionTokens.tokenExists(req.cookies.adminToken) || this.accessTokens.tokenExists(req.cookies.adminAccessToken)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, 'Already signed in', this.logger);
                return;
            }
            const username = req.body.username;
            const password = await this.encryption.decrypt(req.body.password);
            if (typeof password != 'string') {
                this.logger.error(`${req.method} ${req.path} fail: password decrypt failed after password verification`);
                res.status(503).send('Password decryption error');
                return;
            }
            const check = await this.db.checkAccount(req.body.username, password);
            if (check == DatabaseOpCode.SUCCESS) {
                const perms = await this.db.hasAdminPerms(req.body.username, AdminPerms.ADMIN);
                if (typeof perms != 'boolean') {
                    sendDatabaseResponse(req, res, perms, { [DatabaseOpCode.NOT_FOUND]: 'Not an admin'}, this.logger, username);
                    return;
                }
                if (perms) {
                    const token = this.sessionTokens.createToken(username, config.sessionExpireTime * 3600);
                    res.cookie('adminToken', token, {
                        expires: new Date(this.sessionTokens.tokenExpiration(token)!),
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true
                    });
                } else {
                    sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, {}, this.logger, username);
                    return;
                }
            }
            sendDatabaseResponse(req, res, check, { [DatabaseOpCode.UNAUTHORIZED]: 'Incorrect password' }, this.logger, username);
        });
        this.app.post('/admin/authLogin', bodyParser.text(), async (req, res) => {
            if (typeof req.body != 'string') {
                res.sendStatus(400);
                return;
            }
            if (!this.accessTokens.tokenExists(req.body)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger);
                return;
            }
            console.log("BUH");
            res.cookie('adminAccessToken', req.body, {
                expires: new Date(this.sessionTokens.tokenExpiration(req.body)!),
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            sendDatabaseResponse(req, res, DatabaseOpCode.SUCCESS, {}, this.logger);
        });

        // logs
        const fileLogger = defaultLogger instanceof MultiLogger && defaultLogger.children()[0] instanceof FileLogger ? defaultLogger.children()[0] as FileLogger : undefined;
        this.app.get('/admin/logTail', async (req, res) => {
            if (fileLogger !== undefined)
                res.send(fileLogger.tail());
            else res.status(404).send('Log tails not tracked');
        });
        this.app.get('/admin/logs', async (req, res) => {
            if (fileLogger !== undefined)
                res.sendFile(fileLogger.filePath);
            else res.status(404).send('Logs not tracked');
        });
        // access tokens
        this.app.get('/admin/accessTokens/ruleset', (req, res) => {
            res.json(Object.values(AdminAccessTokenPerms).filter(k => isNaN(Number(k))));
        });
        this.app.get('/admin/accessTokens/list', this.checkPerms(AdminPerms.MANAGE_ADMINS), async (req, res) => {
            res.json(Object.entries(this.accessTokens.getTokens()).map(([token, perms]) => ({ id: token, perms: perms })));
        });
        this.app.post('/admin/accessTokens/create', this.checkPerms(AdminPerms.MANAGE_ADMINS), bodyParser.json(), validateRequestBody({
            permissions: 'required|array',
            'permissions.*': `required|string|in:${Object.values(AdminAccessTokenPerms).join()}`,
            expiration: 'required|integer|min:0',
        }, this.logger), async (req, res) => {
            const token = this.accessTokens.createToken(req.body.permissions, req.body.expiration);
            res.json(token);
            this.logger.info(`Access token ${token} created by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        this.app.delete('/admin/accessTokens/delete/:id', this.checkPerms(AdminPerms.MANAGE_ADMINS), async (req, res) => {
            if (!this.accessTokens.tokenExists(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            this.accessTokens.removeToken(req.params.id);
            res.sendStatus(200);
            this.logger.info(`Access token ${req.params.id} deleted by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        // general functions
        this.app.post('/admin/api/clearCache', async (req, res) => {
            this.db.clearCache();
            res.sendStatus(200);
        });
        // accounts (ADMINS CAN BYPASS RESTRICTIONS LIKE MAXIMUM LENGTHS)
        this.app.get('/admin/api/accountList', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), async (req, res) => {
            const data = await this.db.getAccountList();
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/admin/api/account/:username', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), async (req, res) => {
            const data = await this.db.getAccountData(req.params.username);
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.post('/admin/api/account/:username', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), bodyParser.json(), validateRequestBody({
            firstName: 'required|string|length:32,1',
            lastName: 'required|string|length:32,1',
            displayName: 'required|string|length:64,1',
            email2: 'required|encryptedEmail-admin',
            profileImage: `required|mime:jpg,png,webp|size:${config.maxProfileImgSize}`,
            bio: 'required|string|length:2048',
            organization: 'required|string|length:64,1',
            languages: 'required|arrayUnique|length:32',
            'languages.*': `required|string|in:${ClientAPI.validAccountData.languages.join()}`,
            grade: `required|integer|in:${ClientAPI.validAccountData.grades.join()}`,
            experience: `required|integer|in:${ClientAPI.validAccountData.experienceLevels.join()}`
        }, this.logger), async (req, res) => {
            const check = await this.db.updateAccountData(req.params.username, {
                email2: req.body.email2,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.displayName,
                profileImage: req.body.profileImage,
                bio: req.body.bio,
                organization: req.body.organization,
                languages: req.body.languages,
                grade: req.body.grade,
                experience: req.body.experience
            });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            //TODO: make this only log on success
            this.logger.info(`Account "${req.params.username}" modified by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        this.app.delete('/admin/api/account/:username', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), bodyParser.json(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            password: 'required|encryptedLen-admin:1024,1'
        }, this.logger), async (req, res) => {
            const data = await this.db.deleteAccount(req.params.username, req.body.password, this.sessionTokens.getTokenData(req.cookies.adminToken) ?? 'invalid-username-that-is-not-an-administrator');
            sendDatabaseResponse(req, res, data, {}, this.logger);
            this.logger.info(`Account "${req.params.username}" deleted by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        this.app.get('/admin/api/team/:id', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), async (req, res) => {
            const data = await this.db.getTeamData(parseInt(req.params.id, 36));
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.post('/admin/api/team/:id', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), validateRequestBody({
            teamName: 'required|string|length:32,1',
            teamBio: 'required|string|length:1024'
        }, this.logger), async (req, res) => {
            const check = await this.db.updateTeamData(parseInt(req.params.id, 36), {
                name: req.body.teamName,
                bio: req.body.teamBio
            });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Team "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        // admins (bespoke!!)
        this.app.get('/admin/api/admins', this.checkPerms(AdminPerms.MANAGE_ADMINS), async (req, res) => {
            const data = await this.db.getAdminList();
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.post('/admin/api/admin/:username', this.checkPerms(AdminPerms.MANAGE_ADMINS), bodyParser.json(), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            permissions: 'required|integer|min:1'
        }, this.logger), async (req, res) => {
            const check = await this.db.setAdminPerms(req.params.username, req.body.permissions);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Administrator ${req.params.username} modified by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        this.app.delete('/admin/api/admin/:username', this.checkPerms(AdminPerms.MANAGE_ADMINS), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
        }, this.logger), async (req, res) => {
            const check = await this.db.setAdminPerms(req.params.username, 0);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Administrator ${req.params.username} deleted by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        // contests
        this.app.get('/admin/api/contestList', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            const data = await this.db.getContestList();
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/admin/api/contest/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            const data = await this.db.readContests({ id: req.params.id });
            if (Array.isArray(data)) {
                if (data.length == 0) {
                    res.sendStatus(404);
                } else {
                    res.json(data[0]);
                }
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.post('/admin/api/contest/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), bodyParser.json(), validateRequestBody({
            rounds: 'required|array',
            'rounds.*': 'required|uuid',
            exclusions: 'required|array',
            'exclusions.*': 'required|string',
            type: `required|string|in:${Object.keys(config.contests).join()}`,
            maxTeamSize: 'required|integer|min:1',
            startTime: 'required|integer|min:0',
            endTime: 'required|integer|gte:startTime',
            public: 'required|boolean'
        }, this.logger), async (req, res) => {
            const check = await this.db.writeContest({ id: req.params.id, ...req.body });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Contest "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        this.app.delete('/admin/api/contest/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            const check = await this.db.deleteContest(req.params.id);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Contest "${req.params.id}" deleted by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        // rounds
        this.app.get('/admin/api/roundList', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            const data = await this.db.getRoundList();
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/admin/api/round/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const data = await this.db.readRounds({ id: req.params.id });
            if (Array.isArray(data)) {
                if (data.length == 0) {
                    res.sendStatus(404);
                } else {
                    res.json(data[0]);
                }
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        //TODO: move the body parser after checkPerms cuz we dont need it to check perms
        this.app.post('/admin/api/round/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), bodyParser.json(), validateRequestBody({
            problems: 'required|array',
            'problems.*': 'required|uuid',
            startTime: 'required|integer|min:0',
            endTime: 'required|integer|gte:startTime',
        }, this.logger), async (req, res) => {
            const check = await this.db.writeRound({ id: req.params.id, ...req.body });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Round "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        this.app.delete('/admin/api/round/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const check = await this.db.deleteRound(req.params.id);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Round "${req.params.id}" deleted by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        // problems
        this.app.get('/admin/api/problemList', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            const data = await this.db.getProblemList();
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/admin/api/problem/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const data = await this.db.readProblems({ id: req.params.id });
            if (Array.isArray(data)) {
                if (data.length == 0) {
                    res.sendStatus(404);
                } else {
                    res.json(data[0]);
                }
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.post('/admin/api/problem/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), bodyParser.json(), validateRequestBody({
            name: 'required|string',
            author: 'required|string',
            content: 'required|string',
            constraints: 'required|object',
            'constraints.time': 'required|integer|min:1',
            'constraints.memory': 'required|integer|min:1'
        }, this.logger), async (req, res) => {
            const check = await this.db.writeProblem({ id: req.params.id, ...req.body });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Problem "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        this.app.delete('/admin/api/problem/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const check = await this.db.deleteProblem(req.params.id);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Problem "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });
        // contest control functions
        // live leaderboards
        // ADD AUTH BACK
        // ADD AUTH BACK
        // ADD AUTH BACK
        // ADD AUTH BACK
        this.app.get('/admin-temp/api/contests')
        this.app.get('/admin/api/runningContests', this.checkPerms(AdminPerms.CONTROL_CONTESTS, AdminAccessTokenPerms.READ_CONTESTS), async (req, res) => {
            res.json(contestManager.getRunningContests().map(host => ({
                clientScoreboards: Array.from(host.clientScoreboards).map(s => ({ username: s[0], score: s[1] })),
                scoreboards: Array.from(host.scoreboards).map(s => ({ username: s[0], score: s[1] })),
                contest: host.contestData
            })));
        });
        this.app.post('/admin/api/reloadContest/:id', this.checkPerms(AdminPerms.CONTROL_CONTESTS), async (req, res) => {
            const runningContests = contestManager.getRunningContests();
            const contestHost = runningContests.find(c => c.id == req.params.id);
            if (!contestHost) {
                res.sendStatus(400);
                return;
            }
            contestHost.reload();
            res.sendStatus(200);
            this.logger.info(`ContestHost "${req.params.id}" reloaded by ${this.sessionTokens.getTokenData(req.cookies.adminToken)}`);
        });

        contestManager.on('contestStart', (host) => {
            this.longPollingGlobal.emit('contests', contestManager.getRunningContests().map((c) => c.id));
            host.on('data', (data) => this.longPollingContests.emit(host.id, 'contestData', data));
            host.on('scoreboards', (scores, frozen) => this.longPollingContests.emit(host.id, 'contestScoreboards', {
                scores: Array.from(scores, ([team, score]) => ({ team, ...score })),
                frozen: frozen
            }))
        });
        contestManager.on('contestEnd', (host) => {
            this.longPollingGlobal.emit('contests', contestManager.getRunningContests().map((c) => c.id));
        });

        this.app.get('/admin/api/runningContest/:contest/data', this.checkPerms(AdminPerms.CONTROL_CONTESTS, AdminAccessTokenPerms.READ_CONTESTS), (req, res) => {
            if (req.query.init) this.longPollingContests.addImmediate(req.params.contest, 'contestData', res);
            else this.longPollingContests.addWaiter(req.params.contest, 'contestData', res);
        });
        this.app.get('/admin/api/runningContest/:contest/scoreboard', this.checkPerms(AdminPerms.CONTROL_CONTESTS, AdminAccessTokenPerms.READ_CONTESTS), (req, res) => {
            if (req.query.init) this.longPollingContests.addImmediate(req.params.contest, 'contestScoreboards', res);
            else this.longPollingContests.addWaiter(req.params.contest, 'contestScoreboards', res);
        });

        // spaghetti leaderboards

        // reserve /admin path
        this.app.use('/admin/*', (req, res) => res.sendStatus(404));
    }

    /**
     * Middleware to check that the request sender has any of the passed permissions
     * @param perms perms (can be multiple) to check
     * @returns the middleware function
     */
    private checkPerms(...perms: (AdminPerms | AdminAccessTokenPerms)[]): (req: Request, res: Response, next: NextFunction) => Promise<void> {
        return async (req, res, next) => {
            next();
            return;
            // jank as hell lol
            let code = 400;
            let found = false;
            for (const perm of perms) {
                if (is_in_enum(perms, AdminPerms)) {
                    if (this.sessionTokens.tokenExists(req.cookies.adminToken)) {
                        if (await this.db.hasAdminPerms(this.sessionTokens.getTokenData(req.cookies.adminToken)!, perm as AdminPerms)) {
                            next();
                            found = true;
                        } else {
                            code = Math.max(code, 403);
                        }
                    } else {
                        code = Math.max(code, 401);
                    }
                }
                else {
                    if (this.accessTokens.tokenExists(req.cookies.adminAccessToken)) {
                        if (this.accessTokens.getTokenData(req.cookies.adminAccessToken)!.includes(perm as AdminAccessTokenPerms)) {
                            next();
                            found = true;
                        } else {
                            code = Math.max(code, 403);
                        }
                    } else {
                        code = Math.max(code, 401);
                    }
                }
            }
            if (!found) {
                res.sendStatus(code);
            }
        };
    }

    /**
     * Initialize the admin API.
     * @param db Database connection
     * @param app Express app (HTTP server) to attach API to
     */
    static init(db: Database, app: Express): AdminAPI {
        return this.instance = this.instance ?? new AdminAPI(db, app);
    }

    /**
     * Get the admin API instance.
     */
    static use(): AdminAPI {
        if (this.instance === null) throw new TypeError('AdminAPI init() must be called before use()');
        return this.instance;
    }
}
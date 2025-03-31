import bodyParser from 'body-parser';
import { Express, NextFunction, Request, Response } from 'express';

import ClientAPI from './api';
import config from './config';
import ContestManager from './contest';
import { TokenHandler } from './cryptoUtil';
import Database, { AdminPerms, DatabaseOpCode } from './database';
import { defaultLogger, FileLogger, NamedLogger } from './log';
import { isUUID, sendDatabaseResponse, validateRequestBody } from './util';

/**Permissions that can be given to access tokens */
enum AdminAccessTokenPerms {
    /**Read leaderboards of ongoing contests */
    READ_LEADERBOARDS = 'readLeaderboards'
}

/**
 * Bundles administrator API into a single class.
 */
export class AdminAPI {
    private static instance: AdminAPI | null = null;

    readonly db: Database;
    readonly app: Express;
    readonly logger: NamedLogger;
    private readonly sessionTokens: TokenHandler<string> = new TokenHandler<string>();
    private readonly accessTokens: TokenHandler<AdminAccessTokenPerms[]> = new TokenHandler<AdminAccessTokenPerms[]>();

    private constructor(db: Database, app: Express) {
        this.db = db;
        this.app = app;
        this.logger = new NamedLogger(defaultLogger, 'AdminAPI');
        this.createEndpoints();
    }

    private createEndpoints() {
        this.logger.info('Attaching admin portal to /admin/');
        const contestManager = ContestManager.use();
        // require authentication for everything except login
        this.app.use('/admin/*', (req, res, next) => {
            if (req.baseUrl == '/admin/login' || req.baseUrl == '/admin/authLogin') next();
            else if ((typeof req.cookies.token != 'string' || !this.sessionTokens.tokenExists(req.cookies.token)) && (typeof req.cookies.authToken != 'string' || !this.accessTokens.tokenExists(req.cookies.authToken))) res.sendStatus(401);
            else next();
        });

        this.app.post('/admin/login', bodyParser.json(), async (req, res) => {
            if (req.body == undefined || typeof req.body.username != 'string' || typeof req.body.password != 'string') {
                res.sendStatus(400);
                return;
            }
            if ((await this.db.checkAccount(req.body.username, req.body.password)) == DatabaseOpCode.SUCCESS && await this.db.hasAdminPerms(req.body.username, AdminPerms.ADMIN)) {
                const token = this.sessionTokens.createToken(req.body.username, 3600000);
                res.cookie('token', token, {
                    expires: new Date(this.accessTokens.tokenExpiration(req.body) ?? (Date.now() + 3600000)),
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                });
                res.sendStatus(200);
                this.logger.info(`Admin login by ${req.body.username} (${req.headers['x-forwarded-for'] ?? req.ip ?? 'unknown ip address'})`);
            } else {
                res.sendStatus(403);
            }
        });
        this.app.post('/admin/authLogin', bodyParser.text(), async (req, res) => {
            if (typeof req.body != 'string') {
                res.sendStatus(400);
                return;
            }
            if (!this.accessTokens.tokenExists(req.body)) {
                res.sendStatus(401);
                return;
            }
            res.cookie('authToken', req.body, {
                expires: new Date(this.accessTokens.tokenExpiration(req.body) ?? 2147483647000),
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            res.sendStatus(200);
        });
        this.app.get('/admin/loginCheck', (req, res) => {
            // can only reach this by being logged in
            res.sendStatus(200);
        });

        // logs
        this.app.get('/admin/logTail', async (req, res) => {
            if (this.logger.logger instanceof FileLogger)
                res.send(this.logger.logger.tail());
            else res.send('Logs not tracked');
        });
        this.app.get('/admin/logs', async (req, res) => {
            if (this.logger.logger instanceof FileLogger)
                res.sendFile(this.logger.logger.filePath);
            else res.send('Logs not tracked');
        });
        // access tokens
        this.app.get('/admin/accessTokens/ruleset', (req, res) => {
            res.json(Object.values(AdminAccessTokenPerms).filter(k => isNaN(Number(k))));
        });
        this.app.get('/admin/accessTokens/list', this.checkPerms(AdminPerms.MANAGE_ADMINS), async (req, res) => {
            res.json(Object.entries(this.accessTokens.getTokens()).map(([token, perms]) => ({ id: token, perms: perms })));
        });
        this.app.post('/admin/accessTokens/create', bodyParser.json(), this.checkPerms(AdminPerms.MANAGE_ADMINS), validateRequestBody({
            permissions: 'required|array',
            'permissions.*': `required|string|in:${Object.values(AdminAccessTokenPerms).join()}`,
            expiration: 'required|integer|min:0',
        }, this.logger), async (req, res) => {
            const token = this.accessTokens.createToken(req.body.permissions, req.body.expiration);
            res.json(token);
            this.logger.info(`Access token ${token} created by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/accessTokens/delete/:id', this.checkPerms(AdminPerms.MANAGE_ADMINS), async (req, res) => {
            if (!this.accessTokens.tokenExists(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            this.accessTokens.removeToken(req.params.id);
            res.sendStatus(200);
            this.logger.info(`Access token ${req.params.id} deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
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
        this.app.post('/admin/api/account/:username', bodyParser.json(), this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), validateRequestBody({
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
            const check = await this.db.updateAccountData(req.params.username, {
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
            sendDatabaseResponse(req, res, check, {}, this.logger);
            //TODO: make this only log on success
            this.logger.info(`Account "${req.params.username}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/account/:username', bodyParser.json(), this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            password: 'required|encryptedLen:1024,1',
        }, this.logger), async (req, res) => {
            const data = await this.db.deleteAccount(req.params.username, req.body.password, this.sessionTokens.getTokenData(req.cookies.token) ?? 'invalid-username-that-is-not-an-administrator');
            sendDatabaseResponse(req, res, data, {}, this.logger);
            this.logger.info(`Account "${req.params.username}" deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.get('/admin/api/team/:username', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), async (req, res) => {
            const data = await this.db.getTeamData(req.params.username);
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.post('/admin/api/team/:username', this.checkPerms(AdminPerms.MANAGE_ACCOUNTS), validateRequestBody({
            teamName: 'required|string|length:32,1',
            teamBio: 'required|string|length:1024'
        }, this.logger), async (req, res) => {
            const check = await this.db.updateTeamData(req.params.username, {
                name: req.body.teamName,
                bio: req.body.teamBio
            });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Team "${req.params.username}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        // admins (bespoke!!)
        this.app.get('/admin/api/admins', this.checkPerms(AdminPerms.MANAGE_ADMINS), async (req, res) => {
            const data = await this.db.getAdminList();
            if (typeof data == 'object') {
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.post('/admin/api/admin/:username', bodyParser.json(), this.checkPerms(AdminPerms.MANAGE_ADMINS), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
            permissions: 'required|integer|min:1',
        }, this.logger), async (req, res) => {
            const check = await this.db.setAdminPerms(req.params.username, req.body.permissions);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Administrator ${req.params.username} modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/admin/:username', this.checkPerms(AdminPerms.MANAGE_ADMINS), validateRequestBody({
            username: 'required|lowerAlphaNumDash|length:16,1',
        }, this.logger), async (req, res) => {
            const check = await this.db.setAdminPerms(req.params.username, 0);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Administrator ${req.params.username} deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
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
        this.app.post('/admin/api/contest/:id', bodyParser.json(), this.checkPerms(AdminPerms.MANAGE_CONTESTS), validateRequestBody({
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
            this.logger.info(`Contest "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/contest/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            const check = await this.db.deleteContest(req.params.id);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Contest "${req.params.id}" deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
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
        this.app.post('/admin/api/round/:id', bodyParser.json(), this.checkPerms(AdminPerms.MANAGE_CONTESTS), validateRequestBody({
            problems: 'required|array',
            'problems.*': 'required|uuid',
            startTime: 'required|integer|min:0',
            endTime: 'required|integer|gte:startTime',
        }, this.logger), async (req, res) => {
            const check = await this.db.writeRound({ id: req.params.id, ...req.body });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Round "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/round/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const check = await this.db.deleteRound(req.params.id);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Round "${req.params.id}" deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
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
        this.app.post('/admin/api/problem/:id', bodyParser.json(), this.checkPerms(AdminPerms.MANAGE_CONTESTS), validateRequestBody({
            name: 'required|string',
            author: 'required|string',
            content: 'required|string',
            constraints: 'required|object',
            'constraints.time': 'required|integer|min:1',
            'constraints.memory': 'required|integer|min:1'
        }, this.logger), async (req, res) => {
            const check = await this.db.writeProblem({ id: req.params.id, ...req.body });
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Problem "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/problem/:id', this.checkPerms(AdminPerms.MANAGE_CONTESTS), async (req, res) => {
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const check = await this.db.deleteProblem(req.params.id);
            sendDatabaseResponse(req, res, check, {}, this.logger);
            this.logger.info(`Problem "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        // contest control functions
        //fix contest.ts first before finishing this
        // this.app.get('/admin/api/runningContests', async (req, res) => {
        //     if ((req.cookies.authToken == undefined
        //         || (!(this.accessTokens.getTokenData(req.cookies.authToken) ?? []).includes(AdminAccessTokenPerms.READ_LEADERBOARDS)) && !await this.checkPerms(AdminPerms.CONTROL_CONTESTS))) {
        //         // no perms if token doesn't exist
        //         return;
        //     }
        //     res.json(contestManager.getRunningContests().map(host => {
        //         // admin portal should have the frozen scores since it's used for stream
        //         return {
        //             id: host.id,
        //             scores: Array.from(host.clientScoreboards).map(s => ({ username: s[0], score: s[1] })),
        //             actualScores: Array.from(host.scoreboards).map(s => ({ username: s[0], score: s[1] })),
        //             rounds: host.rounds.map(round => ({
        //                 startTime: round.startTime,
        //                 endTime: round.endTime
        //             })),
        //             startTime: data.startTime,
        //             endTime: data.endTime
        //         };
        //     }));
        // });
        this.app.post('/admin/api/reloadContest/:id', this.checkPerms(AdminPerms.CONTROL_CONTESTS), async (req, res) => {
            const runningContests = contestManager.getRunningContests();
            const contestHost = runningContests.find(c => c.id == req.params.id);
            if (!contestHost) {
                res.sendStatus(400);
                return;
            }
            contestHost.reload();
            res.sendStatus(200);
            this.logger.info(`ContestHost "${req.params.id}" reloaded by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });

        // reserve /admin path
        this.app.use('/admin/*', (req, res) => res.sendStatus(404));
    }

    /**
     * Middleware to check that the request sender has the admin permission
     * @param perms perm to check
     * @returns the middleware function
     */
    private checkPerms(perms: AdminPerms): (req: Request, res: Response, next: NextFunction) => Promise<void> {
        return async (req, res, next) => {
            if (!this.sessionTokens.tokenExists(req.cookies.token)) {
                res.sendStatus(401);
            } else if (!(await this.db.hasAdminPerms(this.sessionTokens.getTokenData(req.cookies.token)!, perms))) {
                res.sendStatus(403);
            }
            next();
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
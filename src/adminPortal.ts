import bodyParser from 'body-parser';
import { Express, Request, Response } from 'express';

import ContestManager from './contest';
import { TokenHandler } from './cryptoUtil';
import Database, { AccountData, DatabaseOpCode, AdminPerms, Contest, Problem, Round, TeamData, DatabaseOpCode } from './database';
import { defaultLogger, FileLogger, NamedLogger } from './log';
import { isUUID, reverse_enum } from './util';

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

        const defaultAccountOpMapping = (res: Response, stat: any) => {
            if (stat == DatabaseOpCode.SUCCESS) res.send(200);
            else if (stat == DatabaseOpCode.NOT_EXISTS) res.sendStatus(404);
            else if (stat == DatabaseOpCode.ALREADY_EXISTS) res.sendStatus(409);
            else if (stat == DatabaseOpCode.INCORRECT_CREDENTIALS) res.sendStatus(403);
            else if (stat == DatabaseOpCode.ERROR) res.sendStatus(500);
            else res.json(stat);
        };
        const defaultTeamOpMapping = (res: Response, stat: any) => {
            if (stat == DatabaseOpCode.SUCCESS) res.sendStatus(200);
            else if (stat == DatabaseOpCode.NOT_EXISTS) res.sendStatus(404);
            else if (stat == DatabaseOpCode.CONTEST_CONFLICT || stat == DatabaseOpCode.CONTEST_MEMBER_LIMIT || stat == DatabaseOpCode.CONTEST_ALREADY_EXISTS || stat == DatabaseOpCode.NOT_ALLOWED) res.status(409).json(reverse_enum(DatabaseOpCode, stat));
            else if (stat == DatabaseOpCode.INCORRECT_CREDENTIALS) res.sendStatus(403);
            else if (stat == DatabaseOpCode.ERROR) res.sendStatus(500);
            else res.json(stat);
        };
        const defaultObjectMapping = (res: Response, stat: object | null) => {
            if (stat == null) res.sendStatus(500);
            else res.json(stat);
        };
        const defaultSuccessMapping = (res: Response, stat: boolean) => {
            if (stat) res.json(200);
            else res.sendStatus(500);
        };

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
        this.app.get('/admin/accessTokens/list', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
            res.json(Object.entries(this.accessTokens.getTokens()).map(([token, perms]) => ({ id: token, perms: perms })));
        });
        this.app.post('/admin/accessTokens/create', bodyParser.json(), async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
            if (req.body == undefined || req.body.permissions == undefined || !Array.isArray(req.body.permissions)
                || req.body.permissions.length == 0 || req.body.permissions.some((p: any) => !Object.values(AdminAccessTokenPerms).includes(p)) || typeof req.body.expiration != 'number') {
                res.sendStatus(400);
                return;
            }
            const token = this.accessTokens.createToken(req.body.permissions, req.body.expiration);
            res.json(token);
            this.logger.info(`Access token ${token} created by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/accessTokens/delete/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
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
        this.app.get('/admin/api/accountList', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
            defaultObjectMapping(res, await this.db.getAccountList());
        });
        this.app.get('/admin/api/account/:username', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
            if (!this.db.validate(req.params.username, 'a')) {
                res.sendStatus(400);
                return;
            }
            defaultAccountOpMapping(res, await this.db.getAccountData(req.params.username));
        });
        this.app.post('/admin/api/account/:username', bodyParser.json(), async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
            const body = req.body as AccountData;
            if (body == undefined || body.username !== req.params.username || [body.username, body.email, body.firstName, body.lastName, body.displayName, body.profileImage, body.bio, body.school, body.team].some((v) => typeof v != 'string')
                || [body.grade, body.experience].some((v) => typeof v != 'number') || [body.languages, body.registrations, body.pastRegistrations].some((v) => !Array.isArray(v) || v.some((sv) => typeof sv != 'string'))) {
                res.sendStatus(400);
                return;
            }
            if (!this.db.validate(req.params.username, 'a')) {
                res.sendStatus(400);
                return;
            }
            defaultAccountOpMapping(res, await this.db.updateAccountData(req.params.username, body));
            this.logger.info(`Account "${req.params.username}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/account/:username', bodyParser.json(), async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
            // saving space
            if (typeof req.body.password != 'string' || !this.db.validate(req.params.username, req.body.password)) {
                res.sendStatus(400);
                return;
            }
            defaultAccountOpMapping(res, await this.db.deleteAccount(req.params.username, req.body.password, this.sessionTokens.getTokenData(req.cookies.token) ?? 'invalid-username-that-is-not-an-administrator'));
            this.logger.info(`Account "${req.params.username}" deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.get('/admin/api/team/:username', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
            defaultTeamOpMapping(res, await this.db.getTeamData(req.params.username));
        });
        this.app.post('/admin/api/team/:username', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
            const body = req.body as TeamData;
            if (body == undefined || body.id !== req.params.username || [body.id, body.name, body.bio, body.joinCode].some((v) => typeof v != 'string')
                || !Array.isArray(body.members) || body.members.some((v) => typeof v != 'string')) {
                res.sendStatus(400);
                return;
            }
            if (!this.db.validate(req.params.username, '')) {
                res.sendStatus(400);
                return;
            }
            defaultTeamOpMapping(res, await this.db.updateTeamData(req.params.username, body));
            this.logger.info(`Team "${req.params.username}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        // admins (bespoke!!)
        this.app.get('/admin/api/admins', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
            defaultObjectMapping(res, await this.db.getAdminList());
        });
        this.app.post('/admin/api/admin/:username', bodyParser.json(), async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
            if (req.body == undefined || req.body.permissions == undefined || !this.db.validate(req.params.username, 'a')) {
                res.sendStatus(400);
                return;
            }
            defaultSuccessMapping(res, await this.db.setAdminPerms(req.params.username, req.body.permissions));
            this.logger.info(`Administrator list modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/admin/:username', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
            if (!this.db.validate(req.params.username, 'a')) {
                res.sendStatus(400);
                return;
            }
            defaultSuccessMapping(res, await this.db.setAdminPerms(req.params.username, 0));
            this.logger.info(`Administrator list modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        // contests
        this.app.get('/admin/api/contestList', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            defaultObjectMapping(res, await this.db.getContestList());
        });
        this.app.get('/admin/api/contest/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            const stat = await this.db.readContests({ id: req.params.id });
            if (stat == null) res.sendStatus(500);
            else if (stat.length == 0) res.sendStatus(404);
            else res.json(stat[0]);
        });
        this.app.post('/admin/api/contest/:id', bodyParser.json(), async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            const body = req.body as Contest;
            if (body == undefined || typeof body.id != 'string' || req.params.id !== body.id || !Array.isArray(body.rounds)
                || body.rounds.some((id) => !isUUID(id)) || !Array.isArray(body.exclusions) || body.exclusions.some((e) => typeof e != 'string')
                || [body.id, body.type].some((v) => typeof v != 'string') || [body.maxTeamSize, body.startTime, body.endTime].some((v) => typeof v != 'number')
                || typeof body.public != 'boolean') {
                res.sendStatus(400);
                return;
            }
            defaultSuccessMapping(res, await this.db.writeContest(body));
            this.logger.info(`Contest "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/contest/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            defaultSuccessMapping(res, await this.db.deleteContest(req.params.id));
            this.logger.info(`Contest "${req.params.id}" deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        // rounds
        this.app.get('/admin/api/roundList', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            defaultObjectMapping(res, await this.db.getRoundList());
        });
        this.app.get('/admin/api/round/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const stat = await this.db.readRounds({ id: req.params.id });
            if (stat == null) res.sendStatus(500);
            else if (stat.length == 0) res.sendStatus(404);
            else res.json(stat[0]);
        });
        this.app.post('/admin/api/round/:id', bodyParser.json(), async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            const body = req.body as Round;
            if (body == undefined || typeof body.id != 'string' || req.params.id !== body.id || [body.startTime, body.endTime].some((v) => typeof v != 'number')
                || !Array.isArray(body.problems) || body.problems.some((v) => !isUUID(v))) {
                res.sendStatus(400);
                return;
            }
            defaultSuccessMapping(res, await this.db.writeRound(body));
            this.logger.info(`Round "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/round/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            defaultSuccessMapping(res, await this.db.deleteRound(req.params.id));
            this.logger.info(`Round "${req.params.id}" deleted by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        // problems
        this.app.get('/admin/api/problemList', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            defaultObjectMapping(res, await this.db.getProblemList());
        });
        this.app.get('/admin/api/problem/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            const stat = await this.db.readProblems({ id: req.params.id });
            if (stat == null) res.sendStatus(500);
            else if (stat.length == 0) res.sendStatus(404);
            else res.json(stat[0]);
        });
        this.app.post('/admin/api/problem/:id', bodyParser.json(), async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            const body = req.body as Problem;
            if (body == undefined || typeof body.id != 'string' || req.params.id !== body.id || [body.name, body.author, body.content].some((v) => typeof v != 'string')
                || typeof body.constraints != 'object' || body.constraints == null || [body.constraints.time, body.constraints.memory].some((v) => typeof v != 'number')) {
                res.sendStatus(400);
                return;
            }
            defaultSuccessMapping(res, await this.db.writeProblem(body));
            this.logger.info(`Problem "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        this.app.delete('/admin/api/problem/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
            if (!isUUID(req.params.id)) {
                res.sendStatus(400);
                return;
            }
            defaultSuccessMapping(res, await this.db.deleteProblem(req.params.id));
            this.logger.info(`Problem "${req.params.id}" modified by ${this.sessionTokens.getTokenData(req.cookies.token)}`);
        });
        // contest control functions
        this.app.get('/admin/api/runningContests', async (req, res) => {
            if ((req.cookies.authToken == undefined
                || (!(this.accessTokens.getTokenData(req.cookies.authToken) ?? []).includes(AdminAccessTokenPerms.READ_LEADERBOARDS)) && !await this.checkPerms(req, res, AdminPerms.CONTROL_CONTESTS))) {
                // no perms if token doesn't exist
                return;
            }
            res.json(contestManager.getRunningContests().map(contest => {
                const data = contest.data;
                // admin portal should have the frozen scores since it's used for stream
                return {
                    id: contest.id,
                    scores: Array.from(contest.scoreboards).map(s => ({ username: s[0], score: s[1] })),
                    actualScores: Array.from(contest.actualScoreboards).map(s => ({ username: s[0], score: s[1] })),
                    rounds: data.rounds.map(round => ({
                        startTime: round.startTime,
                        endTime: round.endTime
                    })),
                    startTime: data.startTime,
                    endTime: data.endTime
                };
            }));
        });
        this.app.post('/admin/api/reloadContest/:id', async (req, res) => {
            if (!await this.checkPerms(req, res, AdminPerms.CONTROL_CONTESTS)) return;
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

    private async checkPerms(req: any, res: any, perms: AdminPerms): Promise<boolean> {
        if (!this.sessionTokens.tokenExists(req.cookies.token)) {
            res.sendStatus(401);
            return false;
        } else if (!(await this.db.hasAdminPerms(this.sessionTokens.getTokenData(req.cookies.token)!, perms))) {
            res.sendStatus(403);
            return false;
        }
        return true;
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
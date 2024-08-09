import bodyParser from 'body-parser';
import { Express } from 'express';
import { resolve as pathResolve } from 'path';

import config from './config';
import ContestManager from './contest';
import { SessionTokenHandler } from './cryptoUtil';
import Database, { AccountData, AccountOpResult, AdminPerms, Contest, Problem, Round, TeamData, TeamOpResult } from './database';
import Logger, { NamedLogger } from './log';
import { isUUID, reverse_enum } from './util';

/**Permissions that can be given to access tokens */
enum AdminAccessTokenPerms {
    /**Read leaderboards of ongoing contests */
    READ_LEADERBOARDS = 'readLeaderboards'
}

export function attachAdminPortal(db: Database, expressApp: Express, contest: ContestManager, log: Logger) {
    const database = db;
    const app = expressApp;
    const contestManager = contest;
    const logger = new NamedLogger(log, 'AdminPortal');
    const sessionTokens = new SessionTokenHandler<never, string>();
    const accessTokens = new SessionTokenHandler<AdminAccessTokenPerms, undefined>();
    logger.info('Attaching admin portal to /admin/');

    // require authentication for everything except login
    app.use('/admin/*', (req, res, next) => {
        if (req.baseUrl == '/admin/login') next();
        else if (typeof req.cookies.token != 'string') res.sendStatus(401);
        else if (!sessionTokens.tokenExists(req.cookies.token) && !accessTokens.tokenExists(req.cookies.token)) res.sendStatus(403);
        else next();
    });

    app.post('/admin/login', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || typeof req.body.username != 'string' || typeof req.body.password != 'string') {
            res.sendStatus(400);
            return;
        }
        if ((await database.checkAccount(req.body.username, req.body.password)) == AccountOpResult.SUCCESS && await database.hasAdminPerms(req.body.username, AdminPerms.ADMIN)) {
            const token = sessionTokens.createToken([], req.body.username, 3600000);
            res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000),
                path: '/',
                httpOnly: true,
                sameSite: "none",
                secure: true
            });
            res.sendStatus(200);
            log.info(`[Admin] Admin login by ${req.body.username} (${req.headers['x-forwarded-for'] ?? req.ip ?? 'unknown ip address'})`);
        } else {
            res.sendStatus(403);
        }
    });
    app.get('/admin/login', (req, res) => {
        // only way to get here is to be logged in
        res.sendStatus(200);
    });

    const checkPerms = async (req, res, perms: AdminPerms): Promise<boolean> => {
        if (!sessionTokens.tokenExists(req.cookies.token) || !(await db.hasAdminPerms(sessionTokens.tokenData(req.cookies.token)!, perms))) {
            res.sendStatus(403);
            return false;
        }
        return true;
    };
    const defaultAccountOpMapping = (res, stat) => {
        if (stat == AccountOpResult.SUCCESS) res.sendStatus(200);
        else if (stat == AccountOpResult.NOT_EXISTS) res.sendStatus(404);
        else if (stat == AccountOpResult.ALREADY_EXISTS) res.sendStatus(409);
        else if (stat == AccountOpResult.INCORRECT_CREDENTIALS) res.sendStatus(403);
        else if (stat == AccountOpResult.ERROR) res.sendStatus(500);
        else res.json(stat);
    };
    const defaultTeamOpMapping = (res, stat) => {
        if (stat == TeamOpResult.SUCCESS) res.sendStatus(200);
        else if (stat == TeamOpResult.NOT_EXISTS) res.sendStatus(404);
        else if (stat == TeamOpResult.CONTEST_CONFLICT || stat == TeamOpResult.CONTEST_MEMBER_LIMIT || stat == TeamOpResult.CONTEST_ALREADY_EXISTS || stat == TeamOpResult.NOT_ALLOWED) res.status(409).json(reverse_enum(TeamOpResult, stat));
        else if (stat == TeamOpResult.INCORRECT_CREDENTIALS) res.sendStatus(403);
        else if (stat == TeamOpResult.ERROR) res.sendStatus(500);
        else res.json(stat);
    };
    const defaultObjectMapping = (res, stat) => {
        if (stat == null) res.sendStatus(500);
        else res.json(stat);
    };
    const defaultSuccessMapping = (res, stat: boolean) => {
        if (stat) res.json(200);
        else res.sendStatus(500);
    };

    // logs
    app.get('/admin/logs', async (req, res) => {
        res.sendFile(pathResolve(config.logPath, 'log.log'));
    });
    // access tokens
    app.get('/admin/accessTokens/ruleset', (req, res) => {
        res.json(Object.values(AdminAccessTokenPerms).filter(k => isNaN(Number(k))));
    });
    app.post('/admin/accessTokens/list', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
        res.json(Object.fromEntries(accessTokens.getTokens())); // should this be an array instead of an object?
    });
    app.post('/admin/accessTokens/create', bodyParser.json(), async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
        if (req.body == undefined || req.body.permissions == undefined || !Array.isArray(req.body.permissions) || req.body.permissions.length == 0 || req.body.permissions.some(p => !Object.values(AdminAccessTokenPerms).includes(p)) || typeof req.body.expiration != 'number') {
            res.sendStatus(400);
            return;
        }
        res.json(accessTokens.createToken(req.body.permissions, undefined, req.body.expiration));
    });
    app.delete('/admin/accessTokens/delete/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
        if (!accessTokens.tokenExists(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        accessTokens.removeToken(req.params.id);
        res.sendStatus(200);
    });
    // general functions
    app.post('/admin/api/clearCache', async (req, res) => {
        database.clearCache();
        res.sendStatus(200);
    });
    // accounts (ADMINS CAN BYPASS RESTRICTIONS LIKE MAXIMUM LENGTHS)
    app.get('/admin/api/accountList', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
        defaultObjectMapping(res, await database.getAccountList());
    });
    app.get('/admin/api/account/:username', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
        if (!database.validate(req.params.username, '')) {
            res.sendStatus(400);
            return;
        }
        defaultAccountOpMapping(res, await database.getAccountData(req.params.username));
    });
    app.post('/admin/api/account/:username', bodyParser.json(), async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
        const body = req.body as AccountData;
        if (body == undefined || body.username !== req.params.username || [body.username, body.email, body.firstName, body.lastName, body.displayName, body.profileImage, body.bio, body.school, body.team].some((v) => typeof v != 'string')
            || [body.grade, body.experience].some((v) => typeof v != 'number') || [body.languages, body.registrations, body.pastRegistrations].some((v) => !Array.isArray(v) || v.some((sv) => typeof sv != 'string'))) {
            res.sendStatus(400);
            return;
        }
        if (!database.validate(req.params.username, '')) {
            res.sendStatus(400);
            return;
        }
        defaultAccountOpMapping(res, await database.updateAccountData(req.params.username, body));
        logger.info(`Account "${req.params.username}" modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    app.delete('/admin/api/account/:username', bodyParser.json(), async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
        // saving space
        if (typeof req.body.password != 'string' || !database.validate(req.params.username, req.body.password)) {
            res.sendStatus(400);
            return;
        }
        defaultAccountOpMapping(res, await database.deleteAccount(req.params.username, req.body.password, sessionTokens.tokenData(req.cookies.token) ?? 'invalid-username-that-is-not-an-administrator'));
        logger.info(`Account "${req.params.username}" deleted by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    app.get('/admin/api/team/:username', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
        defaultTeamOpMapping(res, await database.getTeamData(req.params.username));
    });
    app.post('/admin/api/team/:username', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ACCOUNTS)) return;
        const body = req.body as TeamData;
        if (body == undefined || body.id !== req.params.username || [body.id, body.name, body.bio, body.joinCode].some((v) => typeof v != 'string')
            || !Array.isArray(body.members) || body.members.some((v) => typeof v != 'string')) {
            res.sendStatus(400);
            return;
        }
        if (!database.validate(req.params.username, '')) {
            res.sendStatus(400);
            return;
        }
        defaultTeamOpMapping(res, await database.updateTeamData(req.params.username, body));
        logger.info(`Team "${req.params.username}" modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    // admins (bespoke!!)
    app.get('/admin/api/admins', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
        defaultObjectMapping(res, await database.getAdminList());
    });
    app.post('/admin/api/admin/:username', bodyParser.json(), async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
        if (req.body == undefined || req.body.permissions == undefined || !database.validate(req.params.username, 'a')) {
            res.sendStatus(400);
            return;
        }
        defaultSuccessMapping(res, await database.setAdminPerms(req.params.username, req.body.permissions));
        logger.info(`Administrator list modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    app.delete('/admin/api/admin/:username', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_ADMINS)) return;
        if (req.body == undefined || !database.validate(req.params.username, 'a')) {
            res.sendStatus(400);
            return;
        }
        defaultSuccessMapping(res, await database.setAdminPerms(req.params.username, 0));
        logger.info(`Administrator list modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    // contests
    app.get('/admin/api/contestList', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        defaultObjectMapping(res, await database.getContestList());
    });
    app.get('/admin/api/contest/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        const stat = await database.readContests({ id: req.params.id });
        if (stat == null) res.sendStatus(500);
        else if (stat.length == 0) res.sendStatus(404);
        else res.json(stat[0]);
    });
    app.post('/admin/api/contest/:id', bodyParser.json(), async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        const body = req.body as Contest;
        if (body == undefined || typeof body.id != 'string' || req.params.id !== body.id || !Array.isArray(body.rounds)
            || body.rounds.some((id) => !isUUID(id)) || !Array.isArray(body.exclusions) || body.exclusions.some((e) => typeof e != 'string')
            || [body.id, body.type].some((v) => typeof v != 'string') || [body.maxTeamSize, body.startTime, body.endTime].some((v) => typeof v != 'number')
            || typeof body.public != 'boolean') {
            res.sendStatus(400);
            return;
        }
        defaultSuccessMapping(res, await database.writeContest(body));
        logger.info(`Contest "${req.params.id}" modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    app.delete('/admin/api/contest/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        defaultSuccessMapping(res, await database.deleteContest(req.params.id));
        logger.info(`Contest "${req.params.id}" deleted by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    // rounds
    app.get('/admin/api/roundList', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        defaultObjectMapping(res, await database.getRoundList());
    });
    app.get('/admin/api/round/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        if (!isUUID(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        const stat = await database.readRounds({ id: req.params.id });
        if (stat == null) res.sendStatus(500);
        else if (stat.length == 0) res.sendStatus(404);
        else res.json(stat[0]);
    });
    app.post('/admin/api/round/:id', bodyParser.json(), async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        const body = req.body as Round;
        if (body == undefined || typeof body.id != 'string' || req.params.id !== body.id || [body.startTime, body.endTime].some((v) => typeof v != 'number')
            || !Array.isArray(body.problems) || body.problems.some((v) => !isUUID(v))) {
            res.sendStatus(400);
            return;
        }
        defaultSuccessMapping(res, await database.writeRound(body));
        logger.info(`Round "${req.params.id}" modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    app.delete('/admin/api/round/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        if (!isUUID(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        defaultSuccessMapping(res, await database.deleteRound(req.params.id));
        logger.info(`Round "${req.params.id}" deleted by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    // problems
    app.get('/admin/api/problemList', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        defaultObjectMapping(res, await database.getProblemList());
    });
    app.get('/admin/api/problem/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        if (!isUUID(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        const stat = await database.readProblems({ id: req.params.id });
        if (stat == null) res.sendStatus(500);
        else if (stat.length == 0) res.sendStatus(404);
        else res.json(stat[0]);
    });
    app.post('/admin/api/problem/:id', bodyParser.json(), async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        const body = req.body as Problem;
        if (body == undefined || typeof body.id != 'string' || req.params.id !== body.id || [body.name, body.author, body.content].some((v) => typeof v != 'string')
            || typeof body.constraints != 'object' || body.constraints == null || [body.constraints.time, body.constraints.memory].some((v) => typeof v != 'number')) {
            res.sendStatus(400);
            return;
        }
        defaultSuccessMapping(res, await database.writeProblem(body));
        logger.info(`Problem "${req.params.id}" modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    app.delete('/admin/api/problem/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.MANAGE_CONTESTS)) return;
        if (!isUUID(req.params.id)) {
            res.sendStatus(400);
            return;
        }
        defaultSuccessMapping(res, await database.deleteProblem(req.params.id));
        logger.info(`Problem "${req.params.id}" modified by ${sessionTokens.tokenData(req.cookies.token)}`);
    });
    // contest control functions
    app.get('/admin/api/runningContests', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.CONTROL_CONTESTS)) return;
        const TESTING_CONTESTS = [
            {
                "id": "WWPIT Spring 2024 Advanced",
                "scores": {
                    "sp": 10120392103092093000,
                    "the-real-tianmu": 10
                },
                "rounds": [
                    {
                        "startTime": 1717340400000,
                        "endTime": 1717344000000
                    },
                    {
                        "startTime": 1717347600000,
                        "endTime": 1717351200000
                    },
                    {
                        "startTime": 1717351800000,
                        "endTime": 1717356600000
                    },
                ]
            },
            {
                "id": "WWPIT Spring 2024 Novice",
                "scores": {
                    "passwordisa": -1,
                    "susvant": 2147483647
                },
                "rounds": [
                    {
                        "startTime": 1717340400000,
                        "endTime": 1717344000000
                    },
                    {
                        "startTime": 1717347600000,
                        "endTime": 1717351200000
                    },
                    {
                        "startTime": 1717351800000,
                        "endTime": 1717356600000
                    },
                ]
            }
        ]
        res.json(TESTING_CONTESTS);
        // res.json(contestManager.getRunningContests().map(contest => {return {
        //     id: contest.id,
        //     scores: Object.fromEntries(contest.scorer.getScores()),
        //     rounds: contest.data.rounds.map(round => {return {
        //         startTime: round.startTime,
        //         endTime: round.endTime
        //     }})
        // }}));
    });
    app.post('/admin/api/reloadContest/:id', async (req, res) => {
        if (!await checkPerms(req, res, AdminPerms.CONTROL_CONTESTS)) return;
        const runningContests = contestManager.getRunningContests();
        const contestHost = runningContests.find(c => c.id == req.params.id);
        if (!contestHost) {
            res.sendStatus(400);
            return;
        }
        contestHost.reload();
        res.sendStatus(200);
        logger.info(`ContestHost "${req.params.id}" reloaded by ${sessionTokens.tokenData(req.cookies.token)}`);
    });

    // reserve /admin path
    app.use('/admin/*', (req, res) => res.sendStatus(404));
}

export default attachAdminPortal;
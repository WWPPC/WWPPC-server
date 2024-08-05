import bodyParser from 'body-parser';
import { Express } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import ContestManager from './contest';
import Database, { AccountOpResult, AdminPerms, TeamOpResult } from './database';
import Logger, { NamedLogger } from './log';
import { isUUID, reverse_enum } from './util';

export function attachAdminPortal(db: Database, expressApp: Express, contestManager: ContestManager, log: Logger) {
    const database = db;
    const app = expressApp;
    const contest = contestManager;
    const logger = new NamedLogger(log, 'AdminPortal');
    const sessionTokens = new Map<string, string>();
    logger.info('Attaching admin portal to /admin/');

    // require authentication for everything except login
    app.use('/admin/*', (req, res, next) => {
        if (req.baseUrl == '/admin/login') next();
        else if (typeof req.cookies.token != 'string') res.sendStatus(401);
        else if (!sessionTokens.has(req.cookies.token)) res.sendStatus(403);
        else next();
    });

    app.post('/admin/login', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || typeof req.body.username != 'string' || typeof req.body.password != 'string') {
            res.sendStatus(400);
            return;
        }
        if ((await database.checkAccount(req.body.username, req.body.password)) == AccountOpResult.SUCCESS && await database.hasAdminPerms(req.body.username, AdminPerms.ADMIN)) {
            const token = uuidv4();
            res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000),
                path: '/',
                httpOnly: true,
                sameSite: "none", 
                secure: true
            });
            sessionTokens.set(token, req.body.username);
            setTimeout(() => sessionTokens.delete(token), 3600000);
            res.sendStatus(200);
            log.info(`[Admin] Admin login by ${req.body.username} (${req.ip ?? req.headers['x-forwarded-for'] ?? 'unknown ip address'})`);
        } else {
            res.sendStatus(403);
        }
    });

    const defaultResponseMapping = (res, stat: AccountOpResult) => {
        if (stat == AccountOpResult.SUCCESS) res.sendStatus(200);
        else if (stat == AccountOpResult.NOT_EXISTS) res.sendStatus(404);
        else if (stat == AccountOpResult.ALREADY_EXISTS) res.sendStatus(409);
        else if (stat == AccountOpResult.INCORRECT_CREDENTIALS) res.sendStatus(403);
        else res.sendStatus(500);
    };
    const defaultResponseMapping2 = (res, stat: TeamOpResult) => {
        if (stat == TeamOpResult.SUCCESS) res.sendStatus(200);
        else if (stat == TeamOpResult.NOT_EXISTS) res.sendStatus(404);
        else if (stat == TeamOpResult.CONTEST_CONFLICT || stat == TeamOpResult.CONTEST_MEMBER_LIMIT || stat == TeamOpResult.CONTEST_ALREADY_EXISTS || stat == TeamOpResult.NOT_ALLOWED) res.status(409).json(reverse_enum(TeamOpResult, stat));
        else if (stat == TeamOpResult.INCORRECT_CREDENTIALS) res.sendStatus(403);
        else res.sendStatus(500);
    };

    // functions
    app.get('/admin/api/logs', async (req, res) => {
        res.sendFile(path.resolve('./log.log'));
    });
    app.get('/admin/api/readAccounts', async (req, res) => {
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_ACCOUNTS))) {
            res.sendStatus(403);
            return;
        }
        const data = await database.getAccountList();
        if (data == null) res.sendStatus(500);
        else res.json(data);
    });
    app.get('/admin/api/readAccount', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.username == undefined) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_ACCOUNTS))) {
            res.sendStatus(403);
            return;
        }
        const data = await database.getAccountData(req.body.username);
        if (data == AccountOpResult.NOT_EXISTS) res.sendStatus(404);
        else if (data == AccountOpResult.ERROR) res.sendStatus(500);
        else res.json(data);
    });
    app.get('/admin/api/readTeam', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.username == undefined) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_ACCOUNTS))) {
            res.sendStatus(403);
            return;
        }
        const data = await database.getTeamData(req.body.username);
        if (data == TeamOpResult.NOT_EXISTS) res.sendStatus(404);
        else if (data == TeamOpResult.ERROR) res.sendStatus(500);
        else res.json(data);
    });
    app.post('/admin/api/writeAccount', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || [req.body.username, req.body.firstName, req.body.lastName, req.body.displayName, req.body.profileImage, req.body.school, req.body.grade, req.body.experience, req.body.languages, req.body.bio, req.body.registrations, req.body.team].some((v) => v == undefined)) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_ACCOUNTS))) {
            res.sendStatus(403);
            return;
        }
        const stat = await database.updateAccountData(req.body.username, req.body);
        defaultResponseMapping(res, stat);
    });
    app.post('/admin/api/writeAccountTeam', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.team == undefined) {
            res.sendStatus(400);
            return;
        }
        const stat = await database.setAccountTeam(req.body.username, req.body.team);
        defaultResponseMapping2(res, stat);
    });
    app.get('/admin/api/readAdmins', async (req, res) => {
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_ADMINS))) {
            res.sendStatus(403);
            return;
        }
        const data = await database.getAdminList();
        if (data == null) res.sendStatus(500);
        else res.json(data);
    });
    app.post('/admin/api/writeAdmin', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.username == undefined || req.body.permissions == undefined) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_ADMINS))) {
            res.sendStatus(403);
            return;
        }
        const stat = await database.setAdminPerms(req.body.username, req.body.permissions);
        if (!stat) res.sendStatus(500);
        else res.sendStatus(200);
        logger.info(`Administrator list modified by ${sessionTokens.get(req.cookies.token)!}`);
    });
    app.post('/admin/api/deleteAdmin', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.username == undefined) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_ADMINS))) {
            res.sendStatus(403);
            return;
        }
        const stat = await database.setAdminPerms(req.body.username, 0);
        if (!stat) res.sendStatus(500);
        else res.sendStatus(200);
        logger.info(`Administrator list modified by ${sessionTokens.get(req.cookies.token)!}`);
    });
    app.get('/admin/api/readRounds', async (req, res) => {
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_PROBLEMS))) {
            res.sendStatus(403);
            return;
        }
        const data = await database.readRounds();
        if (data == null) res.sendStatus(500);
        else res.json(data);
    });
    app.post('/admin/api/writeRound', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || [req.body.id, req.body.problems, req.body.startTime, req.body.endTime].some(v => v == undefined) || !isUUID(req.body.id) || !Array.isArray(req.body.problems) || req.body.problems.some(v => !isUUID(v))) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_PROBLEMS))) {
            res.sendStatus(403);
            return;
        }
        const stat = await database.writeRound(req.body);
        if (!stat) res.sendStatus(500);
        else res.sendStatus(200);
    });
    app.post('/admin/api/deleteRound', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.id == undefined) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_PROBLEMS))) {
            res.sendStatus(403);
            return;
        }
        const stat = await database.deleteRound(req.body.id);
        if (!stat) res.sendStatus(500);
        else res.sendStatus(200);
    });
    app.get('/admin/api/readProblems', async (req, res) => {
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_PROBLEMS))) {
            res.sendStatus(403);
            return;
        }
        const data = await database.readProblems();
        if (data == null) res.sendStatus(500);
        else res.json(data);
    });
    app.post('/admin/api/writeProblem', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || [req.body.id, req.body.name, req.body.author, req.body.content, req.body.constraints].some(v => v == undefined) || !isUUID(req.body.id)) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_PROBLEMS))) {
            res.sendStatus(403);
            return;
        }
        const stat = await database.writeProblem(req.body);
        if (!stat) res.sendStatus(500);
        else res.sendStatus(200);
    });
    app.post('/admin/api/deleteProblem', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.id == undefined) {
            res.sendStatus(400);
            return;
        }
        if (!(await db.hasAdminPerms(sessionTokens.get(req.cookies.token)!, AdminPerms.MANAGE_PROBLEMS))) {
            res.sendStatus(403);
            return;
        }
        const stat = await database.deleteProblem(req.body.id);
        if (!stat) res.sendStatus(500);
        else res.sendStatus(200);
    });

    // reserve /admin path
    app.use('/admin/*', (req, res) => res.sendStatus(404));
}

export default attachAdminPortal;
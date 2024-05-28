import bodyParser from 'body-parser';
import express, { Express, IRouterMatcher } from 'express';
import path from 'path';
import { v4 as uuidV4 } from 'uuid';

import config from './config';
import ContestManager from './contest';
import Database, { AccountOpResult, AdminPerms, reverse_enum, TeamOpResult } from './database';
import Logger from './log';

process.env.ADMIN_PANEL_PATH ??= path.resolve(__dirname, '../admin-portal');
export function attachAdminPortal(db: Database, expressApp: Express, contestManager: ContestManager, log: Logger) {
    const database = db;
    const app = expressApp;
    const contest = contestManager;
    const logger = log;
    const sessionTokens = new Map<string, string>();

    app.use('/admin/*', (req, res, next) => {
        // require authentication for everything except the login screen
        if (req.baseUrl == '/admin/login') next();
        else if (typeof req.cookies.token != 'string' || !sessionTokens.has(req.cookies.token)) res.redirect('/admin/login');
        else next();
    });
    app.use('/admin/', express.static(process.env.ADMIN_PANEL_PATH!));
    const adminPanelIndex = path.resolve(process.env.ADMIN_PANEL_PATH!, 'index.html');
    const adminPanelAccountManager = path.resolve(process.env.ADMIN_PANEL_PATH!, 'accountManager/accountManager.html');
    const adminPanelProblemManager = path.resolve(process.env.ADMIN_PANEL_PATH!, 'problemManager/problemManager.html');
    const adminPanelContestManager = path.resolve(process.env.ADMIN_PANEL_PATH!, 'contestManager/contestManager.html');
    const adminPanelContestRunner = path.resolve(process.env.ADMIN_PANEL_PATH!, 'contestRunner/contestRunner.html');
    app.get('/admin', (req, res) => res.sendFile(adminPanelIndex));
    app.get('/admin/accountManager', (req, res) => res.sendFile(adminPanelAccountManager));
    app.get('/admin/problemManager', (req, res) => res.sendFile(adminPanelProblemManager));
    app.get('/admin/contestManager', (req, res) => res.sendFile(adminPanelContestManager));
    app.get('/admin/contestRunner', (req, res) => res.sendFile(adminPanelContestRunner));
    app.get('/admin/login', (req, res) => res.sendFile(path.resolve(process.env.ADMIN_PANEL_PATH!, 'login.html')));
    app.post('/admin/login', bodyParser.urlencoded({ extended: false }), async (req, res) => {
        if (req.body == undefined || typeof req.body.username != 'string' || typeof req.body.password != 'string') {
            res.sendStatus(400);
            return;
        }
        if ((await database.checkAccount(req.body.username, req.body.password)) == AccountOpResult.SUCCESS && await database.hasPerms(req.body.username, AdminPerms.ADMIN)) {
            const token = uuidV4();
            // session cookie expires when tab/browser is closed
            res.cookie('token', token, { expires: new Date(Date.now() + 3600000) });
            sessionTokens.set(token, req.body.username);
            setTimeout(() => sessionTokens.delete(token), 3600000);
            res.redirect('/admin');
            log.info('[ADMIN] Admin login by ' + req.body.username);
        } else {
            res.redirect(403, '/admin/login');
        }
    });
    if (!config.serveStatic) {
        // make sure fonts and borrowed assets load
        app.use('/assets/*', express.static(path.resolve(process.env.CLIENT_PATH!, 'assets/')));
        const favicon = path.resolve(process.env.CLIENT_PATH!, 'favicon.png');
        const logo = path.resolve(process.env.CLIENT_PATH!, 'logo.svg');
        const icon = path.resolve(process.env.CLIENT_PATH!, 'icon.svg');
        const icon2 = path.resolve(process.env.CLIENT_PATH!, 'icon2.png');
        const icon2Small = path.resolve(process.env.CLIENT_PATH!, 'icon2-small.png');
        app.get('/favicon.png', (req, res) => res.sendFile(favicon));
        app.get('/logo.svg', (req, res) => res.sendFile(logo));
        app.get('/icon.svg', (req, res) => res.sendFile(icon));
        app.get('/icon2.png', (req, res) => res.sendFile(icon2));
        app.get('/icon2-small.png', (req, res) => res.sendFile(icon2Small));
    }

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
    }
    // functions
    app.get('/admin/api/accountList', async (req, res) => {
        const data = await database.getAccountList();
        if (data == null) res.sendStatus(500);
        else res.json(data);
    });
    app.get('/admin/api/accountData/', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.username == undefined) {
            res.sendStatus(400);
            return;
        }
        const data = await database.getAccountData(req.body.username);
        if (data == AccountOpResult.NOT_EXISTS) res.sendStatus(404);
        else if (data == AccountOpResult.ERROR) res.sendStatus(500);
        else res.json(data);
    });
    app.post('/admin/api/accountData/', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || [req.body.username, req.body.firstName, req.body.lastName, req.body.displayName, req.body.profileImage, req.body.school, req.body.grade, req.body.experience, req.body.languages, req.body.bio, req.body.registrations, req.body.team].some((v) => v == undefined)) {
            res.sendStatus(400);
            return;
        }
        const stat = await database.updateAccountData(req.body.username, req.body);
        defaultResponseMapping(res, stat);
    });
    app.post('/admin/api/accountTeam/', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.team == undefined) {
            res.sendStatus(400);
            return;
        }
        const stat = await database.setAccountTeam(req.body.username, req.body.team);
        defaultResponseMapping2(res, stat);
    });
    app.get('/admin/api/problemList', async (req, res) => {
        const data = await database.readProblems();
        if (data == null) res.sendStatus(500);
        else res.json(data);
    });

    app.post('/admin/api/problemData/', bodyParser.json(), async (req, res) => {
        if (req.body == undefined || req.body.id == undefined) {
            res.sendStatus(400);
            return;
        }
        const stat = await database.writeProblem(req.body);
    });

    // reserve /admin path
    app.use('/admin/*', (req, res) => res.sendStatus(404));
}

export default attachAdminPortal;
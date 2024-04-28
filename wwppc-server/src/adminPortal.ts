import express, { Express } from 'express';
import path from 'path';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';
import bodyParser from 'body-parser';

import Database, { AccountOpResult, AdminPerms } from './database';
import Logger from './log';
import ContestManager from './contest';

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
    const adminPanelProblemManager = path.resolve(process.env.ADMIN_PANEL_PATH!, 'problemManager/problemManager.html');
    const adminPanelContestManager = path.resolve(process.env.ADMIN_PANEL_PATH!, 'contestManager/contestManager.html');
    const adminPanelAccountManager = path.resolve(process.env.ADMIN_PANEL_PATH!, 'accountManager/accountManager.html');
    app.get('/admin', (req, res) => res.sendFile(adminPanelIndex));
    app.get('/admin/problemManager', (req, res) => res.sendFile(adminPanelProblemManager));
    app.get('/admin/contestManager', (req, res) => res.sendFile(adminPanelContestManager));
    app.get('/admin/accountManager', (req, res) => res.sendFile(adminPanelAccountManager));
    app.get('/admin/login', (req, res) => res.sendFile(path.resolve(process.env.ADMIN_PANEL_PATH!, 'login.html')));
    app.post('/admin/login', bodyParser.urlencoded({ extended: false }), async (req, res) => {
        if (req.body == undefined || typeof req.body.username != 'string' || typeof req.body.password != 'string') {
            res.sendStatus(400);
            return;
        }
        if ((await database.checkAccount(req.body.username, req.body.password)) == AccountOpResult.SUCCESS && await database.hasPerms(req.body.username, AdminPerms.ADMIN)) {
            const token = uuidV4();
            // session cookie expires when tab/browser is closed
            res.cookie('token', token);
            sessionTokens.set(token, req.body.username);
            res.redirect('/admin');
            log.info('[ADMIN] Admin login by ' + req.body.username);
        } else {
            res.sendStatus(403);
        }
    });


    // prevent single-page stuff from resolving this
    app.use('/admin/*', (req, res) => res.sendStatus(404));
}

export default attachAdminPortal;
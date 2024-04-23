import express, { Express } from 'express';
import path from 'path';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';
import bodyParser from 'body-parser';

import Database, { AdminPerms } from './database';
import Logger from './log';

process.env.ADMIN_PANEL_PATH ??= path.resolve(__dirname, '../admin-portal');
export function attachAdminPortal(db: Database, app: Express, logger: Logger) {
    const sessionTokens = new Set<string>();

    app.use('/admin/*', (req, res, next) => {
        // require authentication for everything except the login screen
        if (req.baseUrl == '/admin/login') next();
        else if (typeof req.cookies.token != 'string') res.sendStatus(401);
        else if (!uuidValidate(req.cookies.token)) res.sendStatus(400);
        else if (!sessionTokens.has(req.cookies.token)) res.sendStatus(403);
        else next();
    });
    app.use('/admin/', express.static(process.env.ADMIN_PANEL_PATH!));
    app.get('/admin', (req, res) => res.sendFile(path.resolve(process.env.ADMIN_PANEL_PATH!, 'index.html')));
    app.get('/admin/login', (req, res) => res.sendFile(path.resolve(process.env.ADMIN_PANEL_PATH!, 'login.html')));
    app.post('/admin/login', bodyParser.urlencoded({ extended: false }), async (req, res) => {
        if (req.body == undefined || typeof req.body.username != 'string' || typeof req.body.password != 'string') {
            res.sendStatus(400);
            return;
        }
        if (await db.hasPerms(req.body.username, AdminPerms.ADMIN)) {
            const token = uuidV4();
            res.cookie('token', token);
            sessionTokens.add(token);
            res.redirect('/admin');
        } else {
            res.sendStatus(403);
        }
    });
    // prevent single-page stuff from resolving this
    app.use('/admin/*', (req, res) => res.sendStatus(404));
    // just http, no socket.io
}

export default attachAdminPortal;
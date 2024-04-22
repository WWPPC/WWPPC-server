import { Express } from 'express';
import path from 'path';

import Database from './database';
import Logger from './log';

process.env.ADMIN_PATH ??= path.resolve(__dirname, '../admin-portal');
export function attachAdminPortal(db: Database, app: Express, logger: Logger) {
    app.use('/admin/', (req, res, next) => {

    });
    app.get('/admin', (req, res) => res.sendFile(path.resolve(process.env.ADMIN_PATH!, 'index.html')));
    // just http, no socket.io
}

export default attachAdminPortal;
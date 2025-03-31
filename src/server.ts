import fs from 'fs';
import path from 'path';

const start = performance.now();

import { configDotenv } from 'dotenv';
configDotenv({ path: path.resolve(__dirname, '../config/.env') });
import config from './config';

// verify environment variables exist
if (['CONFIG_PATH', 'DATABASE_URL', 'DATABASE_CERT', 'DATABASE_KEY', 'GRADER_PASS', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].some((v) => process.env[v] == undefined)) {
    throw new Error('Missing environment variables. Make sure your environment is set up correctly!');
}

const configLoadTime = performance.now() - start;

// start server
import { defaultLogger as logger } from './log';
logger.info('Starting server...');
logger.debug('CONFIG_PATH: ' + config.path);
logger.debug('EMAIL_TEMPLATE_PATH: ' + config.emailTemplatePath);
logger.debug('Current config:\n' + JSON.stringify(config, null, 4), true);
if (global.gc) logger.info('Manual garbage collector cleanup is enabled');
if (config.debugMode) logger.info('Extra debug logging is enabled (disable this if this is not a development environment!)');

// set up networking
import express from 'express';
import http from 'http';
import https from 'https';
import { rateLimitWithTrigger } from './util';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
const server = fs.existsSync(path.resolve(config.path, 'cert.pem')) ? https.createServer({
    key: fs.readFileSync(path.resolve(config.path, 'cert-key.pem')),
    cert: fs.readFileSync(path.resolve(config.path, 'cert.pem'))
}, app) : http.createServer(app);
app.use(rateLimitWithTrigger({
    windowMs: 100,
    max: 100,
    message: 'Too many requests'
}, (req, res) => logger.warn(`Rate limiting triggered by ${req.ip}`)));
app.use(cors({
    origin: [/https:\/\/(?:.+\.)*wwppc\.tech/, /https?:\/\/localhost:[0-9]{1,5}/],
    credentials: true,
    allowedHeaders: 'Content-Type,Cookie'
}));
app.use(cookieParser());

// init modules
import Mailer from './email';
import Database from './database';
import ClientAuth from './auth';
import ClientAPI from './api';
import Grader from './grader';
import ContestManager from './contest';
import UpsolveManager from './upsolve';
import { AdminAPI } from './adminPortal';

const mailer = new Mailer({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587), // another default
    username: process.env.SMTP_USER!,
    password: process.env.SMTP_PASS!,
    templatePath: config.emailTemplatePath,
    logger: logger
});
const database = new Database({
    uri: process.env.DATABASE_URL!,
    key: process.env.DATABASE_KEY!,
    sslCert: process.env.DATABASE_CERT,
    logger: logger
});
ClientAuth.init(database, app, mailer);
ClientAPI.init(database, app, mailer);
const mainGrader = new Grader(database, app, '/judge', process.env.GRADER_PASS!, logger);
ContestManager.init(database, app, mainGrader);
UpsolveManager.init(database, app, mainGrader);

// admin portal
AdminAPI.init(database, app);

// reserve /api path
app.use('/api/*', (req, res) => res.sendStatus(404));

const instantiationTime = performance.now() - start;

Promise.all([
    ClientAuth.use().ready,
    database.connect(),
    mailer.ready
]).then(() => {
    const startTime = performance.now() - start;
    server.listen(config.port);
    if (config.debugMode) logger.debug(`Config load: ${configLoadTime}ms; Module instantiation: ${instantiationTime}ms`);
    logger.info(`Server started in ${startTime}ms, listening to port ${config.port}`);
});

const stopServer = async (code: number) => {
    logger.info('Stopping server...');
    const start = performance.now();
    let actuallyStop = () => {
        logger.warn('[!] Forced server close! Skipped waiting for shutdown! [!]');
        process.exit(code);
    };
    process.on('SIGTERM', actuallyStop);
    process.on('SIGQUIT', actuallyStop);
    process.on('SIGINT', actuallyStop);
    server.close();
    ContestManager.use().close();
    UpsolveManager.use().close();
    await Promise.all([mailer.disconnect(), database.disconnect()]);
    logger.info(`Server stopped, took ${performance.now() - start}ms`);
    await logger.destroy();
    process.exit(code);
};
process.on('SIGTERM', () => stopServer(0));
process.on('SIGQUIT', () => stopServer(0));
process.on('SIGINT', () => stopServer(0));

const handleUncaughtError = async (err: any, origin: string | Promise<unknown>) => {
    if (err instanceof Error) {
        logger.fatal(err.message);
        if (err.stack) logger.fatal(err.stack);
    } else if (err != undefined) logger.fatal(err);
    if (typeof origin == 'string') logger.fatal(origin);
    const handleUncaughtError2 = (err: any, origin: string | Promise<unknown>) => {
        console.error('An exception occured while handling another exception:');
        console.error(err);
        if (typeof origin == 'string') console.error(origin);
    };
    process.off('uncaughtException', handleUncaughtError);
    process.off('unhandledRejection', handleUncaughtError);
    process.on('uncaughtException', handleUncaughtError2);
    process.on('unhandledRejection', handleUncaughtError2);
    stopServer(1);
};
process.on('uncaughtException', handleUncaughtError);
process.on('unhandledRejection', handleUncaughtError);

// memory logger
if (process.argv.includes('mem_logger')) {
    setInterval(() => {
        const mem = process.memoryUsage();
        logger.debug(`Memory: ${Math.round(mem.heapUsed / 1048576 * 100) / 100}MB / ${Math.round(mem.heapTotal / 1048576 * 100) / 100}MB`);
    }, 5000);
}
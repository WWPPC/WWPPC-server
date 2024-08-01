import fs from 'fs';
import path from 'path';

import { configDotenv } from 'dotenv';
configDotenv({ path: path.resolve(__dirname, '../config/.env') });
import config from './config';

// verify environment variables exist
if (['CONFIG_PATH', 'DATABASE_URL', 'DATABASE_CERT', 'DATABASE_KEY', 'GRADER_PASS', 'RECAPTCHA_SECRET', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].some((v) => process.env[v] == undefined)) {
    throw new Error('Missing environment variables. Make sure your environment is set up correctly!');
}

// start server
import { FileLogger } from './log';
const logger = new FileLogger(config.logPath);
logger.info('Starting server...');
logger.debug('CONFIG_PATH: ' + config.path);
logger.debug('EMAIL_TEMPLATE_PATH: ' + config.emailTemplatePath);
logger.debug('CLIENT_PATH: ' + config.clientPath);
logger.debug('Current config:\n' + JSON.stringify(config, null, 4), true);
if (global.gc) logger.info('Manual garbage collector cleanup is enabled');

// set up networking
import express from 'express';
import http from 'http';
import https from 'https';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
const server = fs.existsSync(path.resolve(config.path, 'cert.pem')) ? https.createServer({
    key: fs.readFileSync(path.resolve(config.path, 'cert-key.pem')),
    cert: fs.readFileSync(path.resolve(config.path, 'cert.pem'))
}, app) : http.createServer(app);
const limiter = rateLimit({
    windowMs: 100,
    max: 100,
    handler: (req, res, next) => {
        logger.warn('Rate limiting triggered by ' + (req.ip ?? req.socket.remoteAddress));
    }
});
app.use(limiter);
app.use(cors({ origin: '*' }));
app.use(cookieParser());
// in case server is not running
app.get('/wakeup', (req, res) => res.json('ok'));

// init modules
import { Server as SocketIOServer } from 'socket.io';
import Mailer from './email';
import Database from './database';
import Grader from './grader';
import ContestManager from './contest';
import UpsolveManager from './upsolve';

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
const io = new SocketIOServer(server, {
    path: '/web-socketio',
    cors: { origin: '*', methods: ['GET', 'POST'] }
});
const grader = new Grader(database, app, '/judge', process.env.GRADER_PASS!, logger);
const contestManager = new ContestManager(database, app, io, grader, logger);
const upsolveManager = new UpsolveManager(database, app, grader, logger);

// init client handlers and API endpoints
import ClientHost from './clients';
const clientHost = new ClientHost(database, app, contestManager, upsolveManager, mailer, logger);

// admin portal
import attachAdminPortal from './adminPortal';
attachAdminPortal(database, app, contestManager, logger);

// static hosting optional
logger.info('SERVE_STATIC is ' + config.serveStatic.toString().toUpperCase());
if (config.serveStatic) {
    if (config.clientPath == undefined) {
        logger.error('SERVE_STATIC is TRUE but CLIENT_PATH not given!\nDisabling static hosting');
    } else {
        const indexDir = path.resolve(config.clientPath, 'index.html');
        app.use('/', express.static(config.clientPath));
        app.get(/^(^[^.\n]+\.?)+(.*(html){1})?$/, (req, res) => {
            if (!req.accepts('html')) res.sendStatus(406);
            else res.sendFile(indexDir);
        });
        app.get('*', (req, res) => {
            // last handler - if nothing else finds the page, just send 404
            res.status(404);
            if (req.accepts('html')) res.sendFile(indexDir);
            else res.sendStatus(404);
        });
    }
}

// complete networking
if (config.debugMode) logger.info('Creating Socket.IO server');
import { createServerSocket } from './clients';
const recentConnections = new Map<string, number>();
const recentConnectionKicks = new Set<string>();
io.on('connection', async (s) => {
    console.log('oof')
    s.handshake.headers['x-forwarded-for'] ??= '127.0.0.1';
    const ip = typeof s.handshake.headers['x-forwarded-for'] == 'string' ? s.handshake.headers['x-forwarded-for'].split(',')[0].trim() : s.handshake.headers['x-forwarded-for'][0].trim();
    const socket = createServerSocket(s, ip, logger);
    // some spam protection stuff
    socket.on('error', (e) => socket.kick(e?.toString()));
    // connection DOS detection
    recentConnections.set(socket.ip, (recentConnections.get(socket.ip) ?? 0) + 1);
    if ((recentConnections.get(socket.ip) ?? 0) > config.maxConnectPerSecond) {
        if (!recentConnectionKicks.has(socket.ip)) socket.kick('too many connections');
        else {
            socket.removeAllListeners();
            socket.disconnect();
        }
        recentConnectionKicks.add(socket.ip);
        return;
    }
    // spam DOS protection
    let packetCount = 0;
    socket.onAny((event, ...args) => {
        packetCount++;
    });
    const packetcheck = setInterval(async function () {
        if (!socket.connected) clearInterval(packetcheck);
        packetCount = Math.max(packetCount - 250, 0);
        if (packetCount > 0) socket.kick('too many packets');
    }, 1000);
    if (config.superSecretSecret) socket.emit('superSecretMessage');

    // hand off to host
    clientHost.handleSocketConnection(socket);
});
setInterval(() => {
    recentConnections.forEach((val, key) => {
        recentConnections.set(key, Math.max(val - 1, 0));
    });
    recentConnectionKicks.clear();
}, 1000);

Promise.all([
    clientHost.ready,
    database.connectPromise,
    mailer.ready
]).then(() => {
    server.listen(config.port);
    logger.info(`Listening to port ${config.port}`);
});

const stopServer = async (code: number) => {
    logger.info('Stopping server...');
    let actuallyStop = () => {
        logger.info('[!] Forced server close! Skipped waiting for shutdown! [!]');
        process.exit(code);
    };
    process.on('SIGTERM', actuallyStop);
    process.on('SIGQUIT', actuallyStop);
    process.on('SIGINT', actuallyStop);
    io.close();
    contestManager.close();
    upsolveManager.close();
    await Promise.all([mailer.disconnect(), database.disconnect()]);
    logger.destroy();
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
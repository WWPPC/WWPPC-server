// Copyright (C) 2024 Sampleprovider(sp)

import fs from 'fs';
import path from 'path';
import { configDotenv } from 'dotenv';
if (fs.existsSync(path.resolve(__dirname, '../.env'))) configDotenv();

import Logger from './log';
const logger = new Logger();
logger.info('Starting WWPPC server...');

const config = require('../config/config.json');
import express from 'express';
import http from 'http';
import https from 'https';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
const app = express();
const server = fs.existsSync(path.resolve(__dirname, '../config/.local')) ? https.createServer({
    key: fs.readFileSync(path.resolve(__dirname, '../config/localhost-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../config/localhost.pem'))
}, app) : http.createServer(app);
const limiter = rateLimit({
    windowMs: 100,
    max: 30,
    handler: function (req, res, options) {
        logger.warn('Rate limiting triggered by ' + req.ip ?? req.socket.remoteAddress);
    }
});
app.use(limiter);
app.use(cors({ origin: '*' }));
if (process.argv.includes('serve_static') ?? process.env.SERVE_STATIC ?? config.serveStatic) {
    const clientDir = path.resolve(__dirname, './../../wwppc-client/dist');
    const indexDir = path.resolve(clientDir, 'index.html');
    app.use('/', express.static(clientDir));
    app.get(/^(^[^.\n]+\.?)+(.*(html){1})?$/, (req, res) => res.sendFile(indexDir));
    app.get('*', (req, res) => {
        // last handler - if nothing else finds the page, just send 404
        res.status(404);
        if (req.accepts('html')) res.render('404', { filename: indexDir });
        else if (req.accepts('json')) res.json({ error: 'Not found' });
        else res.send('Not found');
    });
}
app.get('/wakeup', (req, res) => res.json('ok'));

// verify environment variables exist
if (process.env.DATABASE_URL == undefined || process.env.DATABASE_KEY == undefined || process.env.RECAPTCHA_SECRET == undefined) {
    throw new Error('Missing environment variables. Make sure your .env is set up correctly!');
}

import Database, { AccountOpResult } from './database';
const database = new Database(process.env.DATABASE_URL, process.env.DATABASE_KEY, logger);
config.port = process.env.PORT ?? config.port;

import ContestManager from './contest';
const contestManager = new ContestManager();

const sessionId = Math.random();
const recentConnections = new Map<string, number>();
const recentConnectionKicks = new Set<string>();
const io = new (require('socket.io')).Server(server, {
    path: '/socket.io',
    cors: { origin: '*', methods: ['GET', 'POST'] }
});
io.on('connection', async (s) => {
    const socket = s;
    const ip = socket.handshake.headers['x-forwarded-for'] ?? '127.0.0.1';
    // some spam protection stuff
    let kick = (reason = 'unspecified reason') => {
        logger.warn(`${ip} was kicked for violating restrictions; ${reason}`);
        socket.removeAllListeners();
        socket.onevent = function (packet) { };
        socket.disconnect();
    };
    socket.on('error', kick);
    // connection DOS detection
    recentConnections.set(ip, (recentConnections.get(ip) ?? 0) + 1);
    if ((recentConnections.get(ip) ?? 0) > config.maxConnectPerSecond) {
        if (!recentConnectionKicks.has(ip)) kick('too many connections');
        else {
            socket.removeAllListeners();
            socket.onevent = function (packet) { };
            socket.disconnect();
        }
        recentConnectionKicks.add(ip);
        return;
    }
    // spam DOS protection
    let packetCount = 0;
    const onevent = socket.onevent;
    socket.onevent = function (packet) {
        if (packet.data[0] == null) {
            kick('invalid packet');
            return;
        }
        onevent.call(this, packet);
        packetCount++;
    };
    const packetcheck = setInterval(async function () {
        if (!socket.connected) clearInterval(packetcheck);
        packetCount = Math.max(packetCount - 250, 0);
        if (packetCount > 0) kick('too many packets');
    }, 1000);
    // await credentials before allowing anything (in a weird way)
    socket.emit('getCredentials', { key: database.publicKey, session: sessionId });
    if (await new Promise((resolve, reject) => {
        socket.on('credentials', async (creds) => {
            if (creds == null || (creds.action != 0 && creds.action != 1)) {
                kick('null credentials');
                resolve(true);
                return;
            }
            const u = await database.RSAdecode(creds.username);
            const p = await database.RSAdecode(creds.password);
            const e = await database.RSAdecode(creds.email);
            if (u instanceof Buffer || p instanceof Buffer) {
                // for some reason decoding failed, redirect to login
                socket.emit('credentialRes', AccountOpResult.INCORRECT_CREDENTIALS);
            }
            if (typeof u != 'string' || typeof p != 'string' || (creds.action == 1 && (typeof e != 'string' || typeof creds.token != 'string')) || !database.validate(u, p)) {
                kick('invalid credentials');
                resolve(true);
                return;
            }
            if (creds.action == 1) {
                // verify recaptcha with an unnecessarily long bit of HTTP request code
                const recaptchaResponse: any = await new Promise((resolve, reject) => {
                    const req = http.request('https://www.google.com/recaptcha/api/siteverify', {
                        method: 'POST'
                    }, (res) => {
                        if (res.statusCode == 200) {
                            res.on('error', (err) => reject('HTTPS POST response decode error: ' + err.message));
                            let chunks: Buffer[] = [];
                            res.on('data', (chunk) => chunks.push(chunk));
                            res.on('end', () => {
                                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
                            });
                        } else {
                            reject('HTTPS POST returned status ' + res.statusCode);
                        }
                    });
                    req.on('error', (err) => {
                        reject('HTTPS POST request error: ' + err);
                    });
                    req.write(JSON.stringify({secret: process.env.RECAPTCHA_SECRET, response: creds.token}))
                }).catch((err) => {
                    logger.error('ReCaptcha verification failed:');
                    logger.error(err);
                    return; // make sure recaptchaResponse is undefined
                });
                if (recaptchaResponse == undefined || recaptchaResponse.success !== true) {
                    socket.emit('credentialRes', AccountOpResult.INCORRECT_CREDENTIALS);
                    resolve(true);
                    return;
                }
            }
            const res = await (creds.action ? database.createAccount(u, p, typeof e == 'string' ? e : '') : database.checkAccount(u, p));
            socket.emit('credentialRes', res);
            if (res == 0) {
                socket.removeAllListeners('credentials');
                resolve(false);
            }
        });
    })) return;
    if (config.superSecretSecret) socket.emit('superSecretMessage');
    // TODO: add rest of stuff, add to contest manager instance
});
let connectionKickDecrementer = setInterval(function () {
    recentConnections.forEach((val, key) => {
        recentConnections.set(key, Math.max(val - 1, 0));
    });
    recentConnectionKicks.clear();
}, 1000);

database.connectPromise.then(() => {
    server.listen(config.port);
    logger.info(`Server listening to port ${config.port}`);
});

let stopServer = async () => {
    logger.info(`Stopping server...`);
    let actuallyStop = () => {
        logger.info('[!] Forced stopServer! Skipped waiting for shutdown! [!]');
        process.exit();
    };
    process.on('SIGTERM', actuallyStop);
    process.on('SIGQUIT', actuallyStop);
    process.on('SIGINT', actuallyStop);
    process.on('SIGILL', actuallyStop);
    io.close();
    clearInterval(connectionKickDecrementer);
    await database.disconnect();
    process.exit();
};
process.on('SIGTERM', stopServer);
process.on('SIGQUIT', stopServer);
process.on('SIGINT', stopServer);
process.on('SIGILL', stopServer);
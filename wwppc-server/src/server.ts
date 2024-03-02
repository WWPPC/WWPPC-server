// Copyright (C) 2024 Sampleprovider(sp)

import Logger from './log';
const logger = new Logger();
logger.info('Starting WWPPC server...');

const config = require('../config/config.json');
import fs from 'fs';
import path from 'path';
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
const clientDir = path.resolve(__dirname, './../wwppc-client/dist');
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

import Database from './database';
const database = new Database(process.env.DATABASE_URL ?? require('../config/local-database.json'), logger);
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
            let u = await database.RSAdecode(creds.username);
            let p = await database.RSAdecode(creds.password);
            if (u instanceof Buffer || p instanceof Buffer) {
                // for some reason decoding failed, redirect to login
                socket.emit('credentialRes', 3);
            }
            if (typeof u != 'string' || typeof p != 'string' || !database.validate(u, p)) {
                kick('invalid credentials');
                resolve(true);
                return;
            }
            const res = await (creds.action ? database.createAccount.call(database, u, p) : database.checkAccount.call(database, u, p)); // why? idk
            socket.emit('credentialRes', res);
            if (res == 0) {
                socket.removeAllListeners('credentials');
                resolve(false);
            }
        });
    })) return;
    if (config.superSecretSecret) socket.emit('superSecretMessage');
    // add rest of stuff here
    // including submissions oof
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
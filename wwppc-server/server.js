// Copyright (C) 2024 Sampleprovider(sp)

const LOGGER = new (require('./log.js'))();
LOGGER.info('Starting WWPC server...');

const config = require('./config.json');
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const server = fs.existsSync(path.resolve(__dirname, '.local')) ? require('https').createServer({
    key: fs.readFileSync(path.resolve(__dirname, './localhost-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, './localhost.pem'))
}, app) : require('http').createServer(app);
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 100,
    max: 30,
    handler: function (req, res, options) {
        LOGGER.warn('Rate limiting triggered by ' + req.ip ?? req.socket.remoteAddress);
    }
});
app.use(limiter);
app.use('/', express.static(path.resolve(__dirname, './../wwppc-client/dist')));

const database = new (require('./database.js'))(process.env.DATABASE_URL ?? require('./local-database.json'));
config.port = process.env.PORT ?? config.port;

const contestManager = new (require('./contest.js'))();

const sessionId = Math.random();
const recentConnections = [];
const recentConnectionKicks = [];
const io = new (require('socket.io')).Server(server);
io.on('connection', async (s) => {
    const socket = s;
    const ip = socket.handshake.headers['x-forwarded-for'] ?? '127.0.0.1';
    // some spam protection stuff
    let kick = (reason = 'unspecified') => {
        LOGGER.warn(`${ip} was kicked for violating restrictions; ${reason}`);
        socket.removeAllListeners();
        socket.onevent = function (packet) { };
        socket.disconnect();
    };
    socket.on('error', kick);
    // connection DOS detection
    recentConnections[ip] = (recentConnections[ip] ?? 0) + 1;
    if (recentConnections[ip] > 3) {
        recentConnectionKicks[ip] = true;
        kick('too many connections');
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
    socket.emit('getCredentials', {key: database.publicKey, session: sessionId});
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
                socket.emit('credentialFail', 3);
            }
            if (!database.validate(u, p)) {
                kick('invalid credentials');
                resolve(true);
                return;
            }
            const res = await (creds.action ? database.createAccount : database.checkAccount).call(database, u, p); // why? idk
            if (res == 0) {
                socket.removeAllListeners('credentials');
                resolve(false);
            } else {
                socket.emit('credentialFail', res);
            }
        });
    })) return;
    socket.emit('credentialPass');
    if (config.superSecretSecret) socket.emit('superSecretMessage');
    // add rest of stuff here
    // including submissions oof
});
let connectionKickDecrementer = setInterval(function() {
    for (let i in recentConnections) {
        recentConnections[i] = Math.max(recentConnections[i]-1, 0);
    }
    for (let i in recentConnectionKicks) {
        delete recentConnectionKicks[i];
    }
}, 1000);

database.connectPromise.then(() => {
    LOGGER.info('Connected to database');
    server.listen(config.port);
    LOGGER.info(`Server listening to port ${config.port}`);
});

let stop = async () => {
    LOGGER.info(`Stopping server...`);
    let actuallyStop = () => {
        LOGGER.info('[!] Forced stop! Skipped waiting for shutdown! [!]');
        process.exit();
    };
    process.on('SIGTERM', actuallyStop);
    process.on('SIGQUIT', actuallyStop);
    process.on('SIGINT', actuallyStop);
    process.on('SIGILL', actuallyStop);
    io.close();
    clearInterval(connectionKickDecrementer);
    await database.disconnect();
    LOGGER.info(`Database disconnected`);
    process.exit();
};
process.on('SIGTERM', stop);
process.on('SIGQUIT', stop);
process.on('SIGINT', stop);
process.on('SIGILL', stop);
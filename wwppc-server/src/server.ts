import fs from 'fs';
import path from 'path';
import { configDotenv } from 'dotenv';
configDotenv();

import config from './config';
import Logger from './log';
const logger = new Logger();
logger.info('Starting WWPPC server...');

process.env.CLIENT_PATH ??= path.resolve(__dirname, '../../wwppc-client/dist');
import express from 'express';
import http from 'http';
import https from 'https';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
const app = express();
const server = fs.existsSync(path.resolve(config.path, 'cert.pem')) ? https.createServer({
    key: fs.readFileSync(path.resolve(config.path, 'cert-key.pem')),
    cert: fs.readFileSync(path.resolve(config.path, 'cert.pem'))
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
    const indexDir = path.resolve(process.env.CLIENT_PATH, 'index.html');
    app.use('/', express.static(process.env.CLIENT_PATH));
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
if (process.env.DATABASE_URL == undefined || process.env.RECAPTCHA_SECRET == undefined) {
    throw new Error('Missing environment variables. Make sure your environment is set up correctly!');
}

// actually start server here
import Database, { AccountOpResult } from './database';
import { Server as SocketIOServer } from 'socket.io';
import ContestManager from './contest';

const database = new Database(process.env.DATABASE_URL, logger);
const contestManager = new ContestManager();

const sessionId = Math.random();
const recentConnections = new Map<string, number>();
const recentConnectionKicks = new Set<string>();
const io = new SocketIOServer(server, {
    path: '/socket.io',
    cors: { origin: '*', methods: ['GET', 'POST'] }
});
io.on('connection', async (s) => {
    const socket = s;
    socket.handshake.headers['x-forwarded-for'] ??= '127.0.0.1';
    const ip = typeof socket.handshake.headers['x-forwarded-for'] == 'string' ? socket.handshake.headers['x-forwarded-for'].split(',')[0].trim() : socket.handshake.headers['x-forwarded-for'][0].trim();
    // some spam protection stuff
    let kick = (reason: string | Error = 'unspecified reason') => {
        logger.warn(`${ip} was kicked for violating restrictions; ${reason}`);
        socket.removeAllListeners();
        socket.disconnect();
    };
    socket.on('error', kick);
    // connection DOS detection
    recentConnections.set(ip, (recentConnections.get(ip) ?? 0) + 1);
    if ((recentConnections.get(ip) ?? 0) > config.maxConnectPerSecond) {
        if (!recentConnectionKicks.has(ip)) kick('too many connections');
        else {
            socket.removeAllListeners();
            socket.disconnect();
        }
        recentConnectionKicks.add(ip);
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
        if (packetCount > 0) kick('too many packets');
    }, 1000);
    // await credentials before allowing anything (in a weird way)
    socket.emit('getCredentials', { key: database.publicKey, session: sessionId });
    if (await new Promise((resolve, reject) => {
        socket.on('credentials', async (creds: { username: Buffer | string, password: Buffer | string, token?: string, signupData?: { firstName: Buffer | string, lastName: Buffer | string, email: Buffer | string, school: Buffer | string, grade: number, experience: number, languages: string[] } }) => {
            if (creds == null) {
                kick('null credentials');
                resolve(true);
                return;
            }
            // some validation
            const username = await database.RSAdecode(creds.username);
            const password = await database.RSAdecode(creds.password);
            if (username instanceof Buffer || password instanceof Buffer) {
                // for some reason decoding failed, redirect to login
                socket.emit('credentialRes', AccountOpResult.INCORRECT_CREDENTIALS);
            }
            if (typeof username != 'string' || typeof password != 'string' || !database.validate(username, password)) {
                kick('invalid credentials');
                resolve(true);
                return;
            }
            // actually create/check account
            if (creds.signupData) {
                // more validation
                const firstName = await database.RSAdecode(creds.signupData.firstName);
                const lastName = await database.RSAdecode(creds.signupData.lastName);
                const email = await database.RSAdecode(creds.signupData.email);
                const school = await database.RSAdecode(creds.signupData.school);
                if (typeof firstName != 'string' || typeof lastName != 'string' || typeof email != 'string' || typeof school != 'string'
                    || !Array.isArray(creds.signupData.languages) || creds.signupData.languages.find((v) => typeof v != 'string') !== undefined
                    || typeof creds.signupData.experience != 'number' || typeof creds.signupData.grade != 'number' || creds.token == undefined || typeof creds.token != 'string') {
                    kick('invalid sign up data');
                    resolve(true);
                    return;
                }
                // verify recaptcha with an unnecessarily long bit of HTTP request code
                const recaptchaResponse: any = await new Promise((resolve, reject) => {
                    if (creds.token === undefined) {
                        reject('what');
                        return;
                    }
                    const req = https.request({
                        hostname: 'www.google.com',
                        path: `/recaptcha/api/siteverify`,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }, (res) => {
                        if (res.statusCode == 200) {
                            res.on('error', (err) => reject(`HTTPS ${req.method} response error: ${err.message}`));
                            let chunks: Buffer[] = [];
                            res.on('data', (chunk) => chunks.push(chunk));
                            res.on('end', () => {
                                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
                            });
                        } else {
                            reject(`HTTPS ${req.method} response returned status ${res.statusCode}`);
                        }
                    });
                    req.on('error', (err) => {
                        reject(`HTTPS ${req.method} request error: ${err.message}`);
                    });
                    req.write(`secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET ?? '')}&response=${encodeURIComponent(creds.token)}&remoteip=${encodeURIComponent(ip)}`);
                    req.end();
                }).catch((err) => {
                    logger.error('ReCaptcha verification failed:');
                    logger.error(err);
                    return err;
                });
                if (recaptchaResponse instanceof Error) {
                    socket.emit('credentialRes', AccountOpResult.ERROR);
                    resolve(true);
                    return;
                } else if (recaptchaResponse == undefined || recaptchaResponse.success !== true || recaptchaResponse.score < 0.7) {
                    socket.emit('credentialRes', AccountOpResult.INCORRECT_CREDENTIALS);
                    resolve(true);
                    return;
                }
                const res = await database.createAccount(username, password, {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    school: school,
                    languages: creds.signupData.languages,
                    grade: creds.signupData.grade,
                    experience: creds.signupData.experience,
                });
                socket.emit('credentialRes', res);
                if (res == 0) {
                    socket.removeAllListeners('credentials');
                    resolve(false);
                }
            } else {
                const res = await database.checkAccount(username, password);
                socket.emit('credentialRes', res);
                if (res == 0) {
                    socket.removeAllListeners('credentials');
                    resolve(false);
                }
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
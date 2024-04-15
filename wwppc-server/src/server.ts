import config from './config';

import fs from 'fs';
import path from 'path';
import { configDotenv } from 'dotenv';
configDotenv({ path: path.resolve(config.path, '.env') });

// verify environment variables exist
if (['DATABASE_URL', 'DATABASE_CERT', 'DATABASE_KEY', 'RECAPTCHA_SECRET', 'CLIENT_PATH'].some((v) => process.env[v] == undefined)) {
    throw new Error('Missing environment variables. Make sure your environment is set up correctly!');
}

// start server
import Logger from './log';
const logger = new Logger();
logger.info('Starting WWPPC server...');

// set up networking
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
logger.info('SERVE_STATIC is ' + config.serveStatic.toString().toUpperCase());
if (config.serveStatic) {
    const indexDir = path.resolve(process.env.CLIENT_PATH!, 'index.html');
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

// init modules
import { Server as SocketIOServer } from 'socket.io';
import Database, { AccountOpResult, reverse_enum } from './database';
import ContestManager from './contest';
import Mailer from './email';
import { validateRecaptcha } from './recaptcha';
import attachAdminPortal from './adminPortal';

const mailer = new Mailer({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587), // another default
    username: process.env.SMTP_USER!,
    password: process.env.SMTP_PASS!,
    logger: logger
});
const database = new Database({
    uri: process.env.DATABASE_URL!,
    key: process.env.DATABASE_KEY!,
    sslCert: process.env.DATABASE_CERT,
    logger: logger,
    mailer: mailer
});
const contestManager = new ContestManager(database, app, logger);
attachAdminPortal(database, app, logger);

// complete networking
const sessionId = Math.random();
const recentConnections = new Map<string, number>();
const recentConnectionKicks = new Set<string>();
const recentSignups = new Map<string, number>();
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
    if (config.superSecretSecret) socket.emit('superSecretMessage');
    // await credentials before allowing anything (in a weird way)
    const self = {
        username: '[not signed in]'
    };
    const logWithId = (logMethod: (s: string, logOnly?: boolean) => void, message: string, logOnly?: boolean) => {
        logMethod.call(logger, (`${self.username} @ ${ip} | ${message}`), logOnly);
    };
    if (config.debugMode) logWithId(logger.debug, 'Connection established, sending public key and requesting credentials');
    socket.emit('getCredentials', { key: database.publicKey, session: sessionId });
    const checkRecaptcha = async (token: string): Promise<boolean> => {
        const recaptchaResponse = await validateRecaptcha(token, ip);
        if (recaptchaResponse instanceof Error) {
            logger.error('reCAPTCHA verification failed:');
            logger.error(recaptchaResponse.message);
            if (recaptchaResponse.stack) logger.error(recaptchaResponse.stack);
            socket.emit('credentialRes', AccountOpResult.ERROR);
            return false;
        } else if (recaptchaResponse == undefined || recaptchaResponse.success !== true || recaptchaResponse.score < 0.8) {
            if (config.debugMode) logWithId(logger.debug, `reCAPTCHA verification failed:\n${JSON.stringify(recaptchaResponse)}`);
            socket.emit('credentialRes', AccountOpResult.INCORRECT_CREDENTIALS);
            return false;
        } else if (config.debugMode) logWithId(logger.debug, `reCAPTCHA verification successful:\n${JSON.stringify(recaptchaResponse)}`);
        return true;
    };
    if (await new Promise((resolve, reject) => {
        socket.on('credentials', async (creds: { username: Buffer | string, password: Buffer | string, token?: string, signupData?: { firstName: Buffer | string, lastName: Buffer | string, email: Buffer | string, school: Buffer | string, grade: number, experience: number, languages: string[] } }) => {
            if (creds == undefined) {
                kick('null credentials');
                resolve(true);
                return;
            }
            // some validation
            const username = await database.RSAdecrypt(creds.username);
            const password = await database.RSAdecrypt(creds.password);
            if (username instanceof Buffer || password instanceof Buffer) {
                // for some reason decoding failed, redirect to login
                if (config.debugMode) logWithId(logger.debug, 'Credentials failed to decode');
                socket.emit('credentialRes', AccountOpResult.INCORRECT_CREDENTIALS);
            }
            if (typeof username != 'string' || typeof password != 'string' || !database.validate(username, password) || typeof creds.token != 'string') {
                kick('invalid credentials');
                resolve(true);
                return;
            }
            self.username = username;
            if (config.debugMode) logWithId(logger.debug, 'Successfully recieved credentials');
            // validate the recaptcha before anything else
            if (!await checkRecaptcha(creds.token)) return;
            // actually create/check account
            if (creds.signupData != undefined) {
                // spam prevention
                if ((recentConnections.get(ip) ?? 0) > config.maxSignupPerMinute) {
                    kick('too many sign-ups');
                    return;
                }
                recentSignups.set(ip, (recentSignups.get(ip) ?? 0) + 60);
                // more validation
                const firstName = await database.RSAdecrypt(creds.signupData.firstName);
                const lastName = await database.RSAdecrypt(creds.signupData.lastName);
                const email = await database.RSAdecrypt(creds.signupData.email);
                const school = await database.RSAdecrypt(creds.signupData.school);
                if (typeof firstName != 'string' || firstName.length > 32 || typeof lastName != 'string' || lastName.length > 32 || typeof email != 'string' || email.length > 32
                    || typeof school != 'string' || school.length > 64 || !Array.isArray(creds.signupData.languages) || creds.signupData.languages.find((v) => typeof v != 'string') !== undefined
                    || typeof creds.signupData.experience != 'number' || typeof creds.signupData.grade != 'number' || creds.token == undefined || typeof creds.token != 'string') {
                    kick('invalid sign up data');
                    resolve(true);
                    return;
                }
                if (config.debugMode) logWithId(logger.info, 'Signing up');
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
                if (config.debugMode) logWithId(logger.debug, 'Sign up: ' + reverse_enum(AccountOpResult, res));
                if (res == 0) {
                    socket.removeAllListeners('credentials');
                    resolve(false);
                }
            } else {
                if (config.debugMode) logWithId(logger.info, 'Logging in');
                const res = await database.checkAccount(username, password);
                socket.emit('credentialRes', res);
                if (config.debugMode) logWithId(logger.debug, 'Log in: ' + reverse_enum(AccountOpResult, res));
                if (res == 0) {
                    socket.removeAllListeners('credentials');
                    resolve(false);
                }
            }
        });
    })) {
        if (config.debugMode) logWithId(logger.debug, 'Authentication failed');
        return;
    }
    if (config.debugMode) logWithId(logger.debug, 'Authentication successful');
    // you can only reach this point by signing in
    socket.on('getUserData', async (data: { username: string }) => {
        if (data == undefined || typeof data.username != 'string') {
            kick('invalid getUserData parameters');
            return;
        }
        socket.emit('userData', { data: await database.getAccountData(data.username), username: data.username });
    });
    socket.on('setUserData', async (data: { password: Buffer | string, data: { firstName: string, lastName: string, displayName: string, profileImage: string, bio: string, school: string, grade: number, experience: number, languages: string[] } }) => {
        if (data == undefined || data.data == undefined) {
            kick('invalid setUserData parameters');
            return;
        }
        if (config.debugMode) logWithId(logger.info, 'Updating user data');
        const password = await database.RSAdecrypt(data.password);
        const firstName = await database.RSAdecrypt(data.data.firstName);
        const lastName = await database.RSAdecrypt(data.data.lastName);
        const displayName = await database.RSAdecrypt(data.data.displayName);
        const bio = await database.RSAdecrypt(data.data.bio);
        const school = await database.RSAdecrypt(data.data.school);
        if (typeof firstName != 'string' || firstName.length > 32 || typeof lastName != 'string' || lastName.length > 32 || typeof displayName != 'string'
            || displayName.length > 32 || typeof data.data.profileImage != 'string' || data.data.profileImage.length > 40960 || typeof bio != 'string' || bio.length > 2048
            || typeof school != 'string' || school.length > 64 || typeof data.data.grade != 'number' || typeof data.data.experience != 'number'
            || !Array.isArray(data.data.languages) || data.data.languages.length > 64 || data.data.languages.find((v) => typeof v != 'string') !== undefined) {
            kick('invalid setUserData parameters');
            return;
        }
        if (typeof password != 'string' || !database.validate(self.username, password)) {
            kick('invalid credentials');
            return;
        }
        const existingData = await database.getAccountData(self.username);
        if (typeof existingData == 'object') {
            const userDat = {
                username: self.username,
                email: existingData.username,
                firstName,
                lastName,
                displayName,
                profileImage: data.data.profileImage,
                bio,
                school,
                grade: data.data.grade,
                experience: data.data.experience,
                languages: data.data.languages,
                registrations: existingData.registrations
            };
            const res = await database.updateAccountData(self.username, password, userDat);
            socket.emit('setUserDataResponse', res);
            if (config.debugMode) {
                logWithId(logger.debug, 'Update user data: ' + JSON.stringify(userDat), true);
                logWithId(logger.debug, 'Update user data: ' + reverse_enum(AccountOpResult, res));
            }
        } else {
            socket.emit('setUserDataResponse', existingData);
            if (config.debugMode) logWithId(logger.debug, 'Update user data (fetch error): ' + reverse_enum(AccountOpResult, existingData));
        }
    });
    socket.on('changeCredentials', async (creds: { password: Buffer | string, newPassword: Buffer | string, token: string }) => {
        if (creds == undefined) {
            kick('null credentials');
            return;
        }
        const password = await database.RSAdecrypt(creds.password);
        const newPassword = await database.RSAdecrypt(creds.newPassword)
        if (typeof password != 'string' || typeof newPassword != 'string' || !database.validate(self.username, password) || !database.validate(self.username, newPassword)) {
            kick('invalid credentials');
            return;
        }
        logWithId(logger.info, 'Changing credentials');
        if (!await checkRecaptcha(creds.token)) return;
        const res = await database.changePasswordAccount(self.username, password, newPassword);
        socket.emit('credentialRes', res);
        logWithId(logger.info, 'Change credentials: ' + reverse_enum(AccountOpResult, res));
    });
    socket.on('deleteCredentials', async (creds: { password: Buffer | string, token: string }) => {
        if (creds == undefined) {
            kick('null credentials');
            return;
        }
        const password = await database.RSAdecrypt(creds.password);
        if (typeof password != 'string' || !database.validate(self.username, password)) {
            kick('invalid credentials');
            return;
        }
        logWithId(logger.info, 'Deleting credentials');
        if (!await checkRecaptcha(creds.token)) return;
        const res = await database.deleteAccount(self.username, password);
        socket.emit('credentialRes', res);
        logWithId(logger.info, 'Delete credentials: ' + reverse_enum(AccountOpResult, res));
    });
    // hand off to ContestManager
    contestManager.addUser(self.username, socket);
});
let connectionKickDecrementer = setInterval(function () {
    recentConnections.forEach((val, key) => {
        recentConnections.set(key, Math.max(val - 1, 0));
    });
    recentSignups.forEach((val, key) => {
        recentSignups.set(key, Math.max(val - 1, 0));
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
    await Promise.all([mailer.disconnect(), database.disconnect()]);
    logger.destroy();
    process.exit();
};
process.on('SIGTERM', stopServer);
process.on('SIGQUIT', stopServer);
process.on('SIGINT', stopServer);
process.on('SIGILL', stopServer);
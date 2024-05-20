import config from './config';

import fs from 'fs';
import path from 'path';
import { configDotenv } from 'dotenv';
configDotenv({ path: path.resolve(config.path, '.env') });

// verify environment variables exist
if (['CONFIG_PATH', 'DATABASE_URL', 'DATABASE_CERT', 'DATABASE_KEY', 'RECAPTCHA_SECRET', 'CLIENT_PATH', 'EMAIL_TEMPLATE_PATH', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'].some((v) => process.env[v] == undefined)) {
    throw new Error('Missing environment variables. Make sure your environment is set up correctly!');
}

// start server
import { FileLogger } from './log';
const logger = new FileLogger();
logger.info('Starting server...');
logger.debug('CONFIG_PATH: ' + process.env.CONFIG_PATH);
logger.debug('EMAIL_TEMPLATE_PATH: ' + process.env.EMAIL_TEMPLATE_PATH);
logger.debug('CLIENT_PATH: ' + process.env.CLIENT_PATH);
logger.debug('Current config:\n' + JSON.stringify(config), true);

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
    max: 30,
    handler: (req, res, next) => {
        logger.warn('Rate limiting triggered by ' + req.ip ?? req.socket.remoteAddress);
    }
});
app.use(limiter);
app.use(cors({ origin: '*' }));
app.use(cookieParser());
// in case server is not running
app.get('/wakeup', (req, res) => res.json('ok'));

// init modules
import { Server as SocketIOServer } from 'socket.io';
import Database, { AccountData, AccountOpResult, reverse_enum, RSAEncrypted, TeamData, TeamOpResult } from './database';
import ContestManager from './contest';
import Mailer from './email';
import { validateRecaptcha } from './recaptcha';
import { createServerSocket } from './socket';

const mailer = new Mailer({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587), // another default
    username: process.env.SMTP_USER!,
    password: process.env.SMTP_PASS!,
    templatePath: process.env.EMAIL_TEMPLATE_PATH!,
    logger: logger
});
const database = new Database({
    uri: process.env.DATABASE_URL!,
    key: process.env.DATABASE_KEY!,
    sslCert: process.env.DATABASE_CERT,
    logger: logger,
    mailer: mailer
});
const io = new SocketIOServer(server, {
    path: '/web-socketio',
    cors: { origin: '*', methods: ['GET', 'POST'] }
});
const contestManager = new ContestManager(database, app, io, logger);

// additional http version of socket.io requests
app.get('/api/userData/:username', async (req, res) => {
    const data = await database.getAccountData(req.params.username);
    if (data == AccountOpResult.NOT_EXISTS) res.sendStatus(404);
    else if (data == AccountOpResult.ERROR) res.sendStatus(500);
    else {
        const data2 = structuredClone(data);
        data2.email = '';
        res.json(data2);
    }
});
app.get('/api/teamData/:username', async (req, res) => {
    const data = await database.getTeamData(req.params.username);
    if (data == TeamOpResult.NOT_EXISTS) res.sendStatus(404);
    else if (data == TeamOpResult.ERROR) res.sendStatus(500);
    else {
        const data2 = structuredClone(data);
        data2.joinCode = '';
        res.json(data2);
    }
});
app.get('/api/contestList', async (req, res) => {
    const data = await contestManager.getContestList();
    if (data === null) res.sendStatus(500);
    else res.json(data);
});
app.use('/api/*', (req, res) => res.sendStatus(404));

// admin portal
import attachAdminPortal from './adminPortal';
attachAdminPortal(database, app, contestManager, logger);

// static hosting optional
logger.info('SERVE_STATIC=' + config.serveStatic.toString().toUpperCase());
if (config.serveStatic) {
    const indexDir = path.resolve(process.env.CLIENT_PATH!, 'index.html');
    app.use('/', express.static(process.env.CLIENT_PATH!));
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

// complete networking
if (config.debugMode) logger.info('Creating Socket.IO server');
const sessionId = Math.random();
const recentConnections = new Map<string, number>();
const recentConnectionKicks = new Set<string>();
const recentSignups = new Map<string, number>();
const recentPasswordResetEmails = new Set<string>();
io.on('connection', async (s) => {
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

    // await credentials before allowing anything (in a weird way)
    socket.username = '[not signed in]';
    if (config.debugMode) socket.logWithId(logger.debug, 'Connection established, sending public key and requesting credentials');
    socket.emit('getCredentials', { key: database.publicKey, session: sessionId });
    const checkRecaptcha = async (token: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> => {
        const recaptchaResponse = await validateRecaptcha(token, socket.ip);
        if (recaptchaResponse instanceof Error) {
            logger.error('reCAPTCHA verification failed:');
            logger.error(recaptchaResponse.message);
            if (recaptchaResponse.stack) logger.error(recaptchaResponse.stack);
            return AccountOpResult.ERROR;
        } else if (recaptchaResponse == undefined || recaptchaResponse.success !== true || recaptchaResponse.score < 0.8) {
            if (config.debugMode) {
                socket.logWithId(logger.debug, 'reCAPTCHA verification failed:');
                socket.logWithId(logger.debug, JSON.stringify(recaptchaResponse), true);
            }
            return AccountOpResult.INCORRECT_CREDENTIALS;
        } else if (config.debugMode) {
            socket.logWithId(logger.debug, 'reCAPTCHA verification successful:');
            socket.logWithId(logger.debug, JSON.stringify(recaptchaResponse), true);
        }
        return AccountOpResult.SUCCESS;
    };
    if (await new Promise((resolve, reject) => {
        socket.on('credentials', async (creds: { username: string, password: RSAEncrypted, token: string, signupData?: { firstName: string, lastName: string, email: string, school: string, grade: number, experience: number, languages: string[] } }, cb: (res: AccountOpResult) => any) => {
            if (creds == undefined || typeof cb != 'function') {
                socket.kick('null credentials');
                resolve(true);
                return;
            }
            const password = await database.RSAdecrypt(creds.password);
            if (password instanceof Buffer) {
                // for some reason decoding failed, redirect to login
                cb(AccountOpResult.INCORRECT_CREDENTIALS);
                if (config.debugMode) socket.logWithId(logger.debug, 'Credentials failed to decode');
            }
            if (typeof creds.username != 'string' || typeof password != 'string' || !database.validate(creds.username, password) || typeof creds.token != 'string') {
                socket.kick('invalid credentials');
                resolve(true);
                return;
            }
            socket.username = creds.username;
            if (config.debugMode) socket.logWithId(logger.debug, 'Successfully received credentials');
            const recaptchaRes = await checkRecaptcha(creds.token);
            if (recaptchaRes != AccountOpResult.SUCCESS) {
                cb(recaptchaRes);
                return;
            }
            // actually create/check account
            if (creds.signupData != undefined) {
                // spam prevention
                if ((recentConnections.get(socket.ip) ?? 0) > config.maxSignupPerMinute) {
                    socket.kick('too many sign-ups');
                    return;
                }
                recentSignups.set(socket.ip, (recentSignups.get(socket.ip) ?? 0) + 60);
                // even more validation
                if (typeof creds.signupData.firstName != 'string' || creds.signupData.firstName.length > 32 || typeof creds.signupData.lastName != 'string' || creds.signupData.lastName.length > 32 || typeof creds.signupData.email != 'string'
                    || creds.signupData.email.length > 32 || typeof creds.signupData.school != 'string' || creds.signupData.school.length > 64 || !Array.isArray(creds.signupData.languages) || creds.signupData.languages.find((v) => typeof v != 'string') !== undefined
                    || typeof creds.signupData.experience != 'number' || typeof creds.signupData.grade != 'number' || creds.token == undefined || typeof creds.token != 'string') {
                    socket.kick('invalid sign up data');
                    resolve(true);
                    return;
                }
                if (config.debugMode) socket.logWithId(logger.info, 'Signing up');
                const res = await database.createAccount(creds.username, password, {
                    email: creds.signupData.email,
                    firstName: creds.signupData.firstName,
                    lastName: creds.signupData.lastName,
                    school: creds.signupData.school,
                    languages: creds.signupData.languages,
                    grade: creds.signupData.grade,
                    experience: creds.signupData.experience,
                });
                cb(res);
                if (config.debugMode) socket.logWithId(logger.debug, 'Sign up: ' + reverse_enum(AccountOpResult, res));
                if (res == 0) {
                    socket.removeAllListeners('credentials');
                    socket.removeAllListeners('requestRecovery');
                    socket.removeAllListeners('recoverCredentials');
                    resolve(false);
                }
            } else {
                if (config.debugMode) socket.logWithId(logger.info, 'Logging in');
                const res = await database.checkAccount(creds.username, password);
                cb(res);
                if (config.debugMode) socket.logWithId(logger.debug, 'Log in: ' + reverse_enum(AccountOpResult, res));
                if (res == 0) {
                    socket.removeAllListeners('credentials');
                    socket.removeAllListeners('requestRecovery');
                    socket.removeAllListeners('recoverCredentials');
                    resolve(false);
                }
            }
        });
        socket.on('requestRecovery', async (creds: { username: string, email: string, token: string }, cb: (res: AccountOpResult) => any) => {
            if (creds == undefined || typeof cb != 'function') {
                socket.kick('null credentials');
                resolve(true);
                return;
            }
            if (typeof creds.username != 'string' || typeof creds.email != 'string' || !database.validate(creds.username, 'dummyPass') || typeof creds.token != 'string') {
                socket.kick('invalid credentials');
                return;
            }
            socket.logWithId(logger.info, 'Received request to send recovery email');
            const recaptchaRes = await checkRecaptcha(creds.token);
            if (recaptchaRes != AccountOpResult.SUCCESS) {
                cb(recaptchaRes);
                return;
            }
            const data = await database.getAccountData(creds.username);
            if (typeof data != 'object') {
                cb(data);
                if (config.debugMode) socket.logWithId(logger.debug, 'Could not send recovery email: ' + reverse_enum(AccountOpResult, data));
                else if (data == AccountOpResult.ERROR) socket.logWithId(logger.error, 'Could not send recovery email: ' + reverse_enum(AccountOpResult, data));
                return;
            }
            if (creds.email !== data.email) {
                cb(AccountOpResult.INCORRECT_CREDENTIALS);
                if (config.debugMode) socket.logWithId(logger.debug, 'Could not send recovery email: INCORRECT_CREDENTIALS');
                return;
            }
            socket.logWithId(logger.info, 'Account recovery via email password reset started');
            if (recentPasswordResetEmails.has(creds.username)) {
                cb(AccountOpResult.ALREADY_EXISTS);
                socket.logWithId(logger.warn, 'Account recovery email could not be sent because of rate limiting');
                return;
            }
            const recoveryPassword = await database.getRecoveryPassword(creds.username);
            if (typeof recoveryPassword != 'string') {
                cb(recoveryPassword);
                if (config.debugMode) socket.logWithId(logger.debug, 'Could not send recovery email: ' + reverse_enum(AccountOpResult, recoveryPassword));
                return;
            }
            const recoveryUrl = `https://${config.hostname}/recovery/?user=${creds.username}&pass=${recoveryPassword}`;
            await mailer.sendFromTemplate('base', [creds.email], 'Reset Password', [
                ['title', 'Account Recovery Request'],
                ['content', `
                <h3>Hallo ${data.displayName}!</h3>
                <br>
                You recently requested a password reset. Reset it with the button below, or click <a href="${recoveryUrl}">this link</a>.
                <br><br>
                <div class="centered">
                <a href="${recoveryUrl}">
                <button style="border-radius: 12px; height: 40px; padding: 0px 16px; background-color: black; color: lime; font-weight: bold; cursor: pointer;">RESET PASSWORD</button>
                </a>
                <br>
                Not you? You can ignore this email.
                </div>
                `]
            ], `Hallo ${data.displayName}!\nYou recently requested a password reset. Reset it here: ${recoveryUrl}.\nNot you? You can ignore this email.`);
            recentPasswordResetEmails.add(creds.username);
            cb(AccountOpResult.SUCCESS);
            socket.logWithId(logger.info, 'Account recovery email was sent successfully');
            // remove the listener to try and combat spam some more
            socket.removeAllListeners('recoverCredentials');
        });
        socket.on('recoverCredentials', async (creds: { username: string, recoveryPassword: RSAEncrypted, newPassword: RSAEncrypted, token: string }, cb: (res: AccountOpResult) => any) => {
            if (creds == undefined || typeof cb != 'function') {
                socket.kick('null credentials');
                resolve(true);
                return;
            }
            const recoveryPassword = await database.RSAdecrypt(creds.recoveryPassword);
            const newPassword = await database.RSAdecrypt(creds.newPassword);
            if (typeof creds.username != 'string' || typeof recoveryPassword != 'string' || typeof newPassword != 'string' || !database.validate(creds.username, newPassword) || typeof creds.token != 'string') {
                socket.kick('invalid credentials');
                return;
            }
            socket.logWithId(logger.info, 'Received request to recover credentials');
            const recaptchaRes = await checkRecaptcha(creds.token);
            if (recaptchaRes != AccountOpResult.SUCCESS) {
                cb(recaptchaRes);
                return;
            }
            const res = await database.changeAccountPasswordToken(creds.username, recoveryPassword, newPassword);
            socket.logWithId(logger.info, 'Recover account: ' + reverse_enum(AccountOpResult, res));
            cb(res);
            // remove the listener to try and combat spam some more
            socket.removeAllListeners('recoverCredentials');
        });
    })) {
        if (config.debugMode) socket.logWithId(logger.debug, 'Authentication failed');
        return;
    }

    // only can reach this point after signing in
    if (config.debugMode) socket.logWithId(logger.debug, 'Authentication successful');

    // add remaining listeners
    socket.on('setUserData', async (data: { firstName: string, lastName: string, displayName: string, profileImage: string, bio: string, school: string, grade: number, experience: number, languages: string[] }, cb: (res: AccountOpResult) => any) => {
        if (config.debugMode) socket.logWithId(logger.info, 'Updating user data');
        if (data == null || typeof data.firstName != 'string' || data.firstName.length > 32 || typeof data.lastName != 'string' || data.lastName.length > 32 || typeof data.displayName != 'string'
            || data.displayName.length > 32 || typeof data.profileImage != 'string' || data.profileImage.length > 65535 || typeof data.bio != 'string' || data.bio.length > 2048
            || typeof data.school != 'string' || data.school.length > 64 || typeof data.grade != 'number' || typeof data.experience != 'number'
            || !Array.isArray(data.languages) || data.languages.length > 64 || data.languages.find((v) => typeof v != 'string') !== undefined || typeof cb != 'function') {
            socket.kick('invalid setUserData payload');
            return;
        }
        // some fields aren't used, so it doesn't matter
        const userDat: AccountData = {
            username: socket.username,
            email: '',
            firstName: data.firstName,
            lastName: data.lastName,
            displayName: data.displayName,
            profileImage: data.profileImage,
            bio: data.bio,
            school: data.school,
            grade: data.grade,
            experience: data.experience,
            languages: data.languages,
            registrations: [],
            pastRegistrations: [],
            team: ''
        };
        const res = await database.updateAccountData(socket.username, userDat);
        cb(res);
        if (config.debugMode) socket.logWithId(logger.debug, 'Update user data: ' + reverse_enum(AccountOpResult, res));
    });
    socket.on('changeCredentials', async (creds: { password: RSAEncrypted, newPassword: RSAEncrypted, token: string }, cb: (res: AccountOpResult) => any) => {
        if (creds == null || typeof cb != 'function') {
            socket.kick('null credentials');
            return;
        }
        const password = await database.RSAdecrypt(creds.password);
        const newPassword = await database.RSAdecrypt(creds.newPassword)
        if (typeof password != 'string' || typeof newPassword != 'string' || !database.validate(socket.username, password) || !database.validate(socket.username, newPassword)) {
            socket.kick('invalid credentials');
            return;
        }
        socket.logWithId(logger.info, 'Changing credentials');
        const recaptchaRes = await checkRecaptcha(creds.token);
        if (recaptchaRes != AccountOpResult.SUCCESS) {
            cb(recaptchaRes);
            socket.logWithId(logger.info, 'Delete credentials: ' + reverse_enum(AccountOpResult, recaptchaRes));
            return;
        }
        const res = await database.changeAccountPassword(socket.username, password, newPassword);
        cb(res);
        socket.logWithId(logger.info, 'Change credentials: ' + reverse_enum(AccountOpResult, res));
    });
    socket.on('deleteCredentials', async (creds: { password: RSAEncrypted, token: string }, cb: (res: AccountOpResult) => any) => {
        if (creds == null || typeof cb != 'function') {
            socket.kick('null credentials');
            return;
        }
        const password = await database.RSAdecrypt(creds.password);
        if (typeof password != 'string' || !database.validate(socket.username, password)) {
            socket.kick('invalid credentials');
            return;
        }
        socket.logWithId(logger.info, 'Deleting credentials');
        const recaptchaRes = await checkRecaptcha(creds.token);
        if (recaptchaRes != AccountOpResult.SUCCESS) {
            cb(recaptchaRes);
            socket.logWithId(logger.info, 'Delete credentials: ' + reverse_enum(AccountOpResult, recaptchaRes));
            return;
        }
        const res = await database.deleteAccount(socket.username, password);
        cb(res);
        socket.logWithId(logger.info, 'Delete credentials: ' + reverse_enum(AccountOpResult, res));
    });
    socket.on('joinTeam', async (data: { code: string, token: string }, cb: (res: TeamOpResult) => any) => {
        if (data == null || typeof data.code != 'string' || typeof data.token != 'string' || typeof cb != 'function') {
            socket.kick('invalid joinTeam payload');
        }
        if (config.debugMode) socket.logWithId(logger.info, 'Joining team: ' + data.code);
        const respond = (code: TeamOpResult) => {
            cb(code);
            if (config.debugMode) socket.logWithId(logger.info, 'Join team: ' + reverse_enum(TeamOpResult, code));
        };
        const recaptchaRes = await checkRecaptcha(data.token);
        if (recaptchaRes != AccountOpResult.SUCCESS) {
            respond(recaptchaRes == AccountOpResult.INCORRECT_CREDENTIALS ? TeamOpResult.INCORRECT_CREDENTIALS : TeamOpResult.ERROR);
            return;
        }
        // first join so can check team data
        const res = await database.setAccountTeam(socket.username, data.code, true);
        if (res != TeamOpResult.SUCCESS) { respond(res); return; }
        const userData = await database.getAccountData(socket.username);
        const teamData = await database.getTeamData(socket.username);
        if (typeof teamData != 'object') { respond(teamData); return; }
        const resetTeam = async () => {
            const res2 = await database.setAccountTeam(socket.username, socket.username);
            if (res2 != TeamOpResult.SUCCESS) socket.logWithId(logger.warn, 'Join team failed but could not reset team! Code: ' + reverse_enum(TeamOpResult, res2));
        };
        if (typeof userData != 'object') {
            respond(userData == AccountOpResult.NOT_EXISTS ? TeamOpResult.NOT_EXISTS : TeamOpResult.ERROR);
            await resetTeam();
            return;
        }
        // make sure won't violate restrictions
        const contests = await database.readContests(userData.registrations);
        if (contests == null) { respond(TeamOpResult.ERROR); resetTeam(); return; }
        if (contests.some((c) => c.maxTeamSize <= teamData.members.length)) {
            respond(TeamOpResult.CONTEST_MEMBER_LIMIT);
            await resetTeam();
            return;
        }
        const res2 = await database.unregisterAllContests(socket.username);
        if (res2 != TeamOpResult.SUCCESS) {
            respond(res2);
            await resetTeam();
            return;
        }
        // already set team before
        respond(TeamOpResult.SUCCESS);
        // update join code here
        if (typeof teamData == 'object') socket.emit('teamJoinCode', teamData.joinCode);
    });
    socket.on('leaveTeam', async (cb: (res: TeamOpResult) => any) => {
        if (typeof cb != 'function')
            if (config.debugMode) socket.logWithId(logger.info, 'Leaving team');
        const res = await database.setAccountTeam(socket.username, socket.username);
        cb(res);
        const teamData = await database.getTeamData(socket.username);
        if (typeof teamData == 'object') socket.emit('teamJoinCode', teamData.joinCode);
    });
    socket.on('kickTeam', async (data: { user: string, token: string }, cb: (res: TeamOpResult) => any) => {
        if (data == null || typeof data.user != 'string' || typeof data.token != 'string' || typeof cb != 'function') {
            socket.kick('invalid kickTeam payload');
        }
        if (config.debugMode) socket.logWithId(logger.info, 'Kicking user from team: ' + data.user);
        const respond = (code: TeamOpResult) => {
            cb(res);
            if (config.debugMode) socket.logWithId(logger.info, 'Kick user: ' + reverse_enum(TeamOpResult, code));
        };
        const recaptchaRes = await checkRecaptcha(data.token);
        if (recaptchaRes != AccountOpResult.SUCCESS) {
            respond(recaptchaRes == AccountOpResult.INCORRECT_CREDENTIALS ? TeamOpResult.INCORRECT_CREDENTIALS : TeamOpResult.ERROR);
            return;
        }
        const res = await database.setAccountTeam(data.user, data.user);
        respond(res);
    });
    socket.on('setTeamData', async (data: { teamName: string, teamBio: string }, cb: (res: TeamOpResult) => any) => {
        if (config.debugMode) socket.logWithId(logger.info, 'Updating team data');
        if (data == null || typeof data.teamName != 'string' || data.teamName.length > 32 || typeof data.teamBio != 'string' || data.teamBio.length > 1024 || typeof cb != 'function') {
            socket.kick('invalid setTeamData payload');
            return;
        }
        // some fields aren't used, so it doesn't matter
        const teamDat: TeamData = {
            id: '',
            name: data.teamName,
            bio: data.teamBio,
            members: [],
            joinCode: ''
        };
        const res = await database.updateTeamData(socket.username, teamDat);
        cb(res);
        if (config.debugMode) socket.logWithId(logger.debug, 'Update team data: ' + reverse_enum(AccountOpResult, res));

    });
    database.getTeamData(socket.username).then((data) => {
        if (typeof data == 'object') socket.emit('teamJoinCode', data.joinCode);
    });
    database.getAccountData(socket.username).then((data) => {
        if (typeof data == 'object') socket.emit('privateUserData', { email: data.email });
    });
    // hand off to ContestManager
    contestManager.addUser(socket);
});
let c = 0;
const connectionKickDecrementer = setInterval(() => {
    recentConnections.forEach((val, key) => {
        recentConnections.set(key, Math.max(val - 1, 0));
    });
    recentSignups.forEach((val, key) => {
        recentSignups.set(key, Math.max(val - 1, 0));
    });
    recentConnectionKicks.clear();
    c++;
    if (c % 600 == 0) recentPasswordResetEmails.clear();
}, 1000);

database.connectPromise.then(() => {
    server.listen(config.port);
    logger.info(`Listening to port ${config.port}`);
});

const stopServer = async () => {
    logger.info('Stopping server...');
    let actuallyStop = () => {
        logger.info('[!] Forced server close! Skipped waiting for shutdown! [!]');
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

const handleUncaughtError = async (err: any, origin: string | Promise<unknown>) => {
    if (err instanceof Error) {
        logger.fatal(err.message);
        if (err.stack) logger.fatal(err.stack);
    } else if (err != undefined) logger.fatal(err);
    if (typeof origin == 'string') logger.fatal(origin);
    stopServer();
};
process.on('uncaughtException', handleUncaughtError);
process.on('unhandledRejection', handleUncaughtError);
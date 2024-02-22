const config = require('./config.json');
const fs = require('fs')
const path = require('path');
const express = require('express');
const app = express();
const server = fs.existsSync('./.local') ? require('https').createServer({
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem')
}, app) : require('http').createServer(app);
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 100,
    max: 10,
    handler: function (req, res, options) {
        console.warn('Rate limiting triggered by ' + req.ip ?? req.socket.remoteAddress);
    }
});
app.use(limiter);
app.get('/', (req, res) => res.sendFile(path.resolve('./../accit-client/index.html')));
app.get('/login', (req, res) => res.sendFile(path.resolve('./../accit-client/login.html')));
app.use('/', express.static(path.resolve('./../accit-client')));

const Database = require('./database.js');
const accounts = new Database(process.env.DATABASE_URL ?? require('./local-database.json'));

const recentConnections = [];
const recentConnectionKicks = [];
const io = new (require('socket.io')).Server(server);
io.on('connection', async (s) => {
    const socket = s;
    // some spam protection stuff
    let kick = (e) => {
        socket.removeAllListeners();
        socket.onevent = function (packet) { };
        socket.disconnect();
    };
    socket.on('error', kick);
    // connection DOS detection
    socket.handshake.headers['x-forwarded-for'] = socket.handshake.headers['x-forwarded-for'] ?? '127.0.0.1';
    recentConnections[socket.handshake.headers['x-forwarded-for']] = (recentConnections[socket.handshake.headers['x-forwarded-for']] ?? 0) + 1;
    if (recentConnections[socket.handshake.headers['x-forwarded-for']] > 3) {
        recentConnectionKicks[socket.handshake.headers['x-forwarded-for']] = true;
        kick();
        return;
    }
    // spam DOS protection
    let packetCount = 0;
    const onevent = socket.onevent;
    socket.onevent = function (packet) {
        if (packet.data[0] == null) {
            kick();
            return;
        }
        onevent.call(this, packet);
        packetCount++;
    };
    const packetcheck = setInterval(async function () {
        if (!socket.connected) clearInterval(packetcheck);
        packetCount = Math.max(packetCount - 250, 0);
        if (packetCount > 0) kick();
    }, 1000);
    // await credentials before allowing anything (in a weird way)
    socket.emit('getCredentials');
    if (await new Promise((resolve, reject) => {
        socket.on('credentials', async (creds) => {
            if (creds == null || (creds.action != 0 && creds.action != 1)) {
                kick();
                resolve(true);
                return;
            }
            let u = await accounts.RSAdecode(creds.username);
            let p = await accounts.RSAdecode(creds.password);
            if (!accounts.validate(u, p)) {
                kick();
                resolve(true);
                return;
            }
            const res = await (creds.action ? accounts.createAccount : accounts.checkAccount)(u, p);
            if (res == 0) {
                socket.off('credentials');
                resolve(false);
            } else {
                socket.emit('credentialFail', res);
            }
        });
    })) return;
    socket.emit('credentialPass');
    if (config.superSecretSecret) socket.emit('superSecretMessage');
    // add rest of stuff here
    // including submissions
});
server.listen(config.port);
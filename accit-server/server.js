const config = require('./config.json');
const fs = require('fs')
const express = require('express');
const app = express();
const server = require('https').createServer({
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem')
}, app);
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 100,
    max: 10,
    handler: function (req, res, options) {
        console.warn('Rate limiting triggered by ' + req.ip ?? req.socket.remoteAddress);
    }
});
const path = require('path');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));
app.use(limiter);
app.get('/', (req, res) => res.sendFile(path.resolve('./../accit-client/index.html')));
app.get('/login', (req, res) => res.sendFile(path.resolve('./../accit-client/login.html')));
app.use('/', express.static(path.resolve('./../accit-client')));

// also functionality to request submission status, previous submissions and leaderboards
// note: tiebreaker is program time or submission time

const io = new (require('socket.io')).Server(server);
io.on('connection', async (s) => {
    const socket = s;
    let kick = (e) => {
        socket.removeAllListeners();
        socket.onevent = function (packet) { };
        socket.disconnect();
    };
    socket.on('error', kick);
    // dos spam protection
    let packetCount = 0;
    const onevent = socket.onevent;
    socket.onevent = function(packet) {
        if (packet.data[0] == null) {
            kick();
            return;
        }
        onevent.call(this, packet);
        packetCount++;
    };
    const packetcheck = setInterval(async function() {
        if (!socket.connected) clearInterval(packetcheck);
        packetCount = Math.max(packetCount-250, 0);
        if (packetCount > 0) kick();
    }, 1000);
    // await credentials before allowing anything (in a weird way)
    if (await new Promise((resolve, reject) => {
        socket.once('credentials', (creds) => {
            if (creds == null || creds.action != 0 || creds.action != 1 || !(typeof creds.username == 'string') || !(typeof creds.password == 'string')
                || creds.username.length > 16 || creds.password.length > 1024 || !/^[a-zA-Z0-9]$/.test(creds.username)) {
                kick();
                resolve(true);
                return;
            }
            // 0: login
            // 1: sign up
            resolve(false);
        });
    })) return;
    if (config.superSecretSecret) socket.emit('superSecretMessage');
});
server.listen(config.port);
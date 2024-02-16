const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 100,
    max: 1,
    handler: function (req, res, options) {
        console.warn('Rate limiting triggered by ' + req.ip ?? req.socket.remoteAddress);
    }
});
const path = require('path');

app.use(cors({
    origin: '*',
    methods: ['GET']
}));
app.use(limiter);
app.get('/', (req, res) => res.sendFile(path.resolve('./../csi-client/index.html')));
app.use('/', express.static(path.resolve('./../csi-client')));

// set up account system, communicate with DOMjudge here
// every request should require credentials (http headers have authorization option)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
// account system is just local db (written using msgpack) storing problem status and file size
// also functionality to request submission status, previous submissions and leaderboards
// note: tiebreaker is program time or submission time

server.listen(8080);
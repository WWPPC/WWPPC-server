const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 100,
    max: 5,
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

server.listen(8080);
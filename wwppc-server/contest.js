// Copyright (C) 2024 Sampleprovider(sp)

const config = require('./config.json');

class ContestManager {
    // controls contest buh
    // all socketio connections are put here
    // start/stop rounds, control which problems are where
    // uses database to get problems and then caches them
    // use http requests for problems to avoid useless socketio spam
    // also prevent people from opening the contest page multiple times
}

module.exports = ContestManager;
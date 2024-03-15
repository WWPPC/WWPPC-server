import path from 'path';

process.env.CONFIG_PATH ??= path.resolve(__dirname, '../config/');
const config: {
    port: string
    serveStatic: boolean
    maxConnectPerSecond: number
    dbCacheTime: number
    superSecretSecret: boolean
    path: string
} = require(path.resolve(process.env.CONFIG_PATH, 'config.json'));
config.path = process.env.CONFIG_PATH;
if (process.env.PORT != undefined) config.port = process.env.PORT;

export default config;
import fs from 'fs';
import path from 'path';

process.env.CONFIG_PATH ??= path.resolve(__dirname, '../config/');
const fileConfig = require(path.resolve(process.env.CONFIG_PATH, 'config.json'));
const config: {
    readonly port: string
    readonly serveStatic: boolean
    readonly maxConnectPerSecond: number
    readonly maxSignupPerMinute: number
    readonly dbCacheTime: number
    readonly logEmailActivity: boolean
    readonly debugMode: boolean
    readonly superSecretSecret: boolean
    readonly path: string
} = {
    ...fileConfig,
    port: process.env.PORT ?? fileConfig.port,
    serveStatic: process.argv.includes('serve_static') ?? process.env.SERVE_STATIC ?? fileConfig.serveStatic,
    path: process.env.CONFIG_PATH,
};
const certPath = path.resolve(process.env.CONFIG_PATH, 'db-cert.pem');
if (fs.existsSync(certPath)) process.env.DATABASE_CERT = fs.readFileSync(certPath, 'utf8');
process.env.CLIENT_PATH ??= path.resolve(__dirname, '../../wwppc-client/dist');

export default config;
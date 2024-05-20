import fs from 'fs';
import path from 'path';

process.env.CONFIG_PATH ??= path.resolve(__dirname, '../config/');
const fileConfig = require(path.resolve(process.env.CONFIG_PATH, 'config.json'));
const config: {
    readonly hostname: string
    readonly port: string
    readonly serveStatic: boolean
    readonly maxConnectPerSecond: number
    readonly maxSignupPerMinute: number
    readonly defaultProfileImg: string
    readonly dbCacheTime: number
    readonly graderAuthKeypairs
    readonly logEmailActivity: boolean
    readonly debugMode: boolean
    readonly superSecretSecret: boolean
    readonly path: string
} = {
    ...fileConfig,
    hostname: process.env.HOSTNAME ?? fileConfig.hostname,
    port: process.env.PORT ?? fileConfig.port,
    serveStatic: process.argv.includes('serve_static') ?? process.env.SERVE_STATIC ?? fileConfig.serveStatic,
    debugMode: process.argv.includes('debug_mode') ?? fileConfig.debugMode,
    path: process.env.CONFIG_PATH,
};
const certPath = path.resolve(process.env.CONFIG_PATH, 'db-cert.pem');
if (fs.existsSync(certPath)) process.env.DATABASE_CERT = fs.readFileSync(certPath, 'utf8');
process.env.EMAIL_TEMPLATE_PATH ??= path.resolve(__dirname, '../email-templates');
process.env.CLIENT_PATH ??= path.resolve(__dirname, '../../wwppc-client/dist');

export default config;
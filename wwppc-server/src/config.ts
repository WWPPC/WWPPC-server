import fs from 'fs';
import path from 'path';

process.env.CONFIG_PATH ??= path.resolve(__dirname, '../config/');
process.env.EMAIL_TEMPLATE_PATH ??= path.resolve(__dirname, '../email-templates');
process.env.CLIENT_PATH ??= path.resolve(__dirname, '../../wwppc-client/dist');
const fileConfig = require(path.resolve(process.env.CONFIG_PATH, 'config.json'));
const config: {
    readonly hostname: string
    readonly emailAddress: string
    readonly port: string
    readonly serveStatic: boolean
    readonly maxConnectPerSecond: number
    readonly maxSignupPerMinute: number
    readonly defaultProfileImg: string
    readonly maxProfileImgSize: number
    readonly dbCacheTime: number
    readonly graderTimeout: number
    readonly acceptedLanguages: string[]
    readonly maxSubmissionSize: number
    readonly logEmailActivity: boolean
    readonly debugMode: boolean
    readonly superSecretSecret: boolean
    readonly path: string
    readonly emailTemplatePath: string
    readonly clientPath: string
} = {
    ...fileConfig,
    port: process.env.PORT ?? fileConfig.port,
    serveStatic: process.argv.includes('serve_static') ?? process.env.SERVE_STATIC ?? fileConfig.serveStatic,
    debugMode: process.argv.includes('debug_mode') ?? fileConfig.debugMode,
    path: process.env.CONFIG_PATH,
    emailTemplatePath: process.env.EMAIL_TEMPLATE_PATH,
    clientPath: process.env.CLIENT_PATH,
};
const certPath = path.resolve(process.env.CONFIG_PATH, 'db-cert.pem');
if (fs.existsSync(certPath)) process.env.DATABASE_CERT = fs.readFileSync(certPath, 'utf8');

export default config;
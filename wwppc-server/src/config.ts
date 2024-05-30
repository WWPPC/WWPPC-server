import fs from 'fs';
import path from 'path';

process.env.CONFIG_PATH ??= path.resolve(__dirname, '../config/');
process.env.EMAIL_TEMPLATE_PATH ??= path.resolve(__dirname, '../email-templates');
process.env.CLIENT_PATH ??= path.resolve(__dirname, '../../wwppc-client/dist');
const certPath = path.resolve(process.env.CONFIG_PATH, 'db-cert.pem');
if (fs.existsSync(certPath)) process.env.DATABASE_CERT = fs.readFileSync(certPath, 'utf8');
const configPath = path.resolve(process.env.CONFIG_PATH, 'config.json');
if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, '{}', 'utf8');
const fileConfig = require(configPath);
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
    readonly dbProblemCacheTime: number
    readonly graderTimeout: number
    readonly acceptedLanguages: string[]
    readonly maxSubmissionSize: number
    readonly gradeAtRoundEnd: boolean
    readonly logEmailActivity: boolean
    readonly debugMode: boolean
    readonly superSecretSecret: boolean
    readonly path: string
    readonly emailTemplatePath: string
    readonly clientPath: string
} = {
    hostname: fileConfig.hostname ?? 'wwppc.tech',
    emailAddress: fileConfig.emailAddress ?? 'no-reply@wwppc.tech',
    port: process.env.PORT ?? fileConfig.port ?? 8000,
    serveStatic: process.argv.includes('serve_static') ?? fileConfig.serveStatic ?? false,
    maxConnectPerSecond: fileConfig.maxConnectPerSecond ?? 5,
    maxSignupPerMinute: fileConfig.maxSignupPerMinute ?? 1,
    defaultProfileImg: fileConfig.defaultProfileImg ?? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARxSURBVHhe7dy9SiRZAAXgdkeMzHwHAw0EQzNfREQwEVEMDAQfrp/DSBNB0MA2M3C3Zy1mZZ3rtP1TXXXP9yXFNavmnu5zEgcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAPG1vb29tbTUHiLKzs/P09DQajTY3N5s/QYjx7b+7u/v7X+MM+B0gyN7e3s3Nzfvtf3d/fy8DRBj3/sfHx+bif/D8/CwDVO699zdX/hN7gJp97P0l9gB1+tz7S+wBalPq/SX2APX4uveX2APUYJLeX2IP0G+T9/4Se4C++m7vL7EH6J/pen+JPUCfzNL7S+wB+mH23l9iD9B18+r9JfYA3TXf3l9iD9BFi+j9JfYA3bK43l9iD9AVi+79JfYAy9dO7y+xB1imNnt/iT3AcrTf+0vsAdq2rN5fYg/QnuX2/hJ7gDZ0ofeX2AMsVnd6f4k9wKJ0rfeX2APMXzd7f4k9wDx1ufeX2APMR/d7f4k9wKz60vtL7AGm16/eX2IPMI0+9v4Se4Dv6W/vL7EHmFTfe3+JPcCf1dH7S+wBvlJT7y+xB/i9+np/iT3A/9Xa+0vsAf5Td+8vsQf4KaH3l9gD6XJ6f4k9kCut95eE74GV5hlmfX399vZ2Y2OjOWcb/w7s7u4+PDw05yQ/mmeY19fXtbW1/f39lZXQr4Bfxj8CV1dXw+GwOZPj9PT0vQbEent7u7y8bD4OAh0fHzd3Ic/Ly8vR0dHq6mrzWZDp4OBg/EXYXIoYo9Ho7OzM7een6+vrqAyMX/bk5KR5eRjL2QN6P7+XsAf0fr5S9x7Q+/mzWveA3s+k6tsDej/fU9Me0PuZRh17QO9nen3fA3o/s+rvHtD7mY8+7gG9n3nq1x7Q+5m/vuwBvZ9F6f4e0PtZrC7vAb2fNnRzD+j9tKdre0Dvp23d2QN6P8vRhT2g97NMy90Dej/Lt6w9oPfTFe3vAb2fbmlzD+j9dFE7e0Dvp7sWvQf0frpucXtA76cfFrEH9H76ZL57QO+nf+a1B/R++mr2PaD302+z7AG9nxpMtwf0furx3T2g91ObyfeA3k+dJtkDej81+3oP6P3Ur7QH9H5SfN4Dej9ZPu4BvZ9E73tA7yfXeA/o/QAAAAAAAAAAAAAAAAAAAAAAAAAAsVaaJ4PB4eHh+fl5c6jXxcXFcDhsDvDLOADNPyyv2vg1mxdmMPireUIkASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBsMPgHSaq6IM8BzA4AAAAASUVORK5CYII=',
    maxProfileImgSize: fileConfig.maxProfileImgSize ?? 65535,
    dbCacheTime: fileConfig.dbCacheTime ?? 60000,
    dbProblemCacheTime: fileConfig.dbProblemCacheTime ?? 600000,
    graderTimeout: fileConfig.graderTimeout ?? 180000,
    acceptedLanguages: fileConfig.acceptedLanguages ?? [
        'Java8',
        'Java11',
        'Java17',
        'Java21',
        'C11',
        'C++11',
        'C++17',
        'C++20',
        'Python3.12.3'
    ],
    maxSubmissionSize: fileConfig.maxSubmissionSize ?? 10240,
    gradeAtRoundEnd: fileConfig.gradeAtRoundEnd ?? true,
    logEmailActivity: fileConfig.logEmailActivity ?? true,
    debugMode: process.argv.includes('debug_mode') ?? fileConfig.debugMode ?? false,
    superSecretSecret: fileConfig.superSecretSecret ?? false,
    path: process.env.CONFIG_PATH,
    emailTemplatePath: process.env.EMAIL_TEMPLATE_PATH,
    clientPath: process.env.CLIENT_PATH,
};
const config2: any = structuredClone(config);
config2.port = fileConfig.port ?? 8000;
config2.serveStatic = fileConfig.serveStatic ?? false;
config2.debugMode = fileConfig.debugMode ?? false;
delete config2.path;
delete config2.emailTemplatePath;
delete config2.clientPath;
fs.writeFileSync(configPath, JSON.stringify(config2, null, 4));

export default config;
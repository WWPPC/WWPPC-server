import fs from 'fs';
import path from 'path';

process.env.CONFIG_PATH ??= path.resolve(__dirname, '../config/');
const certPath = path.resolve(process.env.CONFIG_PATH, 'db-cert.pem');
if (fs.existsSync(certPath)) process.env.DATABASE_CERT = fs.readFileSync(certPath, 'utf8');
const configPath = path.resolve(process.env.CONFIG_PATH, 'config.json');
const contestPath = path.resolve(process.env.CONFIG_PATH, 'contests.json');
function loadConfig() {
    try {
        if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, '{}', 'utf8');
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {
        return {};
    }
}
function loadContests() {
    try {
        if (!fs.existsSync(contestPath)) fs.writeFileSync(contestPath, '{}', 'utf8');
        return JSON.parse(fs.readFileSync(contestPath, 'utf8'));
    } catch {
        return {};
    }
}
const fileConfig = loadConfig();
const fileContests = loadContests();

/**
 * Global server configuration, loaded from `config/config.json`.
 * Includes contest configurations, loaded from `config/contests.json`.
 */
export interface GlobalConfiguration {
    /**Hostname of website to be linked to in emails (default: "wwppc.tech") */
    readonly hostname: string
    /**Sending email address (default: "no-reply@wwppc.tech")*/
    readonly emailAddress: string
    /**TCP port for the HTTP/HTTPS server to listen to (default: 8000) */
    readonly port: string
    /**Hours until login sessions expire (default 12) */
    readonly sessionExpireTime: number
    /**Hours between client RSA keypair rotations (default: 24) */
    readonly rsaKeyRotateInterval: number
    /**Ratelimiting - how many new accounts can be made from any given IP address in 1 minute before requests are blocked (default: 1) */
    readonly maxSignupPerMinute: number
    /**Ratelimiting - how much time (in minutes) must pass between recovery emails being sent for any account (default: 10) */
    readonly recoveryEmailTimeout: number
    /**A `data:` URI representing the profile image given to every account on creation */
    readonly defaultProfileImg: string
    /**Maximum file size of uploaded profile images in bytes (default: 65535) */
    readonly maxProfileImgSize: number
    /**Time in milliseconds before database cache entries expire (default: 60000) */
    readonly dbCacheTime: number
    /**Time in milliseconds before database cache entries for problems expire (default: 600000) */
    readonly dbProblemCacheTime: number
    /**Time in milliseconds before the grading host defaults a grading server to "disconnected" state (default: 180000) */
    readonly graderTimeout: number
    /**Contest types and options (no defaults) */
    readonly contests: {
        readonly [key: string]: ContestConfiguration | undefined
    }
    /**Maximum amount of previous submissions for a user on a problem kept in the database (default: 24) */
    readonly maxSubmissionHistory: number
    /**Log information about sent emails (default: true) */
    readonly logEmailActivity: boolean
    /**Enable debug logging (default: false) */
    readonly debugMode: boolean
    /**Same as the `CONFIG_PATH` environment variable (this cannot be edited in `config.json``) */
    readonly path: string
    /**Directory to write logs to - server will also create a `logs` directory there (default: `../`) */
    readonly logPath: string
    /**Directory to load email templates from (default: `../email-templates/`) */
    readonly emailTemplatePath: string
}
/**
 * Configuration settings for a contest type, part of the {@link GlobalConfiguration.contests} field of {@link GlobalConfiguration}. Loaded from contests.json.
 */
export interface ContestConfiguration {
    /**Use grading system to evaluate submissions, otherwise grade manually (default: true) */
    readonly graders: boolean
    /**Enable round separation (allows grouping of problems, where only the current and previous rounds are visible and submittable) (default: true) */
    readonly rounds: boolean
    /**Restrict submissions to only the active round (default: false) */
    readonly restrictiveRounds: boolean
    /**"Freeze" scores - stop updating scores for clients - for some amount of time (minutes) before the last round ends (default: 60) */
    readonly scoreFreezeTime: number
    /**Withhold submission results for each round until the round ends (submissions are still instantly graded however) (default: false) */
    readonly withholdResults: boolean
    /**Submissions will be treated as solution code instead of an answer - setting to "false" limits grading to one test case (default: true) */
    readonly submitSolver: boolean
    /**Submissions when {@link ContestConfiguration.submitSolver} is "false" will be delayed by a number of seconds (usually to discourage spamming) (default: 10) */
    readonly directSubmissionDelay: number
    /**Programming languages accepted for submissions (case sensitive, only if "submitSolver" is "true") (default: Java8, Java11, Java17, Java21, C11, C++11, C++17, C++20, Python3.12.3) */
    readonly acceptedSolverLanguages: string[]
    /**Maximum character length of uploaded submissions (default: 10240) */
    readonly maxSubmissionSize: number
};
/**
 * Global configuration, loaded from `config.json` in the config folder.
 * If any field is empty in `config.json`, it is filled in with the default.
 * {@link GlobalConfiguration}
 */
const config: GlobalConfiguration = {
    hostname: fileConfig.hostname ?? 'wwppc.tech',
    emailAddress: fileConfig.emailAddress ?? 'no-reply@wwppc.tech',
    port: process.env.PORT ?? fileConfig.port ?? 8000,
    sessionExpireTime: fileConfig.sessionExpireTime ?? 12,
    rsaKeyRotateInterval: fileConfig.rsaKeyRotateInterval ?? 24,
    recoveryEmailTimeout: fileConfig.recoveryEmailTimeout ?? 10,
    maxSignupPerMinute: fileConfig.maxSignupPerMinute ?? 1,
    defaultProfileImg: fileConfig.defaultProfileImg ?? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARxSURBVHhe7dy9SiRZAAXgdkeMzHwHAw0EQzNfREQwEVEMDAQfrp/DSBNB0MA2M3C3Zy1mZZ3rtP1TXXXP9yXFNavmnu5zEgcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAPG1vb29tbTUHiLKzs/P09DQajTY3N5s/QYjx7b+7u/v7X+MM+B0gyN7e3s3Nzfvtf3d/fy8DRBj3/sfHx+bif/D8/CwDVO699zdX/hN7gJp97P0l9gB1+tz7S+wBalPq/SX2APX4uveX2APUYJLeX2IP0G+T9/4Se4C++m7vL7EH6J/pen+JPUCfzNL7S+wB+mH23l9iD9B18+r9JfYA3TXf3l9iD9BFi+j9JfYA3bK43l9iD9AVi+79JfYAy9dO7y+xB1imNnt/iT3AcrTf+0vsAdq2rN5fYg/QnuX2/hJ7gDZ0ofeX2AMsVnd6f4k9wKJ0rfeX2APMXzd7f4k9wDx1ufeX2APMR/d7f4k9wKz60vtL7AGm16/eX2IPMI0+9v4Se4Dv6W/vL7EHmFTfe3+JPcCf1dH7S+wBvlJT7y+xB/i9+np/iT3A/9Xa+0vsAf5Td+8vsQf4KaH3l9gD6XJ6f4k9kCut95eE74GV5hlmfX399vZ2Y2OjOWcb/w7s7u4+PDw05yQ/mmeY19fXtbW1/f39lZXQr4Bfxj8CV1dXw+GwOZPj9PT0vQbEent7u7y8bD4OAh0fHzd3Ic/Ly8vR0dHq6mrzWZDp4OBg/EXYXIoYo9Ho7OzM7een6+vrqAyMX/bk5KR5eRjL2QN6P7+XsAf0fr5S9x7Q+/mzWveA3s+k6tsDej/fU9Me0PuZRh17QO9nen3fA3o/s+rvHtD7mY8+7gG9n3nq1x7Q+5m/vuwBvZ9F6f4e0PtZrC7vAb2fNnRzD+j9tKdre0Dvp23d2QN6P8vRhT2g97NMy90Dej/Lt6w9oPfTFe3vAb2fbmlzD+j9dFE7e0Dvp7sWvQf0frpucXtA76cfFrEH9H76ZL57QO+nf+a1B/R++mr2PaD302+z7AG9nxpMtwf0furx3T2g91ObyfeA3k+dJtkDej81+3oP6P3Ur7QH9H5SfN4Dej9ZPu4BvZ9E73tA7yfXeA/o/QAAAAAAAAAAAAAAAAAAAAAAAAAAsVaaJ4PB4eHh+fl5c6jXxcXFcDhsDvDLOADNPyyv2vg1mxdmMPireUIkASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBNAIgmAEQTAKIJANEEgGgCQDQBIJoAEE0AiCYARBMAogkA0QSAaAJANAEgmgAQTQCIJgBEEwCiCQDRBIBoAkA0ASCaABBsMPgHSaq6IM8BzA4AAAAASUVORK5CYII=',
    maxProfileImgSize: fileConfig.maxProfileImgSize ?? 65535,
    dbCacheTime: fileConfig.dbCacheTime ?? 60000,
    dbProblemCacheTime: fileConfig.dbProblemCacheTime ?? 600000,
    graderTimeout: fileConfig.graderTimeout ?? 180000,
    // single "line" mapping and validating (validation is crashing if invalid or adding defaults)
    contests: fileContests !== null ? Object.entries(fileContests).reduce((p: Record<string, ContestConfiguration>, [cId, cVal]: [string, any]) => {
        p[cId] = {
            graders: cVal.graders ?? true,
            rounds: cVal.rounds ?? true,
            restrictiveRounds: cVal.restrictiveRounds ?? false,
            scoreFreezeTime: cVal.scoreFreezeTime ?? 60,
            withholdResults: cVal.withholdResults ?? false,
            submitSolver: cVal.submitSolver ?? true,
            directSubmissionDelay: cVal.directSubmissionDelay ?? 5000,
            acceptedSolverLanguages: cVal.acceptedSolverLanguages ?? [
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
            maxSubmissionSize: cVal.maxSubmissionSize ?? 10240
        };
        return p;
    }, {}) : {},
    maxSubmissionHistory: fileConfig.maxSubmissionHistory ?? 24,
    logEmailActivity: fileConfig.logEmailActivity ?? true,
    debugMode: process.argv.includes('debug_mode') ?? process.env.DEBUG_MODE ?? fileConfig.debugMode ?? false,
    path: process.env.CONFIG_PATH,
    logPath: path.resolve(__dirname, process.env.LOG_PATH ?? fileConfig.logPath ?? '../logs/'),
    emailTemplatePath: path.resolve(__dirname, process.env.EMAIL_TEMPLATE_PATH ?? fileConfig.emailTemplatePath ?? '../email-templates'),
};
// when writing back to file, prevent environment variables and argument overrides also overwriting file configurations
const config2: any = structuredClone(config);
config2.port = fileConfig.port ?? 8000;
config2.debugMode = fileConfig.debugMode ?? false;
config2.superSecretSecret = fileConfig.superSecretSecret;
delete config2.contests;
delete config2.path;
config2.logPath = fileConfig.logPath;
config2.emailTemplatePath = fileConfig.emailTemplatePath;
try {
    fs.writeFileSync(configPath, JSON.stringify(config2, null, 4));
} catch { }

export default config;
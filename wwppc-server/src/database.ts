import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { Client } from 'pg';
const salt = 5;
import { subtle } from 'crypto';
import Cryptr from 'cryptr';
import Logger from './log';
import uuid from 'uuid';

/**
 * PostgreSQL database connection for handling accounts, including submissions.
 */
export class Database {
    #ready = false;
    /**
     * Resolves when database is connected.
     */
    readonly connectPromise: Promise<any>;
    readonly #db: Client;
    readonly #rsaKeys = subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, false, ['encrypt', 'decrypt']);
    #publicKey;
    readonly logger: Logger;

    /**
     * @param {string} uri Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)
     * @param {Logger} logger Logging instance
     */
    constructor(uri: string, logger: Logger) {
        if (process.env.CONFIG_PATH == undefined) throw new Error('for some reason CONFIG_PATH is undefined and it shouldn\'t be');
        this.logger = logger;
        this.connectPromise = new Promise(() => undefined);
        const setPublicKey = async () => this.#publicKey = await subtle.exportKey('jwk', (await this.#rsaKeys).publicKey);
        const certPath = path.resolve(process.env.CONFIG_PATH, 'db-cert.pem');
        this.#db = new Client({
            connectionString: uri,
            application_name: 'WWPPC Server',
            ssl: process.env.DATABASE_CERT != undefined ? ({ ca: process.env.DATABASE_CERT }) : (fs.existsSync(certPath) ? { ca: fs.readFileSync(certPath) } : { rejectUnauthorized: false })
        });
        this.connectPromise = Promise.all([
            this.#db.connect().then(() => {
                this.#ready = true
            }, (err) => {
                logger.fatal('Could not connect to database:');
                logger.fatal(err);
                logger.fatal('Host: ' + this.#db.host);
                logger.destroy();
                process.exit();
            }),
            setPublicKey()
        ]);
        this.connectPromise.then(() => {
            logger.info('Database connected');
            logger.debug('Connected to: ' + this.#db.host);
        });
        this.#db.on('error', (err) => {
            logger.fatal('Database error:');
            logger.fatal(err.message);
            if (err.stack) logger.fatal(err.stack);
            logger.destroy();
            process.exit();
        });
    }

    /**
     * @type {webcrypto.JsonWebKey}
     * RA-OAEP public key.
     */
    get publicKey() { return this.#publicKey; }
    /**
     * Decrypt a message using the RSA-OAEP private key.
     * @param {ArrayBuffer | string} buf Encrypted ArrayBuffer representing a string or an unencrypted string (pass-through if encryption is not possible)
     * @returns {string} Decrypted string
     */
    async RSAdecode(buf: Buffer | string) {
        try {
            return buf instanceof Buffer ? await new TextDecoder().decode(await subtle.decrypt({ name: "RSA-OAEP" }, (await this.#rsaKeys).privateKey, buf).catch(() => new Uint8Array([30]))) : buf;
        } catch (err) {
            this.logger.error('' + err);
            return buf;
        }
    }

    /**
     * Disconnect from the PostgreSQL database.
     * @returns {Promise} A `Promise` representing when the database has disconnected.
     */
    disconnect() {
        return this.#db.end().then(() => this.#ready = false);
    }
    /**
     * @type {boolean}
     */
    get ready(): boolean { return this.#ready; }

    /**
     * Validate a pair of credentials. To be valid, a username must be an alphanumeric string of length <= 16, and the password must be a string of length <= 1024.
     * @param {string} username Username
     * @param {string} password Password
     * @returns {boolean} Validity
     */
    validate(username: string, password: string): boolean {
        return username.trim().length <= 16 && password.trim().length <= 1024 && /^[a-zA-Z0-9]+$/.test(username);
    }
    /**
     * Create an account. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid pasword
     * @returns {AccountOpResult} Creation status: 0 - success | 1 - already exists | 4 - database error
     */
    async createAccount(username: string, password: string, email: string): Promise<AccountOpResult> {
        try {
            const encryptedPassword = await bcrypt.hash(password, salt);
            const data = await this.#db.query('SELECT username FROM users WHERE username=$1;', [username]);
            if (data.rowCount != null && data.rowCount > 0) return AccountOpResult.ALREADY_EXISTS;
            else await this.#db.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, encryptedPassword, email]);
            this.logger.info(`[Database] Created account "${username}"`, true);
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        }
    }
    /**
     * Check credentials against an existing account with the specified username. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid pasword
     * @returns {AccountOpResult} Check status: 0 - success | 2 - does not exist | 3 - incorrect | 4 - database error
     */
    async checkAccount(username: string, password: string): Promise<AccountOpResult> {
        try {
            const data = await this.#db.query('SELECT password FROM users WHERE username=$1', [username]);
            if (data.rowCount != null && data.rowCount > 0) return (await bcrypt.compare(password, data.rows[0].password)) ? AccountOpResult.SUCCESS : AccountOpResult.INCORRECT_CREDENTIALS;
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        }
    }
    /**
     * Delete an account. Allows deletion by users and admins with permission level `AdminPerms.MANAGE_ACCOUNTS` if `adminUsername` is given. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid password of user, or admin password if `adminUsername` is given
     * @param {string} adminUsername Valid username of administrator
     * @returns {AccountOpResult} Deletion status: 0 - success | 2 - does not exist | 3 - incorrect or no permission | 4 - database error
     */
    async deleteAccount(username: string, password: string, adminUsername?: string): Promise<AccountOpResult> {
        try {
            if (adminUsername != undefined) {
                this.logger.warn(`[Database] "${adminUsername}" is trying to delete account "${username}"!`);
                const res = this.checkAccount(adminUsername, password);
                if ((await res) != AccountOpResult.SUCCESS) return await res;
                if (!await this.hasPerms(adminUsername, AdminPerms.MANAGE_ACCOUNTS)) return AccountOpResult.INCORRECT_CREDENTIALS; // no perms = incorrect creds
                const data = await this.#db.query('SELECT username FROM users WHERE username=$1', [username]); // still have to check account exists
                if (data.rowCount == null || data.rowCount == 0) return AccountOpResult.NOT_EXISTS;
                await this.#db.query('DELETE FROM users WHERE username=$1', [username]);
                this.logger.info(`[Database] Deleted account "${username}" (by "${adminUsername}")`, true);
                return AccountOpResult.SUCCESS;
            } else {
                const res = this.checkAccount(username, password);
                if ((await res) != AccountOpResult.SUCCESS) return await res;
                await this.#db.query('DELETE FROM users WHERE username=$1', [username]);
                this.logger.info(`[Database] Deleted account ${username}`, true);
                return AccountOpResult.SUCCESS;
            }
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        }
    }

    /**
     * Check if an administrator has a certain permission.
     * @param username Valid administrator username
     * @param flag Permission flag to check against
     * @returns {boolean} If the administrator has the permission. Also false if the user is not an administrator.
     */
    async hasPerms(username: string, flag: AdminPerms): Promise<boolean> {
        try {
            const data = await this.#db.query('SELECT permissions FROM admins WHERE username=$1', [username]);
            return data.rowCount != null && data.rowCount > 0 && (data.rows[0].permissions & flag) != 0;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return false;
        }
    }

    /**
     * Filter and get a list of round data from the rounds database according to a criteria
     * @param {ReadProblemsCriteria} c Filter criteria. Leaving one undefined removes the filter
     * @returns {Array<Problem>} Array of round data matching the filter criteria. If the query failed the returned array is empty
     */
    async readRounds(c: ReadRoundsCriteria): Promise<Array<Round>> {
        try {
            const data = await this.#db.query('SELECT * FROM rounds WHERE division=$1 AND number=$2', [c.division ?? '*', c.round ?? '*']);
            return data.rows.map((round) => ({
                division: round.division,
                round: round.number,
                problems: round.problems,
                startTime: round.startTime,
                endTime: round.endTime
            }));
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return [];
        }
    }
    /**
     * Write a round to the rounds database
     * @param {Round} round Round to write
     * @returns {boolean} If the write was successful
     */
    async writeRound(round: Round): Promise<boolean> {
        try {
            const exists = await this.#db.query('SELECT FROM rounds WHERE division=$1 AND number=$2', [round.division, round.round]);
            if ((exists.rowCount ?? 0) > 0) {
                await this.#db.query('UPDATE rounds SET problems=$3, startTime=$4, endTime=$5 WHERE division=$1 AND number=$2', [round.division, round.round, round.problems, round.startTime, round.endTime]);
            } else {
                await this.#db.query('INSERT INTO rounds (division, number, problems, startTime, endTime) VALUES ($1, $2, $3, $4, $5)', [round.division, round.round, round.problems, round.startTime, round.endTime]);
            }
            return true;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return false;
        }
    }

    /**
     * Filter and get a list of problems from the problems database according to a criteria
     * @param {ReadProblemsCriteria} c Filter criteria. Leaving one undefined removes the filter
     * @returns {Array<Problem>} Array of problems matching the filter criteria. If the query failed the returned array is empty
     */
    async readProblems(c: ReadProblemsCriteria): Promise<Array<Problem>> {
        try {
            const problemIdList: string[] = [];
            if (c.id != undefined && isUUID(c.id)) problemIdList.push(c.id);
            if (c.round != undefined) {
                // filter by grabbing ids from round lists (code unreadable??)
                // random nullish operators and optional chaining are because typescript kinda dumb
                const rounds: Round[] = await this.readRounds(c.round);
                if (c.round.number != undefined) problemIdList.push(...rounds.map((r) => r.problems[c.round?.number ?? NaN]).filter(v => v != undefined));
                else problemIdList.push(...rounds.flatMap((r) => r.problems));
            }
            const problemIdRegex = problemIdList.reduce((p, c) => p + `|(${c})`, '').substring(1) || '*';
            const data = await this.#db.query('SELECT * FROM problems WHERE id~\'$1\' AND name=$2 AND author=$3', [problemIdRegex, c.name ?? '*', c.author ?? '*']);
            return data.rows.filter((v) => c.constraints == undefined || c.constraints(v)).map((problem) => ({
                id: problem.id,
                name: problem.name,
                author: problem.author,
                content: problem.content,
                cases: problem.cases,
                constraints: problem.constraints
            }));
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return [];
        }
    }
    /**
     * Write a problem to the problems database
     * @param {Problem} problem Problem to write
     * @returns {boolean} If the write was successful
     */
    async writeProblem(problem: Problem): Promise<boolean> {
        try {
            const exists = await this.#db.query('SELECT id FROM problems WHERE id=$1', [problem.id]);
            if ((exists.rowCount ?? 0) > 0) {
                await this.#db.query('UPDATE problems SET name=$2, content=$3, author=$4, cases=$5, constraints=$6 WHERE id=$1', [problem.id, problem.name, problem.content, problem.author, problem.cases, problem.constraints]);
            } else {
                await this.#db.query('INSERT INTO problems (id, name, content, author, cases, constraints) VALUES ($1, $2, $3, $4, $5, $6)', [problem.id, problem.name, problem.content, problem.author, problem.cases, problem.constraints]);
            }
            return true;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return false;
        }
    }

    /**
     * Filter and get a list of submissions from the submissions database according to a criteria.
     * @param {ReadSubmissionsCriteria} c Filter criteria. Leaving one undefined removes the filter
     * @returns {Array<Submission> | null} Array of submissions matching the filter criteria. If the query failed the returned value is `null`
     */
    async readSubmissions(c: ReadSubmissionsCriteria): Promise<Array<Submission> | null> {
        try {
            const problemIdList: string[] = [];
            if (c.id != undefined && isUUID(c.id)) problemIdList.push(c.id);
            if (c.round != undefined) {
                // filter by grabbing ids from round lists (code unreadable??)
                // random nullish operators and optional chaining are because typescript kinda dumb
                const rounds: Round[] = await this.readRounds(c.round);
                if (c.round.number != undefined) problemIdList.push(...rounds.map((r) => r.problems[c.round?.number ?? NaN]).filter(v => v != undefined));
                else problemIdList.push(...rounds.flatMap((r) => r.problems));
            }
            const problemIdRegex = problemIdList.reduce((p, c) => p + `|(${c})`, '').substring(1) || '*';
            const data = await this.#db.query('SELECT * FROM submissions WHERE username=$1 AND id~\'$2\'', [c.username ?? '*', problemIdRegex]);
            return data.rows.map((submission) => ({
                username: submission.username,
                problemId: submission.id,
                time: submission.time,
                file: submission.file,
                lang: submission.language,
                scores: submission.scores
            }));
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return null;
        }
    }
    /**
     * Write a submission to the submissions database
     * @param {Submission} submission Submission to write
     * @returns {boolean} If the write was successful
     */
    async writeSubmission(submission: Submission): Promise<boolean> {
        try {
            const exists = await this.#db.query('SELECT id FROM submissions WHERE username=$1 AND id=$2', [submission.username, submission.problemId]);
            if ((exists.rowCount ?? 0) > 0) {
                await this.#db.query('UPDATE submissions SET file=$3, language=$4, scores=$5, time=$6 WHERE username=$1 AND id=$2', [submission.username, submission.problemId, submission.file, submission.lang, submission.scores, Date.now()]);
            } else {
                await this.#db.query('INSERT INTO submissions (username, id, file, language, scores, time) VALUES ($1, $2, $3, $4, $5, $6)', [submission.username, submission.problemId, submission.file, submission.lang, submission.scores, Date.now()]);
            }
            return true;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return false;
        }
    }
}
export default Database;

type UUID = string;

function isUUID(id: string): id is UUID {
    return uuid.validate(id);
}

/**The result of an operation that requires authentication performed by the database */
export enum AccountOpResult {
    SUCCESS = 0,
    ALREADY_EXISTS = 1,
    NOT_EXISTS = 2,
    INCORRECT_CREDENTIALS = 3,
    ERROR = 4
}

/**Admin permission level bit flags */
export enum AdminPerms {
    NO = 0,
    VIEW_PROBLEMS = 1 << 0,
    MANAGE_PROBLEMS = 1 << 1,
    VIEW_ACCOUNTS = 1 << 2,
    MANAGE_ACCOUNTS = 1 << 3,
    VIEW_CONTESTS = 1 << 4,
    MANAGE_CONTESTS = 1 << 5,
    MANAGE_ADMINS = 1 << 31
}

/**Criteria to filter by. Leaving a value undefined removes the filter */
type ReadRoundsCriteria = {
    /**Zero-indexed division number */
    division?: number
    /**Zero-indexed round within the division */
    round?: number
}
/**Criteria to filter by. Leaving a value undefined removes the filter */
type ProblemRoundCriteria = {
    /**Zero-indexed division number */
    division?: number
    /**Zero-indexed round within the division */
    round?: number
    /**Zero-indexed problem number within the round */
    number?: number
}
/**Criteria to filter by. Leaving a value undefined removes the filter */
type ReadProblemsCriteria = {
    /**UUID of problem */
    id?: UUID
    /**Display name of problem */
    name?: string
    /**Author username of problem */
    author?: string
    /**Constraints validator for problem */
    constraints?: (c: ProblemConstraints) => boolean
    /**Round-based filter for problems */
    round?: ProblemRoundCriteria
}
/**Criteria to filter by. Leaving a value undefined removes the filter */
type ReadSubmissionsCriteria = {
    /**UUID of problem */
    id?: UUID
    /**Username of submitter */
    username?: string
    /**Round-based filter for problems */
    round?: ProblemRoundCriteria
}

/**Descriptor for an account */
export type AccountData = {
    /**Username */
    username: string
}

/**Descriptor for a single round */
export type Round = {
    /**Zero-indexed division number */
    division: number
    /**Zero-indexed round number in division */
    round: number
    /**List of problem UUIDs within the round */
    problems: UUID[]
    /**Time of round start, UTC */
    startTime: number
    /**Time of round end, UTC */
    endTime: number
}
/**Descriptor for a single problem */
export type Problem = {
    /**UUID */
    id: UUID
    /**Display name */
    name: string
    /**Author username */
    author: string
    /**HTML/KaTeX content of problem statement */
    content: string
    /**List of test cases */
    cases: TestCase[]
    /**Runtime constraints */
    constraints: { time: number, memory: number }
}
/**Descriptor for the constraints of a single problem */
export type ProblemConstraints = {
    /**Time limit per test case in millseconds */
    time: number
    /**Memory limit per test case in megabytes */
    memory: number
}
/**Descriptor for a single test case */
export type TestCase = {
    /**Input string */
    input: string
    /**Correct output string */
    output: string
}
/**Descriptor for a single submission */
export type Submission = {
    /**Username of submitter */
    username: string
    /**UUID of problem submitted to */
    problemId: UUID
    /**Time of submission, UTC */
    time: number
    /**Contents of the submission file */
    file: string
    /**Submission language */
    lang: string
    /**Resulting scores of the submission */
    scores: Score[]
}
/**Descriptor for the score of a single test case */
export type Score = {
    /**Pass/fail status */
    state: ScoreState
    /**Time used in milliseconds */
    time: number
    /**Memory used in megabytes */
    memory: number
}
export enum ScoreState {
    CORRECT = 1,
    INCORRECT = 2,
    TIME_LIM_EXCEEDED = 3,
    MEM_LIM_EXCEEDED = 4,
    RUNTIME_ERROR = 5
}
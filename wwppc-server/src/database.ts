import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { Client } from 'pg';
const salt = 5;
import { subtle } from 'crypto';
import Cryptr from 'cryptr';
import Logger from './log';

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
    readonly #cryptr: Cryptr;
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
    constructor(uri: string, key: string, logger: Logger) {
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
        this.#cryptr = new Cryptr(key);
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
            const encryptedUsername = this.#cryptr.encrypt(username);
            const encryptedPassword = await bcrypt.hash(password, salt);
            const encryptedEmail = this.#cryptr.encrypt(email);
            const data = await this.#db.query('SELECT username FROM users WHERE username=$1;', [username]);
            if (data.rowCount != null && data.rowCount > 0) return AccountOpResult.ALREADY_EXISTS;
            else await this.#db.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3);', [encryptedUsername, encryptedPassword, encryptedEmail]);
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
            const encryptedUsername = this.#cryptr.encrypt(username);
            const data = await this.#db.query('SELECT password FROM users WHERE username=$1;', [encryptedUsername]);
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
                const encryptedUsername = this.#cryptr.encrypt(username); // wow so fast
                if ((await res) != AccountOpResult.SUCCESS) return await res;
                if (!await this.hasPerms(adminUsername, AdminPerms.MANAGE_ACCOUNTS)) return AccountOpResult.INCORRECT_CREDENTIALS; // no perms = incorrect creds
                const data = await this.#db.query('SELECT username FROM users WHERE username=$1;', [encryptedUsername]); // still have to check account exists
                if (data.rowCount == null || data.rowCount == 0) return AccountOpResult.NOT_EXISTS;
                await this.#db.query('DELETE FROM users WHERE username=$1;', [encryptedUsername]);
                this.logger.info(`[Database] Deleted account "${username}" (by "${adminUsername}")`, true);
                return AccountOpResult.SUCCESS;
            } else {
                const res = this.checkAccount(username, password);
                const encryptedUsername = this.#cryptr.encrypt(username);
                if ((await res) != AccountOpResult.SUCCESS) return await res;
                await this.#db.query('DELETE FROM users WHERE username=$1;', [encryptedUsername]);
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
            const encryptedUsername = this.#cryptr.encrypt(username);
            const data = await this.#db.query('SELECT permissions FROM admins WHERE username=$1', [encryptedUsername]);
            return data.rowCount != null && data.rowCount > 0 && (data.rows[0].permissions & flag) != 0;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return false;
        }
    }

    /**
     * Filter and get a list of submissions from the submissions database according to a criteria.
     * @param {{username: string, problem: string}} criteria Filter criteria. Leaving one undefined removes the filter
     * @param {string} criteria.username Filter by username, exact match
     * @param {string} criteria.problemId Filter by problem id, exact match. Problem ids are in the format `D-R-NN`, with D being division number, R being round number and NN being problem number, 0-indexed
     * @param {number} criteria.problemDiv Filter by division, exact match. Zero-indexed
     * @param {number} criteria.problemRound Filter by round, exact match. Zero-indexed
     * @param {number} criteria.problemNum Filter by number in round, exact match. Zero-indexed
     * @returns {Array<Submission> | null} Array of submissions matching the filter criteria. If the query failed the returned value is `null`
     */
    async readSubmissions(criteria = { username: '*', problemId: '*', problemDiv: '*', problemRound: '*', problemNum: '*' }): Promise<Array<Submission> | null> {
        try {
            if (criteria.problemId != '*') {
                let split = criteria.problemId.split('-');
                if (split.length == 3) {
                    criteria.problemDiv = split[0];
                    criteria.problemRound = split[1];
                    criteria.problemNum = split[2];
                }
            }
            const data = await this.#db.query('SELECT * FROM submissions WHERE username=$1 AND division=$2 AND round=$3 AND problem=$4');
            const data2: Submission[] = [];
            for (const submission of data.rows) {
                data2.push({
                    username: submission.username,
                    division: submission.division,
                    round: submission.round,
                    number: submission.problem,
                    time: submission.time,
                    file: submission.file,
                    lang: submission.language,
                    scores: JSON.parse(submission.scores)
                });
            }
            return data2;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return null;
        }
    }
    /**
     * Write a submission to the submissions database.
     * @param {Submission} submission Submission to write
     */
    async writeSubmission(submission: Submission): Promise<boolean> {
        try {
            await this.#db.query('INSERT INTO submissions (username, division, round, problem, file, language, time) VALUES ($1, $2, $3, $4, $5, $6, $7)', [submission.username, submission.division, submission.round, submission.number, submission.file, submission.lang, Date.now()]);
            return true;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return false;
        }
    }

    /**
     * Filter and get a list of problems from the problems database according to a criteria
     * @param {{username: string, problem: string}} criteria Filter criteria. Leaving one undefined removes the filter
     * @param {string} criteria.id Filter by problem id, exact match. Problem ids are in the format `D-R-NN`, with D being division number, R being round number and NN being problem number, 0-indexed
     * @param {number} criteria.division Filter by division, exact match. Zero-indexed
     * @param {number} criteria.round Filter by round, exact match. Zero-indexed
     * @param {number} criteria.number Filter by number in round, exact match. Zero-indexed
     * @param {number} criteria.name Filter by problem name
     * @param {number} criteria.author Filter by author username
     * @returns {Array<Problem>} Array of problems matching the filter criteria. If the query failed the returned array is empty
     */
    async readProblems(criteria = { id: '*', division: '*', round: '*', number: '*', name: '*', author: '*', constraints: (constraints: ProblemConstraints) => { return true } }): Promise<Array<Problem>> {
        try {
            if (criteria.id != '*') {
                let split = criteria.id.split('-');
                if (split.length == 3) {
                    criteria.division = split[0];
                    criteria.round = split[1];
                    criteria.number = split[2];
                }
            }
            const data = await this.#db.query('SELECT * FROM problems WHERE division=$1 AND round=$2 AND number=$3 AND name=$4 AND author=$5;', [criteria.division, criteria.round, criteria.number, criteria.name, criteria.author]);
            const data2: Problem[] = [];
            for (const problem of data.rows) {
                const constraints = JSON.parse(problem.constraints)
                if (criteria.constraints(constraints)) {
                    data2.push({
                        division: problem.division,
                        round: problem.round,
                        number: problem.number,
                        name: problem.name,
                        author: problem.author,
                        content: problem.content,
                        cases: JSON.parse(problem.cases),
                        constraints: constraints
                    });
                }
            }
            return data2;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return [];
        }
    }

    /**
     * Write a problem to the problems database.
     * @param {Problem} problem Problem to write
     */
    async writeProblem(problem: Problem): Promise<boolean> {
        try {
            await this.#db.query('INSERT INTO problems (division, round, problem, name, content, cases, constraints, author) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [problem.division, problem.round, problem.number, problem.name, problem.content, JSON.stringify(problem.cases), JSON.stringify(problem.constraints), problem.author]);
            return true;
        } catch (err) {
            this.logger.error('Database error:');
            this.logger.error('' + err);
            return false;
        }
    }
}
export default Database;

export enum AccountOpResult {
    SUCCESS = 0,
    ALREADY_EXISTS = 1,
    NOT_EXISTS = 2,
    INCORRECT_CREDENTIALS = 3,
    ERROR = 4
}

/**
 * Descriptor for an account
 * @property {string} username Username
 */
export interface AccountData {
    username: string
}
/**
 * Descriptor for a single problem
 * @property {number} division Division number, zero-indexed
 * @property {number} round Round number, zero-indexed
 * @property {number} number Problem number, zero-indexed
 * @property {string} name Name of problem
 * @property {string} author Author of problem
 * @property {string} content HTML content of problem statement (problem body)
 * @property {TestCase[]} cases Test case list
 * @property {{ time: number, memory: number }} constraints Problem constraints
 */
export interface Problem {
    division: number
    round: number
    number: number
    name: string
    author: string
    content: string
    cases: TestCase[]
    constraints: { time: number, memory: number }
}
/**
 * Descriptor for the constraints of a problem
 * @property {number} time Time limit per test case in milliseconds
 * @property {number} memory Memory limit per test case in megabytes
 */
export interface ProblemConstraints {
    time: number
    memory: number
}
/**
 * Descriptor for a single test case
 * @property {string} input Input test data
 * @property {string} output Correct answer
 */
export interface TestCase {
    input: string
    output: string
}
/**
 * Descriptor for a single submission
 * @property {string} username Username of submitter
 * @property {number} division Division number, zero-indexed
 * @property {number} round Round number, zero-indexed
 * @property {number} number Problem number, zero-indexed
 * @property {number} time Time at submission
 * @property {string} file Copy of the file submitted
 * @property {string} lang Submitted language
 * @property {Score[]} scores Resulting scores of submission
 */
export interface Submission {
    username: string
    division: number
    round: number
    number: number
    time: number
    file: string
    lang: string
    scores: Score[]
}
/**
 * Descriptor for a score on a single test case
 * @property {number} state 0 - Pass | 1 - Wrong answer | 2 - Time Limit Exceeded | 3 - Error or Memory Exceeded
 * @property {number} time Time for test case in milliseconds
 * @property {number} memory Memory usage in megabytes
 */
export interface Score {
    state: ScoreState
    time: number
    memory: number
}

export enum ScoreState {
    CORRECT = 1,
    INCORRECT = 2,
    TIME_LIM_EXCEEDED = 3,
    MEM_LIM_EXCEEDED = 4,
    RUNTIME_ERROR = 5
}

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
// Copyright (C) 2024 Sampleprovider(sp)

import bcrypt from 'bcrypt';
import { Client } from 'pg';
const salt = 5;
import { subtle, webcrypto } from 'crypto';
import Logger from './log';

/**
 * PostgreSQL database connection for handling accounts, including submissions.
 */
export class Database {
    #ready = false;
    #connectPromise;
    #db;
    #keys = subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, false, ['encrypt', 'decrypt']);
    #publicKey;

    /**
     * @param {string} uri Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)
     * @param {Logger} logger Logging instance
     */
    constructor(uri: string, logger: Logger) {
        this.#connectPromise = new Promise((r) => r(undefined));
        this.#db = new Client({
            connectionString: uri,
            application_name: 'WWPPC Server'
        });
        this.#connectPromise = this.#db.connect().catch((err) => {
            logger.fatal('Could not connect to database:');
            logger.fatal(err);
            logger.destroy();
            process.exit();
        }).then(async () => {
            this.#publicKey = await subtle.exportKey('jwk', (await this.#keys).publicKey);
        }).then(this.#ready = true);
        this.#connectPromise.then(() => {
            logger.info('Database connected');
            // database keepalive
            let keepAlive = setInterval(() => {
                this.#db.query('BEGIN; END');
            }, 60000);
            this.#db.on('end', () => {
                logger.info('Database disconnected');
                clearInterval(keepAlive);
            });
        });
        this.#db.on('error', (err) => {
            logger.fatal('Database error:');
            logger.fatal(err);
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
            return buf instanceof Buffer ? await new TextDecoder().decode(await subtle.decrypt({ name: "RSA-OAEP" }, (await this.#keys).privateKey, buf).catch(() => new Uint8Array([30]))) : buf;
        } catch (err) {
            console.error(err);
            return buf;
        }
    }

    /**
     * Disconnect from the PostgreSQL database.
     * @returns {Promise} A `Promise` representing when the database has disconnected.
     */
    disconnect() {
        return this.#db.end().then(this.#ready = false);
    }
    /**
     * @type {boolean}
     */
    get ready() { return this.#ready; }
    /**
     * @type {Promise<undefined>}
     * Resolves when database is connected.
     */
    get connectPromise() { return this.#connectPromise; }

    /**
     * Validate a pair of credentials. To be valid, a username must be an alphanumeric string of length <= 16, and the password must be a string of length <= 1024.
     * @param {string} username Username
     * @param {string} password Password
     * @returns {boolean} Validity
     */
    validate(username: string, password: string): boolean {
        return username.length <= 16 && password.length <= 1024 && /^[a-zA-Z0-9]+$/.test(username);
    }
    /**
     * Create an account. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid pasword
     * @returns {0 | 1 | 4} Creation status: 0 - success | 1 - already exists | 4 - database error
     */
    async createAccount(username: string, password: string): Promise<0 | 1 | 4> {
        try {
            const encrypted = await bcrypt.hash(password, salt);
            const data = await this.#db.query('SELECT username FROM users WHERE username=$1;', [username]);
            if (data.rowCount > 0) return 1;
            else await this.#db.query('INSERT INTO users (username, password) VALUES ($1, $2);', [username, encrypted]);
            return 0;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
            return 4;
        }
    }
    /**
     * Check credentials against an existing account with the specified username. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid pasword
     * @returns {0 | 2 | 3 | 4} Check status: 0 - success | 2 - does not exist | 3 - incorrect | 4 - database error
     */
    async checkAccount(username: string, password: string): Promise<0 | 2 | 3 | 4> {
        try {
            const data = await this.#db.query('SELECT password FROM users WHERE username=$1;', [username]);
            if (data.rowCount > 0) return (await bcrypt.compare(password, data.rows[0].password)) ? 0 : 3;
            return 2;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
            return 4;
        }
    }
    /**
     * Delete an account. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} adminpassword The admin password
     * @returns {0 | 2 | 3 | 4} Deletion status: 0 - success | 2 - does not exist | 3 - incorrect | 4 - database error
     */
    async deleteAccount(username: string, adminpassword: string): Promise<0 | 2 | 3 | 4> {
        try {
            return 3;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
            return 4;
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
            return null;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
            return null;
        }
    }
    /**
     * Write a submission to the submissions database.
     * @param {Submission} submission Submission to write
     */
    async writeSubmission(submission: Submission): Promise<boolean> {
        // username: varchar
        // probRound: smallint
        // probNum: smallint
        // file: text
        // lang: varchar
        // scores: json
        try {
            return false;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
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
    async readProblems(criteria = { id: '*', division: '*', round: '*', number: '*', name: '*', author: '*' }): Promise<Array<Problem>> {
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
            for (let problem of data.rows) {
                data2.push({
                    division: problem.division,
                    round: problem.round,
                    number: problem.number,
                    name: problem.name,
                    author: problem.author,
                    content: problem.content,
                    cases: JSON.parse(problem.cases),
                    constraints: problem.constraints
                });
            }
            return data2;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
            return [];
        }
    }
    /**
     * lol
     */
    async writeProblem(problem: Problem): Promise<boolean> {
        try {
            return false;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
            return false;
        }
    }
}
export default Database;

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
    state: number
    time: number
    memory: number
}
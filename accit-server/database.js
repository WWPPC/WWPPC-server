const config = require('./config.json');
const bcrypt = require('bcrypt');
const salt = 5;
const { Client } = require('pg');
const { subtle, webcrypto } = require('crypto').webcrypto;

/**
 * PostgreSQL database connection for handling accounts, including submissions.
 */
class ACCITDatabase {
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
     */
    constructor(uri) {
        this.#connectPromise = new Promise((r) => r());
        this.#db = new Client({
            connectionString: uri,
            application_name: 'ACC-IT Server'
        });
        this.#connectPromise = this.#db.connect().then(async () => this.#publicKey = await subtle.exportKey('jwk', (await this.#keys).publicKey)).then(this.#ready = true);
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
    async RSAdecode(buf) {
        return typeof buf == ArrayBuffer ? await new TextDecoder().decode(await subtle.decrypt({ name: "RSA-OAEP" }, (await keys).privateKey, buf).catch(new Uint8Array([30]))) : buf;
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
     * @returns {Promise<boolean>} Validity
     */
    async validate(username, password) {
        return typeof username == 'string' && typeof password == 'string' && username.length <= 16 && password.length <= 1024 && /^[a-zA-Z0-9]+$/.test(username);
    }
    /**
     * Create an account. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid pasword
     * @returns {Promise<0 | 1>} Creation status: 0 - success | 1 - already exists
     */
    async createAccount(username, password) {
        try {

        } catch (err) {
            console.error('Database error:');
            console.error(err);
        }
    }
    /**
     * Check credentials against an existing account with the specified username. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid pasword
     * @returns {Promise<0 | 2 | 3>} Check status: 0 - success | 2 - does not exist | 3 - incorrect
     */
    async checkAccount(username, password) {
        try {
            return 0;
        } catch (err) {
            console.error('Database error:');
            console.error(err);
        }
    }
    /**
     * Delete an account. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} adminpassword The admin password
     * @returns {Promise<0 | 2 | 3>} Deletion status: 0 - success | 2 - does not exist | 3 - incorrect
     */
    async deleteAccount(username, adminpassword) {
        try {

        } catch (err) {
            console.error('Database error:');
            console.error(err);
        }
    }

    /**
     * Filter and get a list of submissions from the submissions database according to a criteria.
     * @param {{username: string, problem: string}} criteria Filter criteria. Leaving one undefined removes the filter.
     * @param {string} criteria.username Filter by username, exact match.
     * @param {string} criteria.problemId Filter by problem id, exact match. Problem ids are in the format `R-NN`, with R being round number and NN being problem number, 0-indexed.
     * @param {number} criteria.problemRound Filter by round, exact match. Zero-indexed.
     * @param {number} criteria.problemNum Filter by number in round, exact match. Zero-indexed.
     * @returns {Promise<Array<Submission>>} Array of submissions matching the filter criteria.
     */
    async readSubmissions(criteria = { username: critUser, problemId: critProblem, problemRound: critProblemRound, problemNum: critPRoblemNum }) {
        try {

        } catch (err) {
            console.error('Database error:');
            console.error(err);
        }
    }
    /**
     * Write a submission to the submissions database.
     * @param {Submission} submission Submission to write
     */
    async writeSubmission(submission) {
        // username: varchar
        // probRound: smallint
        // probNum: smallint
        // file: text
        // lang: varchar
        // scores: json
        try {

        } catch (err) {
            console.error('Database error:');
            console.error(err);
        }
    }
}

class AccountData {
    constructor(username, submissions) {

    }
}

/**
 * A score for a single test case
 * @typedef {{state: number, time: number, memory: number}} Score
 * @param {number} state 0 - Pass | 1 - Time Limit Exceeded | 2 - Error or Memory Exceeded
 * @param {number} time Time for test case in milliseconds
 * @param {number} memory Memory usage in megabytes
 */

/**
 * An immutable representation of a past submission.
 */
class Submission {
    #username;
    #probRound;
    #probNum;
    #time;
    #file;
    #lang;
    #scores;
    /**
     * @param {string} username Username of submitter
     * @param {number} problemRound Problem round
     * @param {number} problemNum Problem number in round
     * @param {number} time Time of submission in milliseconds since the epoch
     * @param {string} file Submission file
     * @param {string} language Submission language
     * @param {Array<Score> | undefined} scores Scores for test cases (can be undefined if not scored yet)
     */
    constructor(username, problemRound, problemNum, time, file, language, scores) {
        this.#username = username;
        this.#probRound = problemRound;
        this.#probNum = problemNum;
        this.#time = time;
        this.#file = file;
        this.#lang = language;
        this.#scores = scores?.slice(0);
    }

    /**@type {string} Username of submitter */
    get username() { return this.#username; }
    /**@type {number} Problem round */
    get probRound() { return this.#probRound; }
    /**@type {number} Problem number in round */
    get probNum() { return this.#probNum; }
    /**@type {number} Time of submission in milliseconds since the epoch */
    get time() { return this.#time; }
    /**@type {string} Submission file */
    get file() { return this.#file; }
    /**@type {string} Submission language */
    get lang() { return this.#lang; }
    /**@type {Array<Score> | undefined} Scores for test cases (can be undefined if not scored yet) */
    get scores() { return this.#scores?.slice(0); }
}

/**
 * Test data for a single test case
 * @typedef {{input: string, output: string}} TestCase
 * @param {string} input Input data to test with
 * @param {string} output The correct answer the program should output (whitespace included!)
 */

/**
 * An immutable representation of a problem.
 */
class Problem {
    #round;
    #number;
    #name;
    #author;
    #content;
    #cases;
    /**
     * @param {number} round Round number
     * @param {number} number Problem number
     * @param {string} name Problem name
     * @param {string} author Author of problem
     * @param {string} content Problem statement, including sample test cases
     * @param {Array<TestCase>} cases Array of test cases
     */
    constructor(round, number, name, author, content, cases) {
        this.#round = round;
        this.#number = number;
        this.#name = name;
        this.#author = author;
        this.#content = content;
        this.#cases = cases.slice(0);
    }
    /**@type {number} Round number */
    get round() { return this.#round; }
    /**@type {number} Problem number */
    get number() { return this.#number; }
    /**@type {string} Problem name */
    get name() { return this.#name; }
    /**@type {string} Author of problem */
    get author() { return this.#author; }
    /**@type {string} Problem statement */
    get content() { return this.#content; }
    /**@type {Array<TestCase>} Array of test cases */
    get cases() { return this.#cases.slice(0); }
}

module.exports = ACCITDatabase;
module.exports.Database = ACCITDatabase;
module.exports.AccountData = AccountData;
module.exports.Submission = Submission;
module.exports.Problem = Problem;
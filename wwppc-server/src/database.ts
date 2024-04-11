import config from './config';
import Logger from './log';
import { Mailer } from './email';
import { Client } from 'pg';
import bcrypt from 'bcrypt';
import { subtle, webcrypto, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';
const salt = 5;

interface DatabaseConstructorParams {
    /**Valid PostgreSQL connection URI (postgresql://username:password@host:port/database) */
    uri: string
    /**AES-256 GCM 32-byte key (base64 string) */
    key: string | Buffer
    /**Optional SSL Certificate */
    sslCert?: string | Buffer
    /**Logging instance */
    logger: Logger
    /**Nodemailer wrapper instance */
    mailer: Mailer
}

/**
 * PostgreSQL database connection for handling accounts, including submissions.
 */
export class Database {
    /**
     * Resolves when the database is connected.
     */
    readonly connectPromise: Promise<any>;
    readonly #db: Client;
    readonly #dbKey: Buffer;
    readonly #rsaKeys = subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    }, false, ['encrypt', 'decrypt']);
    #publicKey: webcrypto.JsonWebKey | undefined;
    readonly logger: Logger;
    readonly mailer: Mailer;
    /**
     * @param params Parameters
     */
    constructor({ uri, key, sslCert, logger, mailer }: DatabaseConstructorParams) {
        const startTime = performance.now();
        this.logger = logger;
        this.mailer = mailer;
        this.connectPromise = new Promise(() => undefined);
        const setPublicKey = async () => this.#publicKey = await subtle.exportKey('jwk', (await this.#rsaKeys).publicKey);
        this.#dbKey = key instanceof Buffer ? key : Buffer.from(key, 'base64');
        this.#db = new Client({
            connectionString: uri,
            application_name: 'WWPPC Server',
            ssl: sslCert != undefined ? { ca: sslCert } : { rejectUnauthorized: false }
        });
        this.connectPromise = Promise.all([
            this.#db.connect().catch((err) => {
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
            if (config.debugMode) {
                logger.debug('Database connected to: ' + this.#db.host);
                logger.debug(`Database connection time: ${performance.now() - startTime}ms`);
            }
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
    async RSAdecrypt(buf: Buffer | string) {
        try {
            return buf instanceof Buffer ? await new TextDecoder().decode(await subtle.decrypt({ name: "RSA-OAEP" }, (await this.#rsaKeys).privateKey, buf).catch(() => new Uint8Array([30]))) : buf;
        } catch (err) {
            this.logger.error('' + err);
            return buf;
        }
    }

    /**
     * Symmetrically encrypt using AES-256 GCM and the database key.
     * @param {string} plaintext Plaintext
     * @returns {string} Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag (the plaintext if there was an error)
     */
    #RSAencryptSymmetric(plaintext: string): string {
        try {
            const initVector = randomBytes(12);
            const cipher = createCipheriv('aes-256-gcm', this.#dbKey, initVector);
            return `${cipher.update(plaintext, 'utf8', 'base64') + cipher.final('base64')}:${initVector.toString('base64')}:${cipher.getAuthTag().toString('base64')}`;
        } catch (err) {
            this.logger.error('' + err);
            return plaintext;
        }
    }
    /**
     * Symmetrically decrypt using AES-256 GCM and the database key.
     * @param {string} encrypted Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag
     * @returns {string} Plaintext (the encrypted text if there was an error)
     */
    #RSAdecryptSymmetric(encrypted: string): string {
        try {
            const text = encrypted.split(':');
            const decipher = createDecipheriv('aes-256-gcm', this.#dbKey, Buffer.from(text[1]));
            decipher.setAuthTag(Buffer.from(text[2], 'base64'));
            return decipher.update(text[0], 'base64', 'utf8') + decipher.final('utf8');
        } catch (err) {
            this.logger.error('' + err);
            return encrypted;
        }
    }

    /**
     * Disconnect from the PostgreSQL database.
     * @returns {Promise} A `Promise` representing when the database has disconnected.
     */
    async disconnect(): Promise<void> {
        await this.#db.end();
    }

    #userCache: Map<string, { data: AccountData, expiration: number }> = new Map();
    /**
     * Validate a pair of credentials. To be valid, a username must be an alphanumeric string of length <= 16, and the password must be a string of length <= 1024.
     * @param {string} username Username
     * @param {string} password Password
     * @returns {boolean} Validity
     */
    validate(username: string, password: string): boolean {
        return username.trim().length <= 16 && password.trim().length <= 1024 && /^[a-zA-Z0-9-_=+]+$/.test(username);
    }
    /**
     * Create an account. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid password
     * @param {AccountData} userData Initial user data
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.ALREADY_EXISTS | AccountOpResult.ERROR} Creation status
     */
    async createAccount(username: string, password: string, userData: { email: string, firstName: string, lastName: string, school: string, grade: number, experience: number, languages: string[] }): Promise<AccountOpResult.SUCCESS | AccountOpResult.ALREADY_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const encryptedPassword = await bcrypt.hash(password, salt);
            const data = await this.#db.query('SELECT username FROM users WHERE username=$1;', [username]);
            if (data.rowCount != null && data.rowCount > 0) return AccountOpResult.ALREADY_EXISTS;
            else await this.#db.query('INSERT INTO users (username, password, email, firstname, lastname, displayname, profileimg, biography, school, grade, experience, languages, registrations) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [
                username, encryptedPassword, userData.email, userData.firstName, userData.lastName, `${userData.firstName} ${userData.lastName}`, 'data:image/png;base64,', '', userData.school, userData.grade, userData.experience, userData.languages, []
            ]);
            this.#userCache.set(username, {
                data: {
                    ...userData,
                    username: username,
                    displayName: `${userData.firstName} ${userData.lastName}`,
                    profileImage: 'data:image/png;base64,',
                    bio: '',
                    registrations: []
                },
                expiration: performance.now() + config.dbCacheTime
            });
            this.logger.info(`[Database] Created account "${username}"`, true);
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.error('Database error (createAccount):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] createAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Check credentials against an existing account with the specified username. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param {string} username Valid username
     * @param {string} password Valid password
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR} Check status
     */
    async checkAccount(username: string, password: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            // cache not needed for sign-in as password is inexpensive and not frequent enough
            const data = await this.#db.query('SELECT password FROM users WHERE username=$1', [username]);
            if (data.rowCount != null && data.rowCount > 0) {
                if (await bcrypt.compare(password, data.rows[0].password)) {
                    this.#rotateRecoveryPassword(username);
                    return AccountOpResult.SUCCESS;
                } else return AccountOpResult.INCORRECT_CREDENTIALS;
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (checkAccount):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] checkAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get use data for an account. **DOES NOT VALIDATE CREDENTIALS**
     * @param {string} username Valid username
     * @returns {AccountData | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} AccountData or an error code
     */
    async getAccountData(username: string): Promise<AccountData | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        if (this.#userCache.has(username) && this.#userCache.get(username)!.expiration < performance.now()) this.#userCache.delete(username);
        if (this.#userCache.has(username)) return this.#userCache.get(username)!.data;
        else {
            try {
                // it probably doesn't matter that we fetch everything (though passwords are also fetched...)
                const data = await this.#db.query('SELECT * FROM users WHERE username=$1', [username]);
                if (data.rows.length > 0) {
                    const userData: AccountData = {
                        username: data.rows[0].username,
                        email: data.rows[0].email,
                        firstName: data.rows[0].firstname,
                        lastName: data.rows[0].lastname,
                        displayName: data.rows[0].displayname,
                        profileImage: data.rows[0].profileimg,
                        bio: data.rows[0].biography,
                        school: data.rows[0].school,
                        grade: data.rows[0].grade,
                        experience: data.rows[0].experience,
                        languages: data.rows[0].languages,
                        registrations: data.rows[0].registrations
                    };
                    this.#userCache.set(username, {
                        data: userData,
                        expiration: performance.now() + config.dbCacheTime
                    });
                    return userData;
                }
                return AccountOpResult.NOT_EXISTS;
            } catch (err) {
                this.logger.error('Database error (getAccountData):');
                this.logger.error('' + err);
                return AccountOpResult.ERROR;
            } finally {
                if (config.debugMode) this.logger.debug(`[Database] getAccountData in ${performance.now() - startTime}ms`, true);
            }
        }
    }
    /**
     * Overwrite user data for an existing account with the specified username. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param {string} username Valid username
     * @param {string} password Valid password
     * @param {AccountData} userData New data
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR} Update status
     */
    async updateAccountData(username: string, password: string, userData: AccountData): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.checkAccount(username, password);
            if (res != AccountOpResult.SUCCESS) return res;
            await this.#db.query('UPDATE users SET firstname=$2, lastname=$3, displayname=$4, school=$5, grade=$6, experience=$7, languages=$8, biography=$9, registrations=$10 WHERE username=$1', [
                username, userData.firstName, userData.lastName, userData.displayName, userData.school, userData.grade, userData.experience, userData.languages, userData.bio, userData.registrations
            ]);
            this.#userCache.set(username, {
                data: userData,
                expiration: performance.now() + config.dbCacheTime
            });
            this.logger.info(`[Database] Updated account data for "${username}"`, true);
            // recovery password already rotated in checkAccount
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.error('Database error (updateAccountData):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] updateAccountData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Change the password of an account. Requires that the existing password is correct. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param {string} username Valid username
     * @param {string} password Valid current password
     * @param {string} newPassword Valid new password
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR} Update status
     */
    async changePasswordAccount(username: string, password: string, newPassword: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.checkAccount(username, password);
            if (res != AccountOpResult.SUCCESS) return res;
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            await this.#db.query('UPDATE users SET password=$2 WHERE username=$1', [username, encryptedPassword]);
            // recovery password already rotated in checkAccount
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.error('Database error (changePasswordAccount):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] changePasswordAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Change the password of an account using the alternative rotating password. Requires that the alternative rotating password is correct. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param {string} username Valid username
     * @param {string} password Valid current password
     * @param {string} newPassword Valid new password
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR} Update status
     */
    async changePasswordTokenAccount(username: string, token: string, newPassword: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT recoverypass FROM users WHERE username=$1', [username]);
            if (data.rowCount != null && data.rowCount > 0) {
                if (token === this.#RSAdecryptSymmetric(data.rows[0].recoverypass)) {
                    const encryptedPassword = await bcrypt.hash(newPassword, salt);
                    await this.#db.query('UPDATE users SET password=$2 WHERE username=$1', [username, encryptedPassword]);
                    this.#rotateRecoveryPassword(username);
                    return AccountOpResult.SUCCESS;
                } else return AccountOpResult.INCORRECT_CREDENTIALS;
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (changePasswordAccount):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] changePasswordTokenAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete an account. Allows deletion by users and admins with permission level `AdminPerms.MANAGE_ACCOUNTS` if `adminUsername` is given. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} password Valid password of user, or admin password if `adminUsername` is given
     * @param {string} adminUsername Valid username of administrator
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR} Deletion status
     */
    async deleteAccount(username: string, password: string, adminUsername?: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            if (adminUsername != undefined) {
                this.logger.warn(`[Database] "${adminUsername}" is trying to delete account "${username}"!`);
                const res = await this.checkAccount(adminUsername, password);
                if (res != AccountOpResult.SUCCESS) return res;
                if (!await this.hasPerms(adminUsername, AdminPerms.MANAGE_ACCOUNTS)) return AccountOpResult.INCORRECT_CREDENTIALS; // no perms = incorrect creds
                const data = await this.#db.query('SELECT username FROM users WHERE username=$1', [username]); // still have to check account exists
                if (data.rowCount == null || data.rowCount == 0) return AccountOpResult.NOT_EXISTS;
                await this.#db.query('DELETE FROM users WHERE username=$1', [username]);
                this.logger.info(`[Database] Deleted account "${username}" (by "${adminUsername}")`, true);
                return AccountOpResult.SUCCESS;
            } else {
                const res = await this.checkAccount(username, password);
                if (res != AccountOpResult.SUCCESS) return res;
                await this.#db.query('DELETE FROM users WHERE username=$1', [username]);
                this.logger.info(`[Database] Deleted account ${username}`, true);
                return AccountOpResult.SUCCESS;
            }
        } catch (err) {
            this.logger.error('Database error (deleteAccount):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] deleteAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Rotates the recovery password of an account to a new random string.
     * @param {string} username Username to rotate
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Rotation status
     */
    async #rotateRecoveryPassword(username: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        try {
            const newPass = this.#RSAencryptSymmetric(uuidV4());
            const data = await this.#db.query('UPDATE users SET recoverypass=$2 WHERE username=$1 RETURNING username', [username, newPass]);
            if (data.rows.length == 0) return AccountOpResult.NOT_EXISTS;
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.error('Database error (rotateRecoveryPassword):');
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
            this.logger.error('Database error (hasPerms):');
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
        const startTime = performance.now();
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
            this.logger.error('Database error (readRounds):');
            this.logger.error('' + err);
            return [];
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] readRounds in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a round to the rounds database
     * @param {Round} round Round to write
     * @returns {boolean} If the write was successful
     */
    async writeRound(round: Round): Promise<boolean> {
        const startTime = performance.now();
        try {
            const exists = await this.#db.query('SELECT FROM rounds WHERE division=$1 AND number=$2', [round.division, round.round]);
            if ((exists.rowCount ?? 0) > 0) {
                await this.#db.query('UPDATE rounds SET problems=$3, startTime=$4, endTime=$5 WHERE division=$1 AND number=$2', [round.division, round.round, round.problems, round.startTime, round.endTime]);
            } else {
                await this.#db.query('INSERT INTO rounds (division, number, problems, startTime, endTime) VALUES ($1, $2, $3, $4, $5)', [round.division, round.round, round.problems, round.startTime, round.endTime]);
            }
            return true;
        } catch (err) {
            this.logger.error('Database error (writeRound):');
            this.logger.error('' + err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] writeRound in ${performance.now() - startTime}ms`, true);
        }
    }

    #problemCache: Map<string, { problem: Problem, expiration: number }> = new Map();
    /**
     * Filter and get a list of problems from the problems database according to a criteria
     * @param {ReadProblemsCriteria} c Filter criteria. Leaving one undefined removes the filter
     * @returns {Array<Problem>} Array of problems matching the filter criteria. If the query failed the returned array is empty
     */
    async readProblems(c: ReadProblemsCriteria): Promise<Array<Problem>> {
        const startTime = performance.now();
        try {
            const problemIdList: Set<string> = new Set();
            if (c.id != undefined && isUUID(c.id)) problemIdList.add(c.id);
            if (c.round != undefined) {
                // filter by grabbing ids from round lists (code unreadable??)
                const rounds: Round[] = await this.readRounds(c.round);
                if (c.round.number != undefined) rounds.map((r) => r.problems[c.round!.number!]).filter(v => v != undefined).forEach((v) => problemIdList.add(v));
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdList.add(v));
            }
            const problems: Problem[] = [];
            problemIdList.forEach((id) => {
                if (this.#problemCache.has(id) && this.#problemCache.get(id)!.expiration < performance.now()) this.#problemCache.delete(id);
                if (this.#problemCache.has(id)) {
                    problemIdList.delete(id);
                    problems.push(this.#problemCache.get(id)!.problem);
                }
            });
            const problemIdRegex = Array.from(problemIdList.values()).reduce((p, c) => p + `|(${c})`, '').substring(1) || '*';
            const data = await this.#db.query('SELECT * FROM problems WHERE id~\'$1\' AND name=$2 AND author=$3', [problemIdRegex, c.name ?? '*', c.author ?? '*']);
            // also add the problems to cache
            const filteredRows = data.rows.filter((v) => c.constraints == undefined || c.constraints(v));
            for (const problem of filteredRows) {
                const p = {
                    id: problem.id,
                    name: problem.name,
                    author: problem.author,
                    content: problem.content,
                    cases: problem.cases,
                    constraints: problem.constraints
                };
                this.#problemCache.set(problem.id, {
                    problem: p,
                    expiration: performance.now() + config.dbCacheTime
                });
                problems.push(problem);
            }
            return problems;
        } catch (err) {
            this.logger.error('Database error (readProblems):');
            this.logger.error('' + err);
            return [];
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] readProblems in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a problem to the problems database
     * @param {Problem} problem Problem to write
     * @returns {boolean} If the write was successful
     */
    async writeProblem(problem: Problem): Promise<boolean> {
        const startTime = performance.now();
        try {
            const exists = await this.#db.query('SELECT id FROM problems WHERE id=$1', [problem.id]);
            if ((exists.rowCount ?? 0) > 0) {
                await this.#db.query('UPDATE problems SET name=$2, content=$3, author=$4, cases=$5, constraints=$6 WHERE id=$1', [problem.id, problem.name, problem.content, problem.author, problem.cases, problem.constraints]);
            } else {
                await this.#db.query('INSERT INTO problems (id, name, content, author, cases, constraints) VALUES ($1, $2, $3, $4, $5, $6)', [problem.id, problem.name, problem.content, problem.author, problem.cases, problem.constraints]);
            }
            this.#problemCache.set(problem.id, {
                problem: problem,
                expiration: performance.now() + config.dbCacheTime
            });
            return true;
        } catch (err) {
            this.logger.error('Database error (writeProblem):');
            this.logger.error('' + err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] writeProblem in ${performance.now() - startTime}ms`, true);
        }
    }

    #submissionCache: Map<string, { submission: Submission, expiration: number }> = new Map();
    /**
     * Filter and get a list of submissions from the submissions database according to a criteria.
     * @param {ReadSubmissionsCriteria} c Filter criteria. Leaving one undefined removes the filter
     * @returns {Array<Submission> | null} Array of submissions matching the filter criteria. If the query failed the returned value is `null`
     */
    async readSubmissions(c: ReadSubmissionsCriteria): Promise<Array<Submission> | null> {
        const startTime = performance.now();
        try {
            // reusing code from readProblems (oops)
            const problemIdList: Set<string> = new Set();
            if (c.id != undefined && isUUID(c.id)) problemIdList.add(c.id);
            if (c.round != undefined) {
                // filter by grabbing ids from round lists (code unreadable??)
                const rounds: Round[] = await this.readRounds(c.round);
                if (c.round.number != undefined) rounds.map((r) => r.problems[c.round!.number!]).filter(v => v != undefined).forEach((v) => problemIdList.add(v));
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdList.add(v));
            }
            const submissions: Submission[] = [];
            problemIdList.forEach((id) => {
                if (this.#submissionCache.has(id) && this.#submissionCache.get(id)!.expiration < performance.now()) this.#submissionCache.delete(id);
                if (this.#submissionCache.has(id)) {
                    problemIdList.delete(id);
                    submissions.push(this.#submissionCache.get(id)!.submission);
                }
            });
            const problemIdRegex = Array.from(problemIdList.values()).reduce((p, c) => p + `|(${c})`, '').substring(1) || '*';
            const data = await this.#db.query('SELECT * FROM submissions WHERE username=$1 AND id~\'$2\'', [c.username ?? '*', problemIdRegex]);
            for (const submission of data.rows) {
                const s = {
                    username: submission.username,
                    problemId: submission.id,
                    time: submission.time,
                    file: submission.file,
                    lang: submission.language,
                    scores: submission.scores
                };
                this.#submissionCache.set(submission.id, {
                    submission: s,
                    expiration: performance.now() + config.dbCacheTime
                });
                submissions.push(s);
            }
            return submissions;
        } catch (err) {
            this.logger.error('Database error (readSubmissions):');
            this.logger.error('' + err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] readSubmissions in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a submission to the submissions database
     * @param {Submission} submission Submission to write
     * @returns {boolean} If the write was successful
     */
    async writeSubmission(submission: Submission): Promise<boolean> {
        const startTime = performance.now();
        try {
            const exists = await this.#db.query('SELECT id FROM submissions WHERE username=$1 AND id=$2', [submission.username, submission.problemId]);
            if ((exists.rowCount ?? 0) > 0) {
                await this.#db.query('UPDATE submissions SET file=$3, language=$4, scores=$5, time=$6 WHERE username=$1 AND id=$2', [submission.username, submission.problemId, submission.file, submission.lang, submission.scores, Date.now()]);
            } else {
                await this.#db.query('INSERT INTO submissions (username, id, file, language, scores, time) VALUES ($1, $2, $3, $4, $5, $6)', [submission.username, submission.problemId, submission.file, submission.lang, submission.scores, Date.now()]);
            }
            this.#submissionCache.set(submission.problemId, {
                submission: submission,
                expiration: performance.now() + config.dbCacheTime
            });
            return true;
        } catch (err) {
            this.logger.error('Database error (writeSubmission):');
            this.logger.error('' + err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] writeSubmission in ${performance.now() - startTime}ms`, true);
        }
    }
}
export default Database;

type UUID = string;

function isUUID(id: string): id is UUID {
    return uuidValidate(id);
}

export function reverse_enum(enumerator, v): string {
    for (const k in enumerator) if (enumerator[k] === v) return k;
    return '';
}

/**The result of an operation that requires authentication performed by the database */
export enum AccountOpResult {
    /**The operation was completed successfully */
    SUCCESS = 0,
    /**The operation failed because could not overwrite existing data */
    ALREADY_EXISTS = 1,
    /**The operation failed because requested data did not exist */
    NOT_EXISTS = 2,
    /**The operation failed because it is not allowed with the current authentication */
    INCORRECT_CREDENTIALS = 3,
    /**The operation failed because of an unexpected issue */
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
    MANAGE_ADMINS = 1 << 30 // only 31 bits available
}

/**Descriptor for an account */
export interface AccountData {
    /**Username */
    readonly username: string
    /**Email */
    email: string
    /**First name */
    firstName: string
    /**Last name */
    lastName: string
    /**Alternate name used in front-end */
    displayName: string
    /**Encoded image */
    profileImage: string
    /**User-written short biography */
    bio: string
    /**School name */
    school: string
    /**Grade level (8 = below HS, 13 = above HS) */
    grade: number
    /**Experience level, 0 to 4, with 4 being the highest */
    experience: number
    /**Known languages, in file extension form */
    languages: string[]
    /**List of registrations */
    registrations: Registration[]
}
/**Descriptor for a registration */
export interface Registration {
    /**The contest (does not specify when) */
    contest: 'WWPIT' | 'WWPHacks'
    /**Division number */
    division: number
    /**Which of the actual contests (e.g. 2024 Fall) */
    name: string
}

/**Descriptor for a single round */
export interface Round {
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
export interface Problem {
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
export interface ProblemConstraints {
    /**Time limit per test case in millseconds */
    time: number
    /**Memory limit per test case in megabytes */
    memory: number
}
/**Descriptor for a single test case */
export interface TestCase {
    /**Input string */
    input: string
    /**Correct output string */
    output: string
}
/**Descriptor for a single submission */
export interface Submission {
    /**Username of submitter */
    readonly username: string
    /**UUID of problem submitted to */
    readonly problemId: UUID
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
export interface Score {
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

/**Criteria to filter by. Leaving a value undefined removes the filter */
interface ReadRoundsCriteria {
    /**Zero-indexed division number */
    division?: number
    /**Zero-indexed round within the division */
    round?: number
}
/**Criteria to filter by. Leaving a value undefined removes the filter */
interface ProblemRoundCriteria {
    /**Zero-indexed division number */
    division?: number
    /**Zero-indexed round within the division */
    round?: number
    /**Zero-indexed problem number within the round */
    number?: number
}
/**Criteria to filter by. Leaving a value undefined removes the filter */
interface ReadProblemsCriteria {
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
interface ReadSubmissionsCriteria {
    /**UUID of problem */
    id?: UUID
    /**Username of submitter */
    username?: string
    /**Round-based filter for problems */
    round?: ProblemRoundCriteria
}
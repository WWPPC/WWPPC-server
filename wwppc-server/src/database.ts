import bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes, subtle, webcrypto } from 'crypto';
import { Client } from 'pg';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';

import config from './config';
import { Mailer } from './email';
import Logger, { NamedLogger } from './log';

const salt = 5;

export interface DatabaseConstructorParams {
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
 * PostgreSQL database connection for handling account operations and storage of contest data, including problems and submissions.
 * Has a short-term cache to reduce repetitive database calls.
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
    readonly logger: NamedLogger;
    readonly mailer: Mailer;
    readonly #cacheGarbageCollector: NodeJS.Timeout;

    /**
     * @param params Parameters
     */
    constructor({ uri, key, sslCert, logger, mailer }: DatabaseConstructorParams) {
        const startTime = performance.now();
        this.logger = new NamedLogger(logger, 'Database');
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
                this.logger.handleFatal('Could not connect to database:', err);
                this.logger.fatal('Host: ' + this.#db.host);
                this.logger.destroy();
                process.exit(1);
            }),
            setPublicKey()
        ]);
        this.connectPromise.then(() => {
            this.logger.info('Database connected');
            if (config.debugMode) {
                this.logger.debug(`Connected to ${this.#db.host}`);
                this.logger.debug(`Connection time: ${performance.now() - startTime}ms`);
            }
        });
        this.#db.on('error', (err) => {
            this.logger.handleFatal('Fatal database error:', err);
            this.logger.destroy();
            process.exit(1);
        });
        this.#cacheGarbageCollector = setInterval(() => {
            let emptied = 0;
            [this.#userCache, this.#teamCache, this.#adminCache, this.#contestCache, this.#roundCache, this.#problemCache, this.#submissionCache].forEach((cache) => {
                cache.forEach((item: { expiration: number }, key: string) => {
                    if (item.expiration <= performance.now()) {
                        cache.delete(key);
                        emptied++;
                    }
                });
            });
            if (global.gc) global.gc();
            if (config.debugMode) logger.debug(`Deleted ${emptied} stale entries from cache`);
        }, 300000);
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
    async RSAdecrypt(buf: RSAEncrypted) {
        try {
            return buf instanceof Buffer ? await new TextDecoder().decode(await subtle.decrypt({ name: "RSA-OAEP" }, (await this.#rsaKeys).privateKey, buf).catch(() => new Uint8Array([30]))) : buf;
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
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
            this.logger.handleError('RSA decrypt error:', err);
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
            const decipher = createDecipheriv('aes-256-gcm', this.#dbKey, Buffer.from(text[1], 'base64'));
            decipher.setAuthTag(Buffer.from(text[2], 'base64'));
            return decipher.update(text[0], 'base64', 'utf8') + decipher.final('utf8');
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
            return encrypted;
        }
    }

    /**
     * Disconnect from the PostgreSQL database.
     * @returns {Promise} A `Promise` representing when the database has disconnected.
     */
    async disconnect(): Promise<void> {
        clearInterval(this.#cacheGarbageCollector);
        this.clearCache();
        await this.#db.end();
        this.logger.info('Disconnected');
    }

    /**
     * Transform a list of possible conditions into a string with SQL conditions and bindings. Allows for blank inputs to be treated as wildcards (by omitting the condition)
     * @param {{ name: string, value: SqlValue | undefined | null }[]} columns Array of columns with conditions to check. If any value is undefined the condition is omitted
     * @returns { queryConditions: string, bindings: SqlValue[] } String of conditions to append to end of SQL query (after `WHERE` clause) and accompanying bindings array
     */
    #buildColumnConditions(columns: { name: string, value: FilterComparison<number | string | boolean> | undefined | null }[]): { queryConditions: string, bindings: SqlValue[] } {
        const conditions: string[] = [];
        const bindings: SqlValue[] = [];
        for (const { name, value } of columns) {
            if (value instanceof Array) {
                const start = bindings.length + 1;
                bindings.push(...value);
                conditions.push(`${name} IN (${Array.from({ length: value.length }, (v, i) => start + i).map(v => '$' + v).join(', ')})`);
                // } else if (typeof value == 'object' && value != null) {
                //     if (value.op == '><' || value.op == '<>') {
                //     } else {
                //         value.v
                //     }
            } else if (value != null) {
                bindings.push(value);
                conditions.push(`${name}=$${bindings.length}`);
            }
        }
        return {
            queryConditions: conditions.length > 0 ? ('WHERE ' + conditions.join(' AND ')) : '',
            bindings: bindings
        };
    }

    #userCache: Map<string, { data: AccountData, expiration: number }> = new Map();
    #teamCache: Map<string, { data: TeamData, expiration: number }> = new Map();
    /**
     * Validate a pair of credentials. To be valid, a username must be an alphanumeric string of length <= 16, and the password must be a string of length <= 1024.
     * @param {string} username Username
     * @param {string} password Password
     * @returns {boolean} Validity
     */
    validate(username: string, password: string): boolean {
        return username.trim().length > 0 && password.trim().length > 0 && username.length <= 16 && password.length <= 1024 && /^[a-z0-9-_=+]+$/.test(username);
    }
    /**
     * Read a list of all accounts that exist. Bypasses cache.
     * @returns {AccountData[] | null}
     */
    async getAccountList(): Promise<AccountData[] | null> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query(`
                SELECT users.username, users.email, users.firstname, users.lastname, users.displayname, users.profileimg, users.biography, users.school, users.grade, users.experience, users.languages, users.pastregistrations, users.team, teams.registrations
                FROM users
                INNER JOIN teams ON users.team=teams.username
            `);
            if (data.rows.length > 0) {
                const ret: AccountData[] = [];
                for (const row of data.rows) {
                    const userData: AccountData = {
                        username: row.username,
                        email: row.email,
                        firstName: row.firstname,
                        lastName: row.lastname,
                        displayName: row.displayname,
                        profileImage: row.profileimg,
                        bio: row.biography,
                        school: row.school,
                        grade: row.grade,
                        experience: row.experience,
                        languages: row.languages,
                        registrations: row.registrations,
                        pastRegistrations: row.pastregistrations,
                        team: row.team
                    };
                    this.#userCache.set(row.username, {
                        data: structuredClone(userData),
                        expiration: performance.now() + config.dbCacheTime
                    });
                    ret.push(userData);
                }
                return ret;
            }
            return null;
        } catch (err) {
            this.logger.handleError('Database error (getAccountList):', err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`getAccountList in ${performance.now() - startTime}ms`, true);
        }
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
            const data = await this.#db.query('SELECT username FROM users WHERE username=$1', [username]);
            if (data.rows.length > 0) return AccountOpResult.ALREADY_EXISTS;
            else {
                await this.#db.query(`
                    INSERT INTO users (username, password, recoverypass, email, firstname, lastname, displayname, profileimg, biography, school, grade, experience, languages, pastregistrations, team)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                    `, [
                    username, encryptedPassword, this.#RSAencryptSymmetric(uuidV4()), userData.email, userData.firstName, userData.lastName, `${userData.firstName} ${userData.lastName}`.substring(0, 64), config.defaultProfileImg, '', userData.school, userData.grade, userData.experience, userData.languages, [], username
                ]);
                const joinCode = Array.from({ length: 6 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))).join('');
                await this.#db.query(`
                    INSERT INTO teams (username, registrations, name, biography, joincode)
                    VALUES ($1, $2, $3, $4, $5)
                    `, [
                    username, [], username, '', joinCode
                ]);
            }
            this.#userCache.set(username, {
                data: {
                    ...userData,
                    username: username,
                    displayName: `${userData.firstName} ${userData.lastName}`.substring(0, 64),
                    profileImage: config.defaultProfileImg,
                    bio: '',
                    registrations: [],
                    pastRegistrations: [],
                    team: username
                },
                expiration: performance.now() + config.dbCacheTime
            });
            this.logger.info(`Created account "${username}"`, true);
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (createAccount):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`createAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Check credentials against an existing account. **Does not validate credentials**.
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
            if (data.rows.length > 0) {
                if (await bcrypt.compare(password, data.rows[0].password)) {
                    this.#rotateRecoveryPassword(username);
                    return AccountOpResult.SUCCESS;
                } else return AccountOpResult.INCORRECT_CREDENTIALS;
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.handleError('Database error (checkAccount):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`checkAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get user data for an account. Registrations are fetched through team alias. **Does not validate credentials**.
     * @param {string} username Valid username
     * @returns {AccountData | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} AccountData or an error code
     */
    async getAccountData(username: string): Promise<AccountData | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            if (this.#userCache.has(username) && this.#userCache.get(username)!.expiration < performance.now()) this.#userCache.delete(username);
            if (this.#userCache.has(username)) return structuredClone(this.#userCache.get(username)!.data);;
            // update query to alias future registrations.
            const data = await this.#db.query(`
                SELECT users.username, users.email, users.firstname, users.lastname, users.displayname, users.profileimg, users.biography, users.school, users.grade, users.experience, users.languages, users.pastregistrations, users.team, teams.registrations
                FROM users
                INNER JOIN teams ON users.team=teams.username
                WHERE users.username=$1
                `, [
                username
            ]);
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
                    registrations: data.rows[0].registrations,
                    pastRegistrations: data.rows[0].pastregistrations,
                    team: data.rows[0].team
                };
                this.#userCache.set(username, {
                    data: structuredClone(userData),
                    expiration: performance.now() + config.dbCacheTime
                });
                return userData;
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.handleError('Database error (getAccountData):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAccountData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Overwrite user data for an existing account. *Only uses part of the data*. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {AccountData} userData New data (only `firstName`, `lastName`, `displayName`, `profileImage`, `school`, `grade`, `experience`, `languages`, and `bio` fields are updated)
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Update status
     */
    async updateAccountData(username: string, userData: AccountData): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.#db.query(
                'UPDATE users SET firstname=$2, lastname=$3, displayname=$4, profileimg=$5, school=$6, grade=$7, experience=$8, languages=$9, biography=$10 WHERE username=$1 RETURNING username', [
                username, userData.firstName, userData.lastName, userData.displayName, userData.profileImage, userData.school, userData.grade, userData.experience, userData.languages, userData.bio
            ]);
            if (res.rows.length == 0) return AccountOpResult.NOT_EXISTS;
            this.#userCache.set(username, {
                data: structuredClone(userData),
                expiration: performance.now() + config.dbCacheTime
            });
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (updateAccountData):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`updateAccountData in ${performance.now() - startTime}ms`, true);
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
    async changeAccountPassword(username: string, password: string, newPassword: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.checkAccount(username, password);
            if (res != AccountOpResult.SUCCESS) return res;
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            await this.#db.query('UPDATE users SET password=$2 WHERE username=$1', [username, encryptedPassword]);
            this.logger.info(`Reset password via password for "${username}"`, true);
            // recovery password already rotated in checkAccount
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (changeAccountPassword):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`changeAccountPassword in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Change the password of an account using the alternative rotating password. Requires that the alternative rotating password is correct. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param {string} username Valid username
     * @param {string} token Alternative rotating password
     * @param {string} newPassword Valid new password
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR} Update status
     */
    async changeAccountPasswordToken(username: string, token: string, newPassword: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT recoverypass FROM users WHERE username=$1', [username]);
            if (data.rows.length > 0) {
                this.#rotateRecoveryPassword(username);
                if (token === this.#RSAdecryptSymmetric(data.rows[0].recoverypass)) {
                    const encryptedPassword = await bcrypt.hash(newPassword, salt);
                    await this.#db.query('UPDATE users SET password=$2 WHERE username=$1', [username, encryptedPassword]);
                    this.logger.info(`Reset password via token for "${username}"`, true);
                    return AccountOpResult.SUCCESS;
                } else return AccountOpResult.INCORRECT_CREDENTIALS;
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.handleError('Database error (changeAccountPasswordToken):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`changeAccountPasswordToken in ${performance.now() - startTime}ms`, true);
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
                this.logger.warn(`"${adminUsername}" is trying to delete account "${username}"!`);
                const res = await this.checkAccount(adminUsername, password);
                if (res != AccountOpResult.SUCCESS) return res;
                if (!await this.hasAdminPerms(adminUsername, AdminPerms.MANAGE_ACCOUNTS)) return AccountOpResult.INCORRECT_CREDENTIALS; // no perms = incorrect creds
                const data = await this.#db.query('SELECT username FROM users WHERE username=$1', [username]); // still have to check account exists
                if (data.rows.length == null || data.rows.length == 0) return AccountOpResult.NOT_EXISTS;
                const users = await this.#db.query('UPDATE users SET team=username WHERE team=$1 RETURNING username', [username]);
                await this.#db.query('DELETE FROM users WHERE username=$1', [username]);
                await this.#db.query('DELETE FROM teams WHERE username=$1', [username]);
                this.logger.info(`Deleted account "${username}" (by "${adminUsername}")`, true);
                this.#userCache.delete(username);
                for (const row of users.rows) {
                    this.#userCache.delete(row.username);
                    this.#teamCache.delete(row.username);
                }
                return AccountOpResult.SUCCESS;
            } else {
                const res = await this.checkAccount(username, password);
                if (res != AccountOpResult.SUCCESS) return res;
                const users = await this.#db.query('UPDATE users SET team=username WHERE team=$1 RETURNING username', [username]);
                await this.#db.query('DELETE FROM users WHERE username=$1', [username]);
                await this.#db.query('DELETE FROM teams WHERE username=$1', [username]);
                this.logger.info(`Deleted account ${username}`, true);
                this.#userCache.delete(username);
                for (const row of users.rows) {
                    this.#userCache.delete(row.username);
                    this.#teamCache.delete(row.username);
                }
                return AccountOpResult.SUCCESS;
            }
        } catch (err) {
            this.logger.handleError('Database error (deleteAccount):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`deleteAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get the alternative rotating password for an account. **Does not validate credentials**
     * @param {string} username Valid username
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Fetch status
     */
    async getRecoveryPassword(username: string): Promise<string | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT recoverypass FROM users WHERE username=$1', [username]);
            if (data.rows.length > 0) {
                this.logger.info(`Fetched recovery password for ${username}`, true);
                return this.#RSAdecryptSymmetric(data.rows[0].recoverypass);
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.handleError('Database error (getRecoveryPassword):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getRecoveryPassword in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Rotates the recovery password of an account to a new random string.
     * @param {string} username Username to rotate
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Rotation status
     */
    async #rotateRecoveryPassword(username: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const newPass = this.#RSAencryptSymmetric(uuidV4());
            const data = await this.#db.query('UPDATE users SET recoverypass=$2 WHERE username=$1 RETURNING username', [username, newPass]);
            if (data.rows.length == 0) return AccountOpResult.NOT_EXISTS;
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (rotateRecoveryPassword):', err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`rotateRecoveryPassword in ${performance.now() - startTime}ms`, true);
        }
    }

    /**
     * Get the id of a user's team (the team creator's username). **Does not validate credentials**.
     * @param {string} username Valid username
     * @returns {string | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR} Team id or an error code
     */
    async getAccountTeam(username: string): Promise<string | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.getAccountData(username);
            if (data == AccountOpResult.NOT_EXISTS) return TeamOpResult.NOT_EXISTS;
            if (data == AccountOpResult.ERROR) return TeamOpResult.ERROR;
            return data.team;
        } catch (err) {
            this.logger.handleError('Database error (getAccountTeam):', err);
            return TeamOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAccountTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Set the id of a user's team (the team creator's username). Also clears existing registrations to avoid incorrect registration reporting. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} team Valid username (of team) OR join code
     * @param {boolean} useJoinCode If should search by join code instead (default false)
     * @returns {TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.NOT_ALLOWED | TeamOpResult.ERROR} Update status
     */
    async setAccountTeam(username: string, team: string, useJoinCode: boolean = false): Promise<TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.NOT_ALLOWED | TeamOpResult.ERROR> {
        const startTime = performance.now();
        try {
            if (team != username || useJoinCode) {
                const existingUserData = await this.getAccountData(username);
                if (typeof existingUserData != 'object') return existingUserData == AccountOpResult.NOT_EXISTS ? TeamOpResult.NOT_EXISTS : TeamOpResult.ERROR;
                if (existingUserData.team != username) return TeamOpResult.NOT_ALLOWED;
            }
            if (useJoinCode) {
                const res = await this.#db.query(
                    'UPDATE users SET team=(SELECT teams.username FROM teams WHERE teams.joincode=$2) WHERE users.username=$1 AND EXISTS (SELECT teams.username FROM teams WHERE teams.joincode=$2) RETURNING users.username', [
                    username, team
                ]);
                if (res.rows.length == 0) return TeamOpResult.NOT_EXISTS;
            } else {
                const res = await this.#db.query(
                    'UPDATE users SET team=$2 WHERE users.username=$1 AND EXISTS (SELECT teams.username FROM teams WHERE teams.username=$2) RETURNING users.username', [
                    username, team
                ]);
                if (res.rows.length == 0) return TeamOpResult.NOT_EXISTS;
            }
            this.#userCache.delete(username);
            this.#teamCache.forEach((v, k) => {
                if (v.data.members.includes(username)) this.#teamCache.delete(k);
            });
            return TeamOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (setAccountTeam):', err);
            return TeamOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`setAccountTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get the team data associated with a username. Will route to the team returned by `getAccountTeam`. **Does not validate credentials**.
     * @param {string} username Valid username
     * @returns {TeamData | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR} Team data or an error code
     */
    async getTeamData(username: string): Promise<TeamData | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR> {
        const startTime = performance.now();
        try {
            if (this.#teamCache.has(username) && this.#teamCache.get(username)!.expiration < performance.now()) this.#teamCache.delete(username);
            if (this.#teamCache.has(username)) return structuredClone(this.#teamCache.get(username)!.data);
            const data = await this.#db.query(
                'SELECT teams.username, teams.name, teams.biography, teams.joincode FROM teams WHERE teams.username=(SELECT users.team FROM users WHERE users.username=$1)', [
                username
            ]);
            const data2 = await this.#db.query(
                'SELECT users.username FROM users WHERE users.team=(SELECT users.team FROM users WHERE users.username=$1)', [
                username
            ]);
            if (data.rows.length > 0) {
                const teamDat: TeamData = {
                    id: data.rows[0].username,
                    name: data.rows[0].name,
                    bio: data.rows[0].biography,
                    members: data2.rows.map(row => row.username),
                    joinCode: data.rows[0].joincode
                };
                this.#teamCache.set(username, {
                    data: structuredClone(teamDat),
                    expiration: performance.now() + config.dbCacheTime
                });
                return teamDat;
            }
            return TeamOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.handleError('Database error (getTeamData):', err);
            return TeamOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getTeamData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Overwrite the team data for an existing team. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {TeamData} teamData New data
     * @returns {TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR} Update status
     */
    async updateTeamData(username: string, teamData: TeamData): Promise<TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.#db.query(
                'UPDATE teams SET name=$2, biography=$3 WHERE teams.username=(SELECT users.team FROM users WHERE users.username=$1) RETURNING teams.username', [
                username, teamData.name, teamData.bio
            ]);
            if (res.rows.length == 0) return TeamOpResult.NOT_EXISTS;
            this.#teamCache.forEach((v, k) => {
                if (v.data.members.includes(username)) this.#teamCache.set(k, {
                    data: teamData,
                    expiration: performance.now() + config.dbCacheTime
                });
            });
            return TeamOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (updateTeamData):', err);
            return TeamOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`updateTeamData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Register an account for a contest, also registering all other accounts on the same team. Prevents duplicate registrations. Does not prevent registering a team that is too large. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} contest Contest id
     * @returns {TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.CONTEST_ALREADY_EXISTS | TeamOpResult.ERROR} Registration status
     */
    async registerContest(username: string, contest: string): Promise<TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.CONTEST_ALREADY_EXISTS | TeamOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const exists = await this.#db.query(
                'SELECT teams.registrations FROM teams WHERE teams.username=(SELECT users.team FROM users WHERE users.username=$1)', [
                username
            ]);
            if (exists.rows.length == 0) return TeamOpResult.NOT_EXISTS;
            if (exists.rows[0].registrations.includes(contest)) return TeamOpResult.CONTEST_ALREADY_EXISTS;
            const res = await this.#db.query(`
                UPDATE teams SET registrations=(teams.registrations || $2)
                WHERE teams.username=(SELECT users.team FROM users WHERE users.username=$1)
                RETURNING teams.username
                `, [
                username, [contest]
            ]);
            if (res.rows.length == 0) return TeamOpResult.NOT_EXISTS;
            this.#teamCache.forEach((v, k) => {
                if (v.data.members.includes(username)) this.#userCache.delete(k);
            });
            return TeamOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (registerContest):', err);
            return TeamOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`registerContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Unregister an account for a contest, also unregistering all other accounts on the same team. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} contest Contest id
     * @returns {TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR} Registration status
     */
    async unregisterContest(username: string, contest: string): Promise<TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.#db.query(`
            UPDATE teams SET registrations=ARRAY_REMOVE(
                (SELECT teams.registrations FROM teams WHERE teams.username=(SELECT users.team FROM users WHERE users.username=$1)),
                $2
            ) WHERE teams.username=(SELECT users.team FROM users WHERE users.username=$1)
            RETURNING teams.username
            `, [
                username, contest
            ]);
            if (res.rows.length == 0) return TeamOpResult.NOT_EXISTS;
            this.#teamCache.forEach((v, k) => {
                if (v.data.members.includes(username)) this.#userCache.delete(k);
            });
            return TeamOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (unregisterContest):', err);
            return TeamOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`unregisterContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Unregister an account for all contests (shortcut method), also unregistering all other accounts on the same team. **Does not validate credentials**.
     * @param {string} username Valid username
     * @returns {TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR} Registration status
     */
    async unregisterAllContests(username: string): Promise<TeamOpResult.SUCCESS | TeamOpResult.NOT_EXISTS | TeamOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.#db.query('UPDATE teams SET registrations=\'{}\' WHERE username=$1 RETURNING username', [username]);
            if (res.rows.length == 0) return TeamOpResult.NOT_EXISTS;
            return TeamOpResult.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (unregisterAllContests):', err);
            return TeamOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`unregisterAllContests in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Moves all instances of a contest from upcoming registrations to the past registrations of every team.
     * @param {string} contest Contest ID to mark as completed
     */
    async finishContest(contest: string): Promise<boolean> {
        const startTime = performance.now();
        try {
            await this.#db.query(`
                UPDATE users SET pastRegistrations=(users.pastRegistrations || $1)
                WHERE users.team=ANY(SELECT teams.username FROM teams WHERE $1=ANY(teams.registrations))
                AND NOT $1=ANY(users.pastRegistrations)
                `, [
                contest
            ]);
            await this.#db.query(`
                UPDATE teams SET registrations=ARRAY_REMOVE(registrations, $1)
            `, [
                contest
            ]);
            return true;
        } catch (err) {
            this.logger.handleError('Database error (finishContest):', err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`finishContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get a list of all users that are registered for a contest.
     * @param {string} contest Contest id
     * @return {string[]}
     */
    async getAllRegisteredUsers(contest: string): Promise<string[] | null> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT users.username FROM users WHERE users.team=ANY(SELECT teams.username FROM teams WHERE $1=ANY(teams.registrations))', [
                contest
            ]);
            return data.rows.map((row) => row.username);
        } catch (err) {
            this.logger.handleError('Database error (finishContest):', err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`finishContest in ${performance.now() - startTime}ms`, true);
        }
    }

    #adminCache: Map<string, { permissions: number, expiration: number }> = new Map();
    /**
     * Check if an administrator has a certain permission.
     * @param {string} username Valid administrator username
     * @param {AdminPerms} flag Permission flag to check against
     * @returns {boolean} If the administrator has the permission. Also false if the user is not an administrator.
     */
    async hasAdminPerms(username: string, flag: AdminPerms): Promise<boolean> {
        const startTime = performance.now();
        try {
            if (this.#adminCache.has(username) && this.#adminCache.get(username)!.expiration < performance.now()) this.#adminCache.delete(username);
            if (this.#adminCache.has(username)) return (this.#adminCache.get(username)!.permissions & flag) != 0;
            const data = await this.#db.query('SELECT permissions FROM admins WHERE username=$1', [username]);
            if (data.rows.length > 0) this.#adminCache.set(username, {
                permissions: data.rows[0].permissions,
                expiration: performance.now() + config.dbCacheTime
            });
            return data.rows.length > 0 && (data.rows[0].permissions & flag) != 0;
        } catch (err) {
            this.logger.handleError('Database error (hasAdminPerms):', err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`hasAdminPerms in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get a list of all administrators and their boolean permission flags.
     * @returns {{ username: string, permissions: number }[] | null} Paired usernames and permissions, or null if an error cocured.
     */
    async getAdminList(): Promise<{ username: string, permissions: number }[] | null> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT username, permissions FROM admins');
            for (const row of data.rows) {
                this.#adminCache.set(row.username, {
                    permissions: row.permissions,
                    expiration: performance.now() + config.dbCacheTime
                });
            }
            return data.rows;
        } catch (err) {
            this.logger.handleError('Database error (getAdminList):', err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`getAdminList in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Set the permission bit flags of an administrator, or add a new administrator. If permissions bit 0 is false (not admin), the administrator is removed.
     * @param {string} username Valid username
     * @param {number} permissions Permission flags, as a number (boolean OR)
     * @returns {boolean} If writing was successful.
     */
    async setAdminPerms(username: string, permissions: number): Promise<boolean> {
        const startTime = performance.now();
        try {
            if ((permissions & AdminPerms.ADMIN) == 0) {
                // delete instead
                await this.#db.query('DELETE FROM admins WHERE username=$1', [username]);
                this.#adminCache.delete(username);
            } else {
                const existing = await this.#db.query('UPDATE admins SET permissions=$2 WHERE username=$1 RETURNING username', [username, permissions]);
                if (existing.rows.length == 0) await this.#db.query('INSERT INTO admins (username, permissions) VALUES ($1, $2)', [username, permissions]);
                this.#adminCache.set(username, {
                    permissions: permissions,
                    expiration: performance.now() + config.dbCacheTime
                });
            }
            return true;
        } catch (err) {
            this.logger.handleError('Database error (setAdminPerms):', err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`setAdminPerms in ${performance.now() - startTime}ms`, true);
        }
    }

    #contestCache: Map<string, { contest: Contest, expiration: number }> = new Map();
    /**
     * Filter and get a list of contest data from the contests table according to a criteria.
     * @param {string | string[]} id Contest ID or list of contest ids. Leaving undefined removes the criteria 
     * @returns {Contest[] | null} Array of contest data matching the filter criteria
     */
    async readContests(id?: string | string[]): Promise<Contest[] | null> {
        const startTime = performance.now();
        try {
            const contestIdSet: Set<string> = new Set();
            if (id != undefined) {
                if (typeof id == 'string') contestIdSet.add(id);
                else for (const contest of id) contestIdSet.add(contest);
            }
            const contests: Contest[] = [];
            contestIdSet.forEach((id) => {
                if (this.#contestCache.has(id) && this.#contestCache.get(id)!.expiration < performance.now()) this.#contestCache.delete(id);
                if (this.#contestCache.has(id)) {
                    contestIdSet.delete(id);
                    contests.push(structuredClone(this.#contestCache.get(id)!.contest));
                }
            });
            const contestIdList = Array.from(contestIdSet.values());
            if (contestIdList.length > 0 || id == undefined) {
                const { queryConditions, bindings } = this.#buildColumnConditions([
                    { name: 'id', value: id != undefined ? contestIdList : undefined }
                ]);
                const data = await this.#db.query(`SELECT * FROM contests ${queryConditions}`, bindings);
                for (const contest of data.rows) {
                    const c = {
                        id: contest.id,
                        rounds: contest.rounds,
                        exclusions: contest.exclusions,
                        maxTeamSize: contest.maxteamsize,
                        startTime: Number(contest.starttime),
                        endTime: Number(contest.endtime)
                    };
                    this.#contestCache.set(contest.id, {
                        contest: structuredClone(c),
                        expiration: performance.now() + config.dbCacheTime
                    });
                    contests.push(c);
                }
            }
            return contests;
        } catch (err) {
            this.logger.handleError('Database error (readContests):', err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`readContests in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a contest to the contests table.
     * @param {Contest} contest Contest to write
     * @returns {boolean} If the write was successful
     */
    async writeContest(contest: Contest): Promise<boolean> {
        const startTime = performance.now();
        try {
            const data = [contest.id, contest.rounds, contest.exclusions, contest.maxTeamSize];
            const update = await this.#db.query('UPDATE contests SET rounds=$2, exclusions=$3, maxteamsize=$4 WHERE id=$1 RETURNING id', data);
            if (update.rows.length == 0) await this.#db.query('INSERT INTO contests (id, rounds, exclusions, maxteamsize) VALUES ($1, $2, $3, $4)', data);
            this.#contestCache.set(contest.id, {
                contest: structuredClone(contest),
                expiration: performance.now() + config.dbCacheTime
            });
            return true;
        } catch (err) {
            this.logger.handleError('Database error (writeContest):', err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`writeContest in ${performance.now() - startTime}ms`, true);
        }
    }

    #roundCache: Map<string, { round: Round, expiration: number }> = new Map();
    /**
     * Filter and get a list of round data from the rounds table according to a criteria.
     * @param {ReadRoundsCriteria} c Filter criteria. Leaving one undefined removes the criteria
     * @returns {Round[] | null} Array of round data matching the filter criteria. If the query failed the returned value is `null`
     */
    async readRounds(c: ReadRoundsCriteria = {}): Promise<Round[] | null> {
        const startTime = performance.now();
        try {
            const roundIdSet: Set<string> = new Set();
            if (c.id != undefined) {
                if (typeof c.id == 'string' && isUUID(c.id)) roundIdSet.add(c.id);
                else for (const contest of c.id) if (isUUID(contest)) roundIdSet.add(contest);
            }
            if (c.contest != undefined) {
                const contests = await this.readContests(c.contest);
                if (contests === null) return null;
                contests.flatMap((c) => c.rounds).forEach((v) => roundIdSet.add(v));
            }
            const rounds: Round[] = [];
            roundIdSet.forEach((id) => {
                if (this.#roundCache.has(id) && this.#roundCache.get(id)!.expiration < performance.now()) this.#roundCache.delete(id);
                if (this.#roundCache.has(id)) {
                    roundIdSet.delete(id);
                    rounds.push(structuredClone(this.#roundCache.get(id)!.round));
                }
            });
            const roundIdList = Array.from(roundIdSet.values());
            if (roundIdList.length > 0 || (c.id == undefined && c.contest == undefined && c.round == undefined)) {
                const { queryConditions, bindings } = this.#buildColumnConditions([
                    { name: 'id', value: (c.id != undefined || c.contest != undefined || c.round != undefined) ? roundIdList : undefined },
                ]);
                const data = await this.#db.query(`SELECT * FROM rounds ${queryConditions}`, bindings);
                for (const round of data.rows) {
                    const r = {
                        id: round.id,
                        problems: round.problems,
                        startTime: Number(round.starttime),
                        endTime: Number(round.endtime)
                    };
                    this.#roundCache.set(round.id, {
                        round: structuredClone(r),
                        expiration: performance.now() + config.dbCacheTime
                    });
                    rounds.push(r);
                }
            }
            return rounds;
        } catch (err) {
            this.logger.handleError('Database error (readRounds):', err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`readRounds in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a round to the rounds table.
     * @param {Round} round Round to write
     * @returns {boolean} If the write was successful
     */
    async writeRound(round: Round): Promise<boolean> {
        const startTime = performance.now();
        try {
            const data = [round.id, round.problems, round.startTime, round.endTime];
            const update = await this.#db.query('UPDATE rounds SET problems=$2, starttime=$3, endtime=$4 WHERE id=$1 RETURNING id', data);
            if (update.rows.length == 0) await this.#db.query('INSERT INTO rounds (id, problems, starttime, endtime) VALUES ($1, $2, $3, $4)', data);
            this.#roundCache.set(round.id, {
                round: structuredClone(round),
                expiration: performance.now() + config.dbCacheTime
            });
            return true;
        } catch (err) {
            this.logger.handleError('Database error (writeRound):', err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`writeRound in ${performance.now() - startTime}ms`, true);
        }
    }

    #problemCache: Map<string, { problem: Problem, expiration: number }> = new Map();
    /**
     * Filter and get a list of problems from the problems table according to a criteria.
     * @param {ReadProblemsCriteria} c Filter criteria. Leaving one undefined removes the criterion
     * @returns {Problem[] | null} Array of problems matching the filter criteria. If the query failed the returned value is `null`
     */
    async readProblems(c: ReadProblemsCriteria = {}): Promise<Problem[] | null> {
        const startTime = performance.now();
        try {
            const problemIdSet: Set<string> = new Set();
            if (c.id != undefined) {
                if (typeof c.id == 'string' && isUUID(c.id)) problemIdSet.add(c.id);
                else for (const contest of c.id) if (isUUID(contest)) problemIdSet.add(contest);
            }
            if (c.contest != undefined) {
                const rounds = await this.readRounds(c.contest);
                if (rounds === null) return null;
                if (c.contest.number != undefined) {
                    const n = c.contest.number;
                    if (typeof n == 'number') rounds.map((r) => r.problems[n]).filter(v => v != undefined).forEach((v) => problemIdSet.add(v));
                    else rounds.flatMap((r) => r.problems.filter((v, i) => n.includes(i))).filter(v => v != undefined).forEach((v) => problemIdSet.add(v));
                }
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdSet.add(v));
            }
            const problems: Problem[] = [];
            problemIdSet.forEach((id) => {
                if (this.#problemCache.has(id) && this.#problemCache.get(id)!.expiration < performance.now()) this.#problemCache.delete(id);
                if (this.#problemCache.has(id)) {
                    problemIdSet.delete(id);
                    problems.push(structuredClone(this.#problemCache.get(id)!.problem));
                }
            });
            const problemIdList = Array.from(problemIdSet.values());
            if (problemIdList.length > 0 || (c.id == undefined && c.contest?.contest == undefined && c.contest?.round == undefined && c.contest?.roundId == undefined && c.contest?.number == undefined)) {
                const { queryConditions, bindings } = this.#buildColumnConditions([
                    { name: 'id', value: (c.id != undefined || c.contest != undefined) ? problemIdList : undefined },
                    { name: 'name', value: c.name },
                    { name: 'author', value: c.author }
                ]);
                const data = await this.#db.query(`SELECT * FROM problems ${queryConditions}`, bindings);
                for (const problem of data.rows) {
                    const p = {
                        id: problem.id,
                        name: problem.name,
                        author: problem.author,
                        content: problem.content,
                        constraints: problem.constraints,
                        hidden: problem.hidden,
                        archived: problem.archived
                    };
                    this.#problemCache.set(problem.id, {
                        problem: structuredClone(p),
                        expiration: performance.now() + config.dbProblemCacheTime
                    });
                    problems.push(problem);
                }
            }
            return problems;
        } catch (err) {
            this.logger.handleError('Database error (readProblems):', err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`readProblems in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a problem to the problems table.
     * @param {Problem} problem Problem to write
     * @returns {boolean} If the write was successful
     */
    async writeProblem(problem: Problem): Promise<boolean> {
        const startTime = performance.now();
        try {
            const data = [problem.id, problem.name, problem.content, problem.author, JSON.stringify(problem.constraints), problem.hidden, problem.archived];
            const update = await this.#db.query('UPDATE problems SET name=$2, content=$3, author=$4, constraints=$5, hidden=$6, archived=$7 WHERE id=$1 RETURNING id', data);
            if (update.rows.length == 0) await this.#db.query('INSERT INTO problems (id, name, content, author, constraints, hidden, archived) VALUES ($1, $2, $3, $4, $5, $6, $7)', data);
            this.#problemCache.set(problem.id, {
                problem: structuredClone(problem),
                expiration: performance.now() + config.dbProblemCacheTime
            });
            return true;
        } catch (err) {
            this.logger.handleError('Database error (writeProblem):', err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`writeProblem in ${performance.now() - startTime}ms`, true);
        }
    }

    #submissionCache: Map<string, { submission: Submission, expiration: number }> = new Map();
    /**
     * Filter and get a list of submissions from the submissions table according to a criteria.
     * @param {ReadSubmissionsCriteria} c Filter criteria. Leaving one undefined removes the criterion
     * @returns {Submission[] | null} Array of submissions matching the filter criteria. If the query failed the returned value is `null`
     */
    async readSubmissions(c: ReadSubmissionsCriteria = {}): Promise<Submission[] | null> {
        const startTime = performance.now();
        try {
            const problemIdSet: Set<string> = new Set();
            if (c.id != undefined) {
                if (typeof c.id == 'string' && isUUID(c.id)) problemIdSet.add(c.id);
                else for (const contest of c.id) if (isUUID(contest)) problemIdSet.add(contest);
            }
            if (c.contest != undefined) {
                const rounds = await this.readRounds(c.contest);
                if (rounds === null) return null;
                if (c.contest.number != undefined) {
                    const n = c.contest.number;
                    if (typeof n == 'number') rounds.map((r) => r.problems[n]).filter(v => v != undefined).forEach((v) => problemIdSet.add(v));
                    else rounds.flatMap((r) => r.problems.filter((v, i) => n.includes(i))).filter(v => v != undefined).forEach((v) => problemIdSet.add(v));
                }
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdSet.add(v));
            }
            const submissions: Submission[] = [];
            if (c.username != undefined) problemIdSet.forEach((id) => {
                const realId = id + ':' + c.username;
                if (this.#submissionCache.has(realId) && this.#submissionCache.get(realId)!.expiration < performance.now()) this.#submissionCache.delete(realId);
                if (this.#submissionCache.has(realId)) {
                    problemIdSet.delete(id);
                    submissions.push(structuredClone(this.#submissionCache.get(realId)!.submission));
                }
            });
            const problemIdList = Array.from(problemIdSet.values());
            if (problemIdList.length > 0 || (c.id == undefined && c.contest?.contest == undefined && c.contest?.round == undefined && c.contest?.roundId == undefined && c.contest?.number == undefined)) {
                const { queryConditions, bindings } = this.#buildColumnConditions([
                    { name: 'id', value: (c.id != undefined || c.contest != undefined) ? problemIdList : undefined },
                    { name: 'username', value: c.username }
                ]);
                const data = await this.#db.query(`SELECT * FROM submissions ${queryConditions}`, bindings);
                for (const submission of data.rows) {
                    const s = {
                        username: submission.username,
                        problemId: submission.id,
                        time: Number(submission.time),
                        file: submission.file,
                        lang: submission.language,
                        scores: submission.scores,
                        history: submission.history.map((h) => ({
                            time: Number(h.time),
                            lang: h.lang,
                            scores: h.scores.map((s) => ({ state: s.state, time: Number(s.time), memory: Number(s.memory), subtask: Number(s.subtask) }))
                        }))
                    };
                    this.#submissionCache.set(submission.id + ':' + submission.username, {
                        submission: structuredClone(s),
                        expiration: performance.now() + config.dbCacheTime
                    });
                    submissions.push(s);
                }
            }
            return submissions;
        } catch (err) {
            this.logger.handleError('Database error (readSubmissions):', err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`readSubmissions in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a submission to the submissions table. The `history` field is ignored.
     * If the most recent submission has an empty `scores` field, the submission will be overwritten instead of appended to history.
     * @param {Submission} submission Submission to write
     * @param {boolean} overwrite Force overwriting of most recent submission
     * @returns {boolean} If the write was successful
     */
    async writeSubmission(submission: Submission, overwrite?: boolean): Promise<boolean> {
        const startTime = performance.now();
        try {
            const existing = await this.#db.query('SELECT time, language, history, scores FROM submissions WHERE username=$1 AND id=$2', [submission.username, submission.problemId]);
            if (existing.rows.length > 0) {
                const history: { time: number, lang: string, scores: Score[] }[] = existing.rows[0].history.map((h) => ({ time: Number(h.time), lang: h.lang, scores: h.scores }));
                if (existing.rows[0].scores.length > 0 && !overwrite) history.push({
                    time: Number(existing.rows[0].time),
                    lang: existing.rows[0].language,
                    scores: existing.rows[0].scores.map((s) => ({ state: s.state, time: Number(s.time), memory: Number(s.memory), subtask: Number(s.subtask) }))
                });
                await this.#db.query('UPDATE submissions SET file=$3, language=$4, scores=$5, time=$6, history=$7 WHERE username=$1 AND id=$2 RETURNING id', [
                    submission.username, submission.problemId, submission.file, submission.lang, JSON.stringify(submission.scores), Date.now(), JSON.stringify(history)
                ]);
                this.#submissionCache.set(submission.problemId + ':' + submission.username, {
                    submission: { ...submission, history: history },
                    expiration: performance.now() + config.dbCacheTime
                });
            } else {
                await this.#db.query('INSERT INTO submissions (username, id, file, language, scores, time, history) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
                    submission.username, submission.problemId, submission.file, submission.lang, JSON.stringify(submission.scores), Date.now(), JSON.stringify([])
                ]);
                this.#submissionCache.set(submission.problemId + ':' + submission.username, {
                    submission: structuredClone(submission),
                    expiration: performance.now() + config.dbCacheTime
                });
            }
            return true;
        } catch (err) {
            this.logger.handleError('Database error (writeSubmission):', err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`writeSubmission in ${performance.now() - startTime}ms`, true);
        }
    }

    /**
     * Clears all database account, team, admin, contest, round, problem, and submission cache entries.
     */
    clearCache() {
        this.#userCache.clear();
        this.#teamCache.clear();
        this.#adminCache.clear();
        this.#contestCache.clear();
        this.#roundCache.clear();
        this.#problemCache.clear();
        this.#submissionCache.clear();
        if (global.gc) global.gc();
        if (config.debugMode) this.logger.debug('Cache cleared');
    }
}
export default Database;

export type UUID = string;

export type SqlValue = number | string | boolean | number[] | string[] | boolean[];

/**Flexible comparison type for database filtering */
// export type FilterComparison<T> = {
//     op: '<' | '>' | '>=' | '<='
//     v: number & T
// } | {
//     op: '><' | '<>'
//     v1: number & T
//     v2: number & T
// } | {
//     op: '=' | '!'
//     v: T
// } | {
//     op: '=' | '!'
//     v: T[]
// } | T | T[];
export type FilterComparison<T> = T | T[];

export function isUUID(id: string): id is UUID {
    return uuidValidate(id);
}

export type RSAEncrypted = Buffer | string;

export function reverse_enum(enumerator, v): string {
    for (const k in enumerator) if (enumerator[k] === v) return k;
    return v;
}
export function is_in_enum(v, enumerator): boolean {
    for (const k in enumerator) if (enumerator[k] === v) return true;
    return false;
}

/**Response codes for operations involving account data */
export enum AccountOpResult {
    /**The operation was completed successfully */
    SUCCESS = 0,
    /**The operation failed because database cannot not overwrite existing account */
    ALREADY_EXISTS = 1,
    /**The operation failed because the requested account does not exist */
    NOT_EXISTS = 2,
    /**The operation failed because of an authentication failure */
    INCORRECT_CREDENTIALS = 3,
    /**The operation failed because of an unexpected issue */
    ERROR = 4
}

/**Response codes for operations involving team data */
export enum TeamOpResult {
    /**The operation was completed successfully */
    SUCCESS = 0,
    /**The operation failed because the reqested account, team, or contest does not exist */
    NOT_EXISTS = 1,
    /**The operation failed because the requested contest is on exclude list of other registration */
    CONTEST_CONFLICT = 2,
    /**The operation failed because the member count exceeds limits in a registration */
    CONTEST_MEMBER_LIMIT = 3,
    /**The operation failed because the requested contest is already a registration */
    CONTEST_ALREADY_EXISTS = 4,
    /**The operation failed because of an authentication failure */
    INCORRECT_CREDENTIALS = 5,
    /**The operation failed because of an unspecified restriction */
    NOT_ALLOWED = 6,
    /**The operation failed because of an unexpected issue */
    ERROR = 7
}

/**Admin permission level bit flags */
export enum AdminPerms {
    ADMIN = 1,
    /**Create, delete, and modify accounts */
    MANAGE_ACCOUNTS = 1 << 1,
    /**Edit all problems, including hidden ones */
    MANAGE_PROBLEMS = 1 << 2,
    /**Edit contests and control ContestHost functions */
    MANAGE_CONTESTS = 1 << 3,
    /**View and disqualify submissions */
    MANAGE_SUBMISSIONS = 1 << 4,
    /**Manage admin permissions */
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
    registrations: string[]
    /**Past list of registrations for previous contests that have already ended */
    pastRegistrations: string[]
    /**The teamid which is the username of the team owner */
    team: string
}
export interface AccountUserData {
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
    /**The teamid which is the username of the team owner */
    team: string
}
/**Descriptor for a team */
export interface TeamData {
    /**The unique team id which is the team owner/creator's username */
    readonly id: string
    /**The name of the team */
    name: string
    /**Team's biography */
    bio: string
    /**List of usernames of team members */
    members: string[]
    /**Numerical join code */
    joinCode: string
}

/**Descriptor for a single contest */
export interface Contest {
    /**Contest ID, also used as name */
    readonly id: string
    /**List of round UUIDs within the contest */
    rounds: UUID[]
    /**List of other contest ids that cannot be registered simultaneously */
    exclusions: string[]
    /**Maximum team size allowed to register */
    maxTeamSize: number
    /**Time of round start, UNIX */
    startTime: number
    /**Time of round end, UNIX */
    endTime: number
}
/**Descriptor for a single round */
export interface Round {
    /**UUID */
    readonly id: UUID
    /**List of problem UUIDs within the round */
    problems: UUID[]
    /**Time of round start, UNIX */
    startTime: number
    /**Time of round end, UNIX */
    endTime: number
}
/**Descriptor for a single problem */
export interface Problem {
    /**UUID */
    readonly id: UUID
    /**Display name */
    name: string
    /**Author username */
    author: string
    /**HTML/KaTeX content of problem statement */
    content: string
    /**Runtime constraints */
    constraints: {
        /**Time limit per test case in millseconds */
        time: number
        /**Memory limit per test case in megabytes */
        memory: number
    }
    /**Public visibility of problem */
    hidden: boolean
    /**Archival status - can be fetched through API instead */
    archived: boolean
}
/**Descriptor for a single submission */
export interface Submission {
    /**Username of submitter */
    readonly username: string
    /**UUID of problem submitted to */
    readonly problemId: UUID
    /**Time of submission, UNIX milliseconds */
    time: number
    /**Contents of the submission file */
    file: string
    /**Submission language */
    lang: string
    /**Resulting scores of the submission */
    scores: Score[]
    /**Shortened list of previous submissions and their results, without content (increasing chronologically) */
    history: {
        /**Time of submission, UNIX milliseconds */
        time: number
        /**Submission language */
        lang: string
        /**Resulting scores of the submission */
        scores: Score[]
    }[]
}
/**Descriptor for the score of a single test case */
export interface Score {
    /**Pass/fail status */
    state: ScoreState
    /**Time used in milliseconds */
    time: number
    /**Memory used in megabytes */
    memory: number
    /**Denotes which subtask to be part of */
    subtask: number
}
export enum ScoreState {
    CORRECT = 1,
    INCORRECT = 2,
    TIME_LIM_EXCEEDED = 3,
    MEM_LIM_EXCEEDED = 4,
    RUNTIME_ERROR = 5,
    COMPILE_ERROR = 6
}

/**Criteria to filter by. Leaving a value undefined removes the criteria */
export interface ReadRoundsCriteria {
    /**Contest ID */
    contest?: string | string[]
    /**Zero-indexed round within the contest */
    round?: FilterComparison<number>
    /**Round ID */
    id?: UUID | UUID[]
    /**Start of round, UNIX time */
    startTime?: FilterComparison<number>
    /**End of round, UNIX time */
    endTime?: FilterComparison<number>
}
/**Criteria to filter by. Leaving a value undefined removes the criteria */
export interface ProblemRoundCriteria {
    /**Contest ID */
    contest?: string | string[]
    /**Zero-indexed round within the contest */
    round?: FilterComparison<number>
    /**Zero-indexed problem number within the round */
    number?: FilterComparison<number>
    /**Round ID */
    roundId?: UUID | UUID[]
}
/**Criteria to filter by. Leaving a value undefined removes the criteria */
export interface ReadProblemsCriteria {
    /**UUID of problem */
    id?: UUID | UUID[]
    /**Display name of problem */
    name?: string | string[]
    /**Author username of problem */
    author?: string | string[]
    /**Round based filter for problems */
    contest?: ProblemRoundCriteria
}
/**Criteria to filter by. Leaving a value undefined removes the criteria */
export interface ReadSubmissionsCriteria {
    /**UUID of problem */
    id?: UUID | UUID[]
    /**Username of submitter */
    username?: string | string[]
    /**Round-based filter for problems */
    contest?: ProblemRoundCriteria
}
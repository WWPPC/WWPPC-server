import bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes, subtle, webcrypto } from 'crypto';
import { Client } from 'pg';
import { v4 as uuidV4, validate as uuidValidate } from 'uuid';

import config from './config';
import { Mailer } from './email';
import Logger from './log';

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
 * PostgreSQL database connection for handling account operations and storage of contest data, including problems and submissions.
 * Very inefficient.
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
            this.#db.connect().then(async () => {
                logger.info('Database connected');
                if (config.debugMode) {
                    logger.debug('Database connected to: ' + this.#db.host);
                    logger.debug(`Database connection time: ${performance.now() - startTime}ms`);
                }
                return;
                // brick of code so we don't lose the functions
                await this.#db.query(`
                    CREATE TYPE ACCOUNTDATA AS (
                        username VARCHAR(16),
                        email VARCHAR(32),
                        firstname VARCHAR(32),
                        lastname VARCHAR(32),
                        displayname VARCHAR(64),
                        profileimg TEXT,
                        biography TEXT,
                        school VARCHAR(64),
                        grade SMALLINT,
                        experience SMALLINT,
                        languages VARCHAR[],
                        team VARCHAR(16),
                        pastregistrations VARCHAR[]
                    );

                    CREATE OR REPLACE FUNCTION CREATEACCOUNT(
                        Username VARCHAR,
                        Password VARCHAR,
                        RecoveryPass VARCHAR,
                        Email VARCHAR,
                        FirstName VARCHAR,
                        LastName VARCHAR,
                        ProfileImage VARCHAR,
                        School VARCHAR,
                        Grade SMALLINT,
                        Experience SMALLINT,
                        Languages VARCHAR[],
                        JoinCode VARCHAR
                    )
                    RETURNS VARCHAR AS
                    $$
                    BEGIN
                        IF EXISTS (SELECT users.username FROM users WHERE users.username=iUsername) THEN
                            RETURN SELECT iUsername;
                        END;
                        INSERT INTO users (username, password, recoverypass, email, firstname, lastname, displayname, profileimg, biography, school, grade, experience, languages, pastregistrations, team)
                        VALUES (iUsername, iPassword, iRecoveryPass, iEmail, iFirstName, iLastName, (SELECT iFirstName || '' || iLastName), iProfileImage, '', iSchool, iGrade, iExperience, iLanguages, {}, iUsername);
                        INSERT INTO teams (username, registrations, name, biography, joincode)
                        VALUES (iUsername, {}, iUsername, '', iJoinCode);
                    END;
                    $$ LANGUAGE plpgsql

                    CREATE OR REPLACE FUNCTION GETACCOUNTDATA(Username VARCHAR)
                    RETURNS ACCOUNTDATA AS
                    $$
                    BEGIN
                        RETURN SELECT users.username, users.email, users.firstname, users.lastname, users.displayname, users.profileimg, users.biography, users.school, users.grade, users.experience, users.languages, users.pastregistrations, users.team, teams.registrations
                        FROM users
                        WHERE users.username=iUsername
                        INNER JOIN teams ON users.username=teams.username;
                    END;
                    $$ LANGUAGE plpgsql

                    CREATE OR REPLACE FUNCTION WRITEROUND
                `);
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
            logger.info('Database setup complete');
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
        await this.#db.end();
    }

    /**
     * Transform a list of possible conditions into a string with SQL conditions and bindings. Allows for blank inputs to be treated as wildcards (by omitting the condition)
     * @param {{ name: string, value: SqlValue | undefined | null }[]} columns Array of columns with conditions to check. If any value is undefined the condition is omitted
     * @returns { queryConditions: string, bindings: SqlValue[] } String of conditions to append to end of SQL query (after `WHERE` clause) and accompanying bindings array
     */
    #buildColumnConditions(columns: { name: string, value: SqlValue | undefined | null }[]): { queryConditions: string, bindings: SqlValue[] } {
        const conditions: string[] = [];
        const bindings: SqlValue[] = [];
        for (const { name, value } of columns) {
            if (value instanceof Array) {
                bindings.push(value);
                conditions.push(`${name} IN ($${bindings.length})`);
            } else if (value != undefined) {
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
            const data = await this.#db.query('SELECT * FROM users');
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
                        data: userData,
                        expiration: performance.now() + config.dbCacheTime
                    });
                    ret.push(userData);
                }
                return ret;
            }
            return null;
        } catch (err) {
            this.logger.error('Database error (getAccountList):');
            this.logger.error('' + err);
            return null;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] getAccountList in ${performance.now() - startTime}ms`, true);
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
            const data = await this.#db.query('SELECT username FROM users WHERE username=$1;', [username]);
            if (data.rows.length > 0) return AccountOpResult.ALREADY_EXISTS;
            else await this.#db.query('', [
                username, encryptedPassword, this.#RSAencryptSymmetric(uuidV4()), userData.email, userData.firstName, userData.lastName, `${userData.firstName} ${userData.lastName}`.substring(0, 64), 'data:image/png;base64,', '', userData.school, userData.grade, userData.experience, userData.languages, [], [], username, username, '', Math.random().toFixed(6).substring(2)
            ]);
            this.#userCache.set(username, {
                data: {
                    ...userData,
                    username: username,
                    displayName: `${userData.firstName} ${userData.lastName}`,
                    profileImage: config.defaultProfileImg,
                    bio: '',
                    registrations: [],
                    pastRegistrations: [],
                    team: ''
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
            this.logger.error('Database error (checkAccount):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] checkAccount in ${performance.now() - startTime}ms`, true);
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
            if (this.#userCache.has(username)) return this.#userCache.get(username)!.data;
            // update query to alias future registrations.
            const data = await this.#db.query('SELECT GetAccountData($1)', [username]);
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
    /**
     * Overwrite user data for an existing account. *Only uses part of the data*. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {AccountData} userData New data (only `firstName`, `lastName`, `displayName`, `profileImage`, `school`, `grade`, `experience`, `languages`, and `bio` fields are updated)
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Update status
     */
    async updateAccountData(username: string, userData: AccountData): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.#db.query('UPDATE users SET firstname=$2, lastname=$3, displayname=$4, profileimg=$5, school=$6, grade=$7, experience=$8, languages=$9, biography=$10 WHERE username=$1 RETURNING username', [
                username, userData.firstName, userData.lastName, userData.displayName, userData.profileImage, userData.school, userData.grade, userData.experience, userData.languages, userData.bio
            ]);
            if (res.rows.length == 0) return AccountOpResult.NOT_EXISTS;
            this.#userCache.set(username, {
                data: userData,
                expiration: performance.now() + config.dbCacheTime
            });
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
    async changeAccountPassword(username: string, password: string, newPassword: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.checkAccount(username, password);
            if (res != AccountOpResult.SUCCESS) return res;
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            await this.#db.query('UPDATE users SET password=$2 WHERE username=$1', [username, encryptedPassword]);
            this.logger.info(`[Database] Reset password via password for "${username}"`, true);
            // recovery password already rotated in checkAccount
            return AccountOpResult.SUCCESS;
        } catch (err) {
            this.logger.error('Database error (changeAccountPassword):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] changeAccountPassword in ${performance.now() - startTime}ms`, true);
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
    async changeAccountPasswordToken(username: string, token: string, newPassword: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.INCORRECT_CREDENTIALS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT recoverypass FROM users WHERE username=$1', [username]);
            if (data.rows.length > 0) {
                this.#rotateRecoveryPassword(username);
                if (token === this.#RSAdecryptSymmetric(data.rows[0].recoverypass)) {
                    const encryptedPassword = await bcrypt.hash(newPassword, salt);
                    await this.#db.query('UPDATE users SET password=$2 WHERE username=$1', [username, encryptedPassword]);
                    this.logger.info(`[Database] Reset password via token for "${username}"`, true);
                    return AccountOpResult.SUCCESS;
                } else return AccountOpResult.INCORRECT_CREDENTIALS;
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (changeAccountPassword):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] changeAccountPasswordToken in ${performance.now() - startTime}ms`, true);
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
                if (data.rows.length == null || data.rows.length == 0) return AccountOpResult.NOT_EXISTS;
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
     * Get the alternative rotating password for an account. **Does not validate credentials**
     * @param {string} username Valid username
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Fetch status
     */
    async getRecoveryPassword(username: string): Promise<string | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT recoverypass FROM users WHERE username=$1', [username]);
            if (data.rows.length > 0) {
                this.logger.info(`[Database] Fetched recovery password for ${username}`, true);
                return this.#RSAdecryptSymmetric(data.rows[0].recoverypass);
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (getRecoveryPassword):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] getRecoveryPassword in ${performance.now() - startTime}ms`, true);
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
            this.logger.error('Database error (rotateRecoveryPassword):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] rotateRecoveryPassword in ${performance.now() - startTime}ms`, true);
        }
    }

    /**
     * Get the id of a user's team (the team creator's username). **Does not validate credentials**.
     * @param {string} username Valid username
     * @returns {string | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Team id or an error code
     */
    async getAccountTeam(username: string): Promise<string | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.getAccountData(username);
            if (typeof data != 'object') return data;
            return data.team;
        } catch (err) {
            this.logger.error('Database error (getAccountTeam):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] getAccountTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Set the id of a user's team (the team creator's username). Also copies registrations for upcoming contests into the user's registrations. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} team Valid username (of team) OR join code
     * @param {boolean} useJoinCode If should search by join code instead (default false)
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Update status
     */
    async setAccountTeam(username: string, team: string, useJoinCode: boolean = false): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            if (useJoinCode) {
                const res = await this.#db.query('UPDATE users SET team=(SELECT username FROM users WHERE joincode=$2) WHERE username=$1 AND EXISTS (SELECT username FROM users WHERE joincode=$2) RETURNING username;', [
                    username, team
                ]);
                if (res.rows.length > 0) return AccountOpResult.SUCCESS;
            } else {
                const res = await this.#db.query('UPDATE users SET team=$2 WHERE username=$1 AND EXISTS (SELECT username FROM users WHERE username=$2) RETURNING username;', [
                    username, team
                ]);
                if (res.rows.length > 0) return AccountOpResult.SUCCESS;
            }
            return AccountOpResult.ERROR;
        } catch (err) {
            this.logger.error('Database error (setAccountTeam):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] setAccountTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get the team data associated with a username. Will route to the team returned by `getAccountTeam`. **Does not validate credentials**.
     * @param {string} username Valid username
     * @returns {TeamData | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Team data or an error code
     */
    async getTeamData(username: string): Promise<TeamData | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.#db.query('SELECT username, team, teamname, teambio, teamjoincode FROM users WHERE team=(SELECT team FROM users WHERE username=$1)', [username]);
            if (data.rows.length > 0) {
                const id = data.rows.find((u) => u.username === u.team).username;
                const teamDat: TeamData = {
                    id: id,
                    name: data.rows[0].teamname,
                    bio: data.rows[0].teambio,
                    members: [],
                    joinCode: data.rows[0].teamjoincode
                };
                for (const user of data.rows) teamDat.members.push(user.username);
                return teamDat;
            }
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (getTeamData):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] getTeamData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Overwrite the team data for an existing team. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {TeamData} teamData New data
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Update status
     */
    async updateTeamData(username: string, teamData: TeamData): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.#db.query('UPDATE users SET teamname=$2, teambio=$3 WHERE username=(SELECT team FROM users WHERE username=$1) RETURNING username', [
                username, teamData.name, teamData.bio
            ]);
            if (res.rows.length > 0) return AccountOpResult.SUCCESS;
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (updateTeamData):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] updateTeamData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Register an account for a contest, also registering all other accounts on the same team. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} contest Contest id
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Registration status (a non-existent contest will return `ERROR`)
     */
    async registerContest(username: string, contest: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            // alias to team and check contest
            const res = await this.#db.query(`
                IF EXISTS (SELECT contest FROM rounds WHERE countest=$2) THEN
                    UPDATE users SET registrations=(registrations || $1) WHERE team=(SELECT team FROM users WHERE username=$1);
                END IF`,
                [username, contest]
            );
            if (res.rows.length > 0) return AccountOpResult.SUCCESS;
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (registerContest):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] registerContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Unregister an account for a contest, also unregistering all other accounts on the same team. **Does not validate credentials**.
     * @param {string} username Valid username
     * @param {string} contest Contest id
     * @returns {AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR} Registration status (a non-existent contest will return `ERROR` and unregistering from a contest not registered for will return `NOT_EXISTS`)
     */
    async unregisterContest(username: string, contest: string): Promise<AccountOpResult.SUCCESS | AccountOpResult.NOT_EXISTS | AccountOpResult.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.#db.query('UPDATE users SET registrations=ARRAY_REMOVE(registrations, $2) WHERE team=(SELECT team FROM users WHERE username=$1)',
                [username, contest]
            );
            if (res.rows.length > 0) return AccountOpResult.SUCCESS;
            return AccountOpResult.NOT_EXISTS;
        } catch (err) {
            this.logger.error('Database error (unregisterContest):');
            this.logger.error('' + err);
            return AccountOpResult.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] unregisterContest in ${performance.now() - startTime}ms`, true);
        }
    }

    #adminCache: Map<string, { permissions: number, expiration: number }> = new Map();
    /**
     * Check if an administrator has a certain permission.
     * @param username Valid administrator username
     * @param flag Permission flag to check against
     * @returns {boolean} If the administrator has the permission. Also false if the user is not an administrator.
     */
    async hasPerms(username: string, flag: AdminPerms): Promise<boolean> {
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
            this.logger.error('Database error (hasPerms):');
            this.logger.error('' + err);
            return false;
        } finally {
            if (config.debugMode) this.logger.debug(`[Database] hasPerms in ${performance.now() - startTime}ms`, true);
        }
    }

    #roundCache: Map<string, { rounds: Round[], expiration: number }> = new Map();
    /**
     * Filter and get a list of round data from the rounds database according to a criteria
     * @param {ReadRoundsCriteria} c Filter criteria. Leaving one undefined removes the criterion
     * @returns {Round[]} Array of round data matching the filter criteria. If the query failed the returned array is empty
     */
    async readRounds(c: ReadRoundsCriteria): Promise<Round[]> {
        const startTime = performance.now();
        try {
            const cacheKey = c.contest + ' ' + c.round;
            if (this.#roundCache.has(cacheKey) && this.#roundCache.get(cacheKey)!.expiration < performance.now()) this.#roundCache.delete(cacheKey);
            if (this.#roundCache.has(cacheKey)) return this.#roundCache.get(cacheKey)!.rounds;
            const { queryConditions, bindings } = this.#buildColumnConditions([
                { name: 'contest', value: c.contest },
                { name: 'number', value: c.round }
            ]);
            const data = await this.#db.query(`SELECT * FROM rounds ${queryConditions}`, bindings);
            const rounds = data.rows.map((round) => ({
                contest: round.contest,
                round: round.number,
                problems: round.problems,
                startTime: round.starttime,
                endTime: round.endtime
            }));
            this.#roundCache.set(cacheKey, {
                rounds: rounds,
                expiration: performance.now() + config.dbCacheTime
            });
            return rounds;
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
            await this.#db.query(`WRITEROUND($1, $2, $3, $4, $5)`, [round.contest, round.round, round.problems, round.startTime, round.endTime]);
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
     * @param {ReadProblemsCriteria} c Filter criteria. Leaving one undefined removes the criterion
     * @returns {Problem[]} Array of problems matching the filter criteria. If the query failed the returned array is empty
     */
    async readProblems(c: ReadProblemsCriteria): Promise<Problem[]> {
        const startTime = performance.now();
        try {
            const problemIdSet: Set<string> = new Set();
            if (c.id != undefined && isUUID(c.id)) problemIdSet.add(c.id);
            if (c.contest != undefined) {
                // filter by grabbing ids from round lists (code unreadable??)
                const rounds: Round[] = await this.readRounds(c.contest);
                if (c.contest.number != undefined) rounds.map((r) => r.problems[c.contest!.number!]).filter(v => v != undefined).forEach((v) => problemIdSet.add(v));
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdSet.add(v));
            }
            const problems: Problem[] = [];
            problemIdSet.forEach((id) => {
                if (this.#problemCache.has(id) && this.#problemCache.get(id)!.expiration < performance.now()) this.#problemCache.delete(id);
                if (this.#problemCache.has(id)) {
                    problemIdSet.delete(id);
                    problems.push(this.#problemCache.get(id)!.problem);
                }
            });
            const problemIdList = Array.from(problemIdSet.values());
            const { queryConditions, bindings } = this.#buildColumnConditions([
                { name: 'id', value: (c.id != undefined || c.contest != undefined) ? problemIdList : undefined },
                { name: 'name', value: c.name },
                { name: 'author', value: c.author }
            ]);
            const data = await this.#db.query(`SELECT * FROM problems ${queryConditions}`, bindings);
            // adding the problems to cache
            const filteredRows = data.rows.filter((v) => c.constraints == undefined || c.constraints(v));
            for (const problem of filteredRows) {
                const p = {
                    id: problem.id,
                    name: problem.name,
                    author: problem.author,
                    content: problem.content,
                    cases: problem.cases,
                    constraints: problem.constraints,
                    hidden: problem.hidden,
                    archived: problem.archived
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
            await this.#db.query(`
                UPDATE problems SET name=$2, content=$3, author=$4, cases=$5, constraints=$6, hidden=$7, archived=$8 WHERE id=$1;
                IF NOT FOUND THEN
                    INSERT INTO problems (id, name, content, author, cases, constraints, hidden, archived) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                END IF`,
                [problem.id, problem.name, problem.content, problem.author, JSON.stringify(problem.cases), JSON.stringify(problem.constraints), problem.hidden, problem.archived]
            );
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
     * @param {ReadSubmissionsCriteria} c Filter criteria. Leaving one undefined removes the criterion
     * @returns {Submission[] | null} Array of submissions matching the filter criteria. If the query failed the returned value is `null`
     */
    async readSubmissions(c: ReadSubmissionsCriteria): Promise<Submission[] | null> {
        const startTime = performance.now();
        try {
            // reusing code from readProblems (oops)
            const problemIdSet: Set<string> = new Set();
            if (c.id != undefined && isUUID(c.id)) problemIdSet.add(c.id);
            if (c.contest != undefined) {
                // filter by grabbing ids from round lists (code unreadable??)
                const rounds: Round[] = await this.readRounds(c.contest);
                if (c.contest.number != undefined) rounds.map((r) => r.problems[c.contest!.number!]).filter(v => v != undefined).forEach((v) => problemIdSet.add(v));
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdSet.add(v));
            }
            const submissions: Submission[] = [];
            problemIdSet.forEach((id) => {
                if (this.#submissionCache.has(id) && this.#submissionCache.get(id)!.expiration < performance.now()) this.#submissionCache.delete(id);
                if (this.#submissionCache.has(id)) {
                    problemIdSet.delete(id);
                    submissions.push(this.#submissionCache.get(id)!.submission);
                }
            });
            const problemIdList = Array.from(problemIdSet.values());
            const { queryConditions, bindings } = this.#buildColumnConditions([
                { name: 'id', value: (c.id != undefined || c.contest != undefined) ? problemIdList : undefined },
                { name: 'username', value: c.username }
            ]);
            const data = await this.#db.query(`SELECT * FROM submissions ${queryConditions}`, bindings);
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
            await this.#db.query(`
                UPDATE submissions SET file=$3, language=$4, scores=$5, time=$6 WHERE username=$1 AND id=$2;
                IF NOT FOUND THEN
                    INSERT INTO submissions (username, id, file, language, scores, time) VALUES ($1, $2, $3, $4, $5, $6);
                END IT
                `,
                [submission.username, submission.problemId, submission.file, submission.lang, JSON.stringify(submission.scores), Date.now()]
            );
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

export type SqlValue = number | string | boolean | number[] | string[] | boolean[];

export type UUID = string;

export function isUUID(id: string): id is UUID {
    return uuidValidate(id);
}

export type RSAEncrypted = Buffer | string;

export function reverse_enum(enumerator, v): string {
    for (const k in enumerator) if (enumerator[k] === v) return k;
    return v;
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
    ADMIN = 1,
    /**View all problems, rounds, and contests, including hidden ones */
    VIEW_PROBLEMS = 1 << 1,
    /**Edit all problems, including hidden ones */
    EDIT_PROBLEMS = 1 << 2,
    /**Create, delete, and modify accounts */
    MANAGE_ACCOUNTS = 1 << 3,
    /**Create, modify, start, stop contest, and override contestManager */
    CONTROL_CONTESTS = 1 << 4,
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

/**Descriptor for a single round */
export interface Round {
    /**Contest ID */
    readonly contest: string
    /**Zero-indexed round number in contest */
    readonly round: number
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
    readonly id: UUID
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
    /**Public visibility of problem */
    hidden: boolean
    /**Archival status - can be fetched through API? */
    archived: boolean
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
    /**Time of submission, UNIX milliseconds */
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

/**Criteria to filter by. Leaving a value undefined removes the criterion */
interface ReadRoundsCriteria {
    /**Contest ID */
    contest?: string
    /**Zero-indexed round within the contest */
    round?: number
}
/**Criteria to filter by. Leaving a value undefined removes the criterion */
interface ProblemRoundCriteria {
    /**Contest ID */
    contest?: string
    /**Zero-indexed round within the contest */
    round?: number
    /**Zero-indexed problem number within the round */
    number?: number
}
/**Criteria to filter by. Leaving a value undefined removes the criterion */
interface ReadProblemsCriteria {
    /**UUID of problem */
    id?: UUID
    /**Display name of problem */
    name?: string
    /**Author username of problem */
    author?: string
    /**Constraints validator for problem */
    constraints?: (c: ProblemConstraints) => boolean
    /**Round based filter for problems */
    contest?: ProblemRoundCriteria
}
/**Criteria to filter by. Leaving a value undefined removes the criterion */
interface ReadSubmissionsCriteria {
    /**UUID of problem */
    id?: UUID
    /**Username of submitter */
    username?: string
    /**Round-based filter for problems */
    contest?: ProblemRoundCriteria
}
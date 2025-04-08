import bcrypt from 'bcrypt';
import { Client } from 'pg';
import { v4 as uuidV4 } from 'uuid';

import config from './config';
import { AESEncryptionHandler } from './cryptoUtil';
import Logger, { NamedLogger } from './log';
import { filterCompare, FilterComparison, isUUID, UUID } from './util';

const bcryptRounds = 8;

export type DatabaseConstructorParams = {
    /**Valid PostgreSQL connection URI (postgresql://username:password@host:port/database) */
    uri: string
    /**AES-256 GCM 32-byte key (base64 string or buffer) */
    key: string | Buffer
    /**Optional SSL Certificate */
    sslCert?: string | Buffer
    /**Logging instance */
    logger: Logger
}

/**
 * PostgreSQL database connection for handling account operations and storage of contest data, including problems and submissions.
 * Has a short-term cache to speed up repetitive database queries.
 */
export class Database {
    /**Length of team join keys (changing this will break existing teams!) */
    static readonly teamJoinKeyLength = 6;

    private readonly db: Client;
    private readonly dbEncryptor: AESEncryptionHandler;
    readonly logger: NamedLogger;
    private readonly cacheGarbageCollector: NodeJS.Timeout;

    /**
     * @param params Parameters
     */
    constructor({ uri, key, sslCert, logger }: DatabaseConstructorParams) {
        this.logger = new NamedLogger(logger, 'Database');
        this.dbEncryptor = new AESEncryptionHandler(key instanceof Buffer ? key : Buffer.from(key as string, 'base64'), logger);
        this.db = new Client({
            connectionString: uri,
            application_name: 'WWPPC Server',
            ssl: sslCert !== undefined ? { ca: sslCert } : { rejectUnauthorized: false }
        });
        this.db.on('error', async (err) => {
            this.logger.handleFatal('Fatal database error:', err);
            await this.logger.destroy();
            process.exit(1);
        });
        this.cacheGarbageCollector = setInterval(() => {
            let emptied = 0;
            [this.userCache, this.teamCache, this.adminCache, this.contestCache, this.roundCache, this.problemCache, this.submissionCache].forEach((cache) => {
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
     * Connect to the PostgreSQL database.
     * @returns A `Promise` resolving when the database has connected
     */
    async connect(): Promise<void> {
        const startTime = performance.now();
        try {
            await this.db.connect();
            this.logger.info('Database connected');
            this.logger.debug(`Connected to ${this.db.host}, ${this.db.database}`);
            if (config.debugMode) this.logger.debug(`Connection time: ${performance.now() - startTime}ms`);
        } catch (err) {
            this.logger.handleFatal('Could not connect to database:', err);
            this.logger.fatal('Host: ' + this.db.host);
            await this.logger.destroy();
            process.exit(1);
        }
    }

    /**
     * Disconnect from the PostgreSQL database.
     * @returns A `Promise` resolving when the database has disconnected
     */
    async disconnect(): Promise<void> {
        clearInterval(this.cacheGarbageCollector);
        this.clearCache();
        await this.db.end();
        this.logger.info('Disconnected');
    }

    /**
     * Transform a list of possible conditions into a string with SQL conditions and bindings. Allows for blank inputs to be treated as wildcards (by omitting the condition)
     * For `FilterComparison`s, see {@link FilterComparison}.
     * @param columns Array of columns with conditions to check. If any value is undefined the condition is omitted
     * @returns String of conditions to append to end of SQL query (after `WHERE` clause) and accompanying bindings array
     */
    private buildColumnConditions(columns: { name: string, value: FilterComparison<number | string | boolean | null> | undefined }[]): { queryConditions: string, bindings: SqlValue[] } {
        const conditions: string[] = [];
        const bindings: SqlValue[] = [];
        for (const { name, value } of columns) {
            if (value instanceof Array) {
                if (value.length == 0) continue;
                const start = bindings.length + 1;
                bindings.push(...value);
                conditions.push(`${name} IN (${Array.from({ length: value.length }, (v, i) => start + i).map(v => '$' + v).join(', ')})`);
            } else if (typeof value == 'object' && value !== null) {
                switch (value.op) {
                    case '=':
                    case '!':
                    case '<':
                    case '>':
                    case '<=':
                    case '>=':
                        bindings.push(value.v);
                        conditions.push(`${name}${value.op}$${bindings.length}`);
                        break;
                    case '><':
                    case '<>':
                    case '=><':
                    case '><=':
                    case '=><=':
                    case '=<>':
                    case '<>=':
                    case '=<>=':
                        bindings.push(value.v1, value.v2);
                        switch (value.op) {
                            case '><':
                                conditions.push(`${name}>$${bindings.length - 1} AND ${name}<$${bindings.length}`);
                                break;
                            case '<>':
                                conditions.push(`${name}<$${bindings.length - 1} OR ${name}>$${bindings.length}`);
                                break;
                            case '=><':
                                conditions.push(`${name}>=$${bindings.length - 1} AND ${name}<$${bindings.length}`);
                                break;
                            case '><=':
                                conditions.push(`${name}>$${bindings.length - 1} AND ${name}<=$${bindings.length}`);
                                break;
                            case '=><=':
                                conditions.push(`${name}>=$${bindings.length - 1} AND ${name}<=$${bindings.length}`);
                                break;
                            case '=<>':
                                conditions.push(`${name}<=$${bindings.length - 1} OR ${name}>$${bindings.length}`);
                                break;
                            case '<>=':
                                conditions.push(`${name}<$${bindings.length - 1} OR ${name}>=$${bindings.length}`);
                                break;
                            case '=<>=':
                                conditions.push(`${name}<=$${bindings.length - 1} OR ${name}>=$${bindings.length}`);
                                break;
                        }
                        break;
                    case '~':
                        bindings.push(value.v);
                        conditions.push(`${name} LIKE '%' || $${bindings.length} || '%'`);
                        break;
                }
            } else if (value !== undefined) {
                bindings.push(value);
                conditions.push(`${name}=$${bindings.length}`);
            }
        }
        return {
            queryConditions: conditions.length > 0 ? ('WHERE ' + conditions.join(' AND ')) : '',
            bindings: bindings
        };
    }

    private readonly userCache: Map<string, { data: AccountData, expiration: number }> = new Map();
    /**
     * Read a list of all account usernames that exist. Bypasses cache.
     * @returns List of account usernames, or DatabaseOpCode.ERROR if an error occurred
     */
    async getAccountList(): Promise<string[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT users.username FROM users ORDER BY username ASC');
            return data.rows.map((r) => r.username);
        } catch (err) {
            this.logger.handleError('Database error (getAccountList):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAccountList in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Create an account. **Does not validate credentials**.
     * @param username Valid username
     * @param password Valid password
     * @param userData Initial user data
     * @returns Creation status
     */
    async createAccount(username: string, password: string, userData: Omit<AccountData, 'username' | 'displayName' | 'profileImage' | 'bio' | 'pastRegistrations' | 'team'>): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.CONFLICT | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const encryptedPassword = await bcrypt.hash(password, bcryptRounds);
            const data = await this.db.query('SELECT username FROM users WHERE username=$1', [username]);
            if (data.rows.length > 0) return DatabaseOpCode.CONFLICT;
            else await this.db.query(`
                INSERT INTO users (username, password, recoverypass, email, email2, firstname, lastname, displayname, profileimg, school, grade, experience, languages)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                `, [
                username, encryptedPassword, this.dbEncryptor.encrypt(uuidV4()), userData.email, userData.email2, userData.firstName, userData.lastName, `${userData.firstName} ${userData.lastName}`.substring(0, 64), config.defaultProfileImg, userData.school, userData.grade, userData.experience, userData.languages
            ]);
            this.userCache.set(username, {
                data: {
                    ...userData,
                    username: username,
                    displayName: `${userData.firstName} ${userData.lastName}`.substring(0, 64),
                    profileImage: config.defaultProfileImg,
                    bio: '',
                    pastRegistrations: [],
                    team: null
                },
                expiration: performance.now() + config.dbCacheTime
            });
            this.logger.info(`Created account "${username}"`, true);
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (createAccount):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`createAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Check credentials against an existing account. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param username Valid username
     * @param password Valid password
     * @returns Check status
     */
    async checkAccount(username: string, password: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.UNAUTHORIZED | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            // cache not needed for sign-in as password is inexpensive and not frequent enough
            const data = await this.db.query('SELECT password FROM users WHERE username=$1', [
                username
            ]);
            if (data.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (await bcrypt.compare(password, data.rows[0].password)) {
                this.rotateRecoveryPassword(username);
                return DatabaseOpCode.SUCCESS;
            } else return DatabaseOpCode.UNAUTHORIZED;
        } catch (err) {
            this.logger.handleError('Database error (checkAccount):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`checkAccount in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get user data for an account. Registrations are fetched through team alias. **Does not validate credentials**.
     * @param username Valid username
     * @returns AccountData or an error code
     */
    async getAccountData(username: string): Promise<AccountData | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            if (this.userCache.has(username) && this.userCache.get(username)!.expiration < performance.now()) this.userCache.delete(username);
            if (this.userCache.has(username)) return structuredClone(this.userCache.get(username)!.data);;
            const data = await this.db.query(`
                SELECT username, email, email2, firstname, lastname, displayname, profileimg, biography, school, grade, experience, languages, pastregistrations, team
                FROM users
                WHERE users.username=$1
                `, [
                username
            ]);
            if (data.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            const userData: AccountData = {
                username: data.rows[0].username,
                email: data.rows[0].email,
                email2: data.rows[0].email2,
                firstName: data.rows[0].firstname,
                lastName: data.rows[0].lastname,
                displayName: data.rows[0].displayname,
                profileImage: data.rows[0].profileimg,
                bio: data.rows[0].biography,
                school: data.rows[0].school,
                grade: data.rows[0].grade,
                experience: data.rows[0].experience,
                languages: data.rows[0].languages,
                pastRegistrations: data.rows[0].pastregistrations,
                team: Number(data.rows[0].team).toString(36)
            };
            this.userCache.set(username, {
                data: structuredClone(userData),
                expiration: performance.now() + config.dbCacheTime
            });
            return userData;
        } catch (err) {
            this.logger.handleError('Database error (getAccountData):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAccountData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Overwrite user data for an existing account. Cannot be used to update "email", "pastRegistrations", or "team". **Does not validate credentials**.
     * @param username Valid username
     * @param userData New data
     * @returns Update status
     */
    async updateAccountData(username: string, userData: Omit<AccountData, 'username' | 'email' | 'pastRegistrations' | 'team'>): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.db.query(
                'UPDATE users SET email2=$2, firstname=$3, lastname=$4, displayname=$5, profileimg=$6, school=$7, grade=$8, experience=$9, languages=$10, biography=$11 WHERE username=$1 RETURNING username', [
                username, userData.email2, userData.firstName, userData.lastName, userData.displayName, userData.profileImage, userData.school, userData.grade, userData.experience, userData.languages, userData.bio
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (this.userCache.has(username)) {
                // this doesn't count as cache refresh, just patching cache here
                const entry = this.userCache.get(username)!;
                entry.data = {
                    ...entry.data,
                    ...structuredClone(userData)
                };
                entry.expiration = performance.now() + config.dbCacheTime;
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (updateAccountData):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`updateAccountData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Change the password of an account. Requires that the existing password is correct. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param username Valid username
     * @param password Valid current password
     * @param newPassword Valid new password
     * @returns Update status
     */
    async changeAccountPassword(username: string, password: string, newPassword: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.UNAUTHORIZED | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.checkAccount(username, password);
            if (res != DatabaseOpCode.SUCCESS) return res;
            const encryptedPassword = await bcrypt.hash(newPassword, bcryptRounds);
            await this.db.query('UPDATE users SET password=$2 WHERE username=$1', [
                username, encryptedPassword
            ]);
            this.logger.info(`Reset password via password for "${username}"`, true);
            // recovery password already rotated in checkAccount
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (changeAccountPassword):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`changeAccountPassword in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Change the password of an account using the alternative rotating password. Requires that the alternative rotating password is correct. **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * @param username Valid username
     * @param token Alternative rotating password
     * @param newPassword Valid new password
     * @returns Update status
     */
    async changeAccountPasswordToken(username: string, token: string, newPassword: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.UNAUTHORIZED | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT recoverypass FROM users WHERE username=$1', [
                username
            ]);
            if (data.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (token === this.dbEncryptor.decrypt(data.rows[0].recoverypass)) {
                this.rotateRecoveryPassword(username);
                const encryptedPassword = await bcrypt.hash(newPassword, bcryptRounds);
                await this.db.query('UPDATE users SET password=$2 WHERE username=$1', [
                    username, encryptedPassword
                ]);
                this.logger.info(`Reset password via token for "${username}"`, true);
                return DatabaseOpCode.SUCCESS;
            } else return DatabaseOpCode.UNAUTHORIZED;
        } catch (err) {
            this.logger.handleError('Database error (changeAccountPasswordToken):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`changeAccountPasswordToken in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Change the password of an account using an administartor account with permissions {@link AdminPerms.MANAGE_ACCOUNTS} **Does not validate credentials**.
     * If successful, the `recoverypass` field is rotated to a new random string.
     * *Note: Requires password of admin with sufficient permissions to delete to avoid accidental locking of accounts.*
     * @param username Valid username
     * @param adminUsername Valid admin username
     * @param adminPassword Valid admin password
     * @param newPassword Valid new password
     * @returns Update status
     */
    async changeAccountPasswordAdmin(username: string, adminUsername: string, adminPassword: string, newPassword: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.UNAUTHORIZED | DatabaseOpCode.FORBIDDEN | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            this.logger.warn(`"${adminUsername}" is trying to change the password of "${username}"!`);
            const check = await this.checkAccount(adminUsername, adminPassword);
            if (check != DatabaseOpCode.SUCCESS) return check;
            // no perms = incorrect creds
            if (!await this.hasAdminPerms(adminUsername, AdminPerms.MANAGE_ACCOUNTS)) return DatabaseOpCode.FORBIDDEN;
            const encryptedPassword = await bcrypt.hash(newPassword, bcryptRounds);
            const res = await this.db.query('UPDATE users SET password=$2 WHERE username=$1 RETURNING username', [
                username, encryptedPassword
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            this.rotateRecoveryPassword(username);
            this.logger.info(`Reset password via administrator for "${username}"`, true);
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (changeAccountPasswordAdmin):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`changeAccountPasswordAdmin in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get the alternative rotating password for an account. **Does not validate credentials**
     * @param username Valid username
     * @returns Fetch status
     */
    async getRecoveryPassword(username: string): Promise<string | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT recoverypass FROM users WHERE username=$1', [
                username
            ]);
            if (data.rows.length > 0) {
                this.logger.info(`Fetched recovery password for ${username}`, true);
                return this.dbEncryptor.decrypt(data.rows[0].recoverypass);
            }
            return DatabaseOpCode.NOT_FOUND;
        } catch (err) {
            this.logger.handleError('Database error (getRecoveryPassword):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getRecoveryPassword in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Rotates the recovery password of an account to a new random string.
     * @param username Username to rotate
     * @returns Rotation status
     */
    async rotateRecoveryPassword(username: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const newPass = this.dbEncryptor.encrypt(uuidV4());
            const data = await this.db.query('UPDATE users SET recoverypass=$2 WHERE username=$1 RETURNING username', [
                username, newPass
            ]);
            if (data.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (rotateRecoveryPassword):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`rotateRecoveryPassword in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete an account. Allows deletion by users and admins with permission level {@link AdminPerms.MANAGE_ACCOUNTS} if `adminUsername` is given. **Does not validate credentials**.
     * *Note: Requires password or admin username and password with sufficient permissions to delete to avoid accidental deletion of accounts.*
     * @param username Valid username
     * @param password Valid user password, or admin password if `adminUsername` is given
     * @param adminUsername Valid username of administrator
     * @returns Deletion status ({@link DatabaseOpCode.FORBIDDEN} is returned when an admin has insufficient permissions)
     */
    async deleteAccount(username: string, password: string, adminUsername?: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.UNAUTHORIZED | DatabaseOpCode.FORBIDDEN | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            if (adminUsername !== undefined) {
                this.logger.warn(`"${adminUsername}" is trying to delete account "${username}"!`);
                const check = await this.checkAccount(adminUsername, password);
                if (check != DatabaseOpCode.SUCCESS) return check;
                // no perms = incorrect creds
                if (!await this.hasAdminPerms(adminUsername, AdminPerms.MANAGE_ACCOUNTS)) return DatabaseOpCode.FORBIDDEN;
            } else {
                const res = await this.checkAccount(username, password);
                if (res != DatabaseOpCode.SUCCESS) return res;
                // account exists check handled by checkAccount
            }
            const res = await this.db.query('DELETE FROM users WHERE username=$1 RETURNING team', [
                username
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (adminUsername !== undefined) {
                this.logger.info(`Deleted account "${username}" (by "${adminUsername}")`, true);
            } else {
                this.logger.info(`Deleted account "${username}"`, true);
            }
            this.userCache.delete(username);
            // also have to check if team is empty, and delete it if it is
            const teamData = await this.getTeamData(res.rows[0].team);
            if (typeof teamData != 'object') return teamData;
            if (teamData.members.length == 0) return await this.deleteTeam(teamData.id);
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (deleteAccount):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`deleteAccount in ${performance.now() - startTime}ms`, true);
        }
    }

    private readonly teamCache: Map<string, { data: TeamData, expiration: number }> = new Map();
    /**
     * Create a team.
     * @param name Name of team (optional, default 'Team')
     * @returns Newly created team's ID, or an error code
     */
    async createTeam(name?: string): Promise<string | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            // actual team ID is sequentially generated, handled by the postgres db
            const joinKey = Array.from({ length: Database.teamJoinKeyLength }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))).join('');
            const res = await this.db.query(`
                INSERT INTO teams (registrations, name, biography, joinkey)
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `, [
                [], name ?? 'Team', '', joinKey
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.ERROR;
            const teamId = Number(res.rows[0].id).toString(36);
            this.teamCache.set(teamId, {
                data: {
                    id: teamId,
                    name: name ?? 'Team',
                    bio: '',
                    members: [],
                    registrations: [],
                    joinKey: joinKey
                },
                expiration: performance.now() + config.dbCacheTime
            });
            this.logger.info(`Created team "${teamId}"`, true);
            return teamId;
        } catch (err) {
            this.logger.handleError('Database error (createTeam):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`createTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get the id of a user's team (the team creator's username). **Does not validate credentials**.
     * @param username Valid username
     * @returns Team ID, null if not on a team, or an error code
     */
    async getAccountTeam(username: string): Promise<string | null | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.getAccountData(username);
            if (data == DatabaseOpCode.NOT_FOUND) return DatabaseOpCode.NOT_FOUND;
            if (data == DatabaseOpCode.ERROR) return DatabaseOpCode.ERROR;
            return data.team;
        } catch (err) {
            this.logger.handleError('Database error (getAccountTeam):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAccountTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Change the team of a user. Since registrations are stored by team, this will change the user's registrations. **Does not validate credentials**.
     * @param username Valid username
     * @param team Team ID, or null to remove the user from all teams
     * @returns Update status
     */
    async setAccountTeam(username: string, team: string | null): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const existingUserData = await this.getAccountData(username);
            if (typeof existingUserData != 'object') return existingUserData;
            const oldTeam = existingUserData.team;
            // database teams are numbers
            const teamNumId = team !== null ? parseInt(team, 36) : null;
            if (teamNumId !== null && isNaN(teamNumId)) return DatabaseOpCode.NOT_FOUND;
            const res = await this.db.query(
                'UPDATE users SET team=$2 WHERE users.username=$1 AND EXISTS (SELECT teams.id FROM teams WHERE teams.id=$2) RETURNING users.username', [
                username, teamNumId
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            // getAccountData refreshed cache entry before this
            if (this.userCache.has(username)) this.userCache.get(username)!.data.team = team;
            if (oldTeam !== null && this.teamCache.has(oldTeam)) {
                const entry = this.teamCache.get(oldTeam)!;
                if (entry.data.members.includes(username)) entry.data.members.splice(entry.data.members.indexOf(username));
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (setAccountTeam):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`setAccountTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get the team data for a team.
     * @param team Team ID
     * @returns Team data or an error code
     */
    async getTeamData(team: string): Promise<TeamData | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            if (this.teamCache.has(team) && this.teamCache.get(team)!.expiration < performance.now()) this.teamCache.delete(team);
            if (this.teamCache.has(team)) return structuredClone(this.teamCache.get(team)!.data);
            const teamNumId = parseInt(team, 36);
            if (isNaN(teamNumId)) return DatabaseOpCode.NOT_FOUND;
            const data = await this.db.query(
                'SELECT id, name, biography, registrations joinkey FROM teams WHERE id=$1', [
                teamNumId
            ]);
            const memberData = await this.db.query(
                'SELECT username FROM users WHERE team=$1 ORDER BY username ASC', [
                teamNumId
            ]);
            if (data.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            const teamData: TeamData = {
                id: data.rows[0].username,
                name: data.rows[0].name,
                bio: data.rows[0].biography,
                members: memberData.rows.map(row => row.username),
                registrations: data.rows[0].registrations,
                joinKey: data.rows[0].joinkey
            };
            this.teamCache.set(team, {
                data: structuredClone(teamData),
                expiration: performance.now() + config.dbCacheTime
            });
            return teamData;
        } catch (err) {
            this.logger.handleError('Database error (getTeamData):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getTeamData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Update the team data for an existing team. Cannot be used to update "members", "registrations", or "joinKey".
     * @param team Team ID
     * @param teamData New data
     * @returns Update status
     */
    async updateTeamData(team: string, teamData: Omit<TeamData, 'id' | 'members' | 'registrations' | 'joinKey'>): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const teamNumId = parseInt(team, 36);
            if (isNaN(teamNumId)) return DatabaseOpCode.NOT_FOUND;
            const res = await this.db.query(
                'UPDATE teams SET name=$2, biography=$3 WHERE id=$1 RETURNING id', [
                teamNumId, teamData.name, teamData.bio
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (this.teamCache.has(team)) {
                // this doesn't count as cache refresh, just patching cache here
                const entry = this.teamCache.get(team)!;
                entry.data.name = teamData.name;
                entry.data.bio = teamData.bio;
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (updateTeamData):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`updateTeamData in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Register a team for a contest, registering all users on that team as well. Prevents duplicate registrations.
     * **Does not prevent registering a team that is too large or registering in conflict with existing registrations.**
     * @param team Team ID
     * @param contest Contest ID
     * @returns Registration status
     */
    async registerContest(team: string, contest: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.CONFLICT | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const teamNumId = parseInt(team, 36);
            if (isNaN(teamNumId)) return DatabaseOpCode.NOT_FOUND;
            const exists = await this.db.query('SELECT teams.registrations FROM teams WHERE teams.id=$1', [
                teamNumId
            ]);
            if (exists.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (exists.rows[0].registrations.includes(contest)) return DatabaseOpCode.CONFLICT;
            const res = await this.db.query('UPDATE teams SET registrations=(teams.registrations || $2) WHERE id=$1 RETURNING id', [
                teamNumId, [contest]
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (this.teamCache.has(team)) {
                // cache patch, not a refresh
                const entry = this.teamCache.get(team)!;
                entry.data.registrations.push(contest);
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (registerContest):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`registerContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Unregister a team for a contest.
     * @param team Team ID
     * @param contest Contest ID
     * @returns Registration status
     */
    async unregisterContest(team: string, contest: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const teamNumId = parseInt(team, 36);
            if (isNaN(teamNumId)) return DatabaseOpCode.NOT_FOUND;
            const res = await this.db.query(`
            UPDATE teams SET registrations=ARRAY_REMOVE(
                (SELECT registrations FROM teams WHERE id=$1),
                $2
            ) WHERE id=$1
            RETURNING id
            `, [
                teamNumId, contest
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            if (this.teamCache.has(team)) {
                // cache patch, not a refresh
                const entry = this.teamCache.get(team)!;
                if (entry.data.registrations.includes(contest)) entry.data.registrations.splice(entry.data.registrations.indexOf(contest), 1);
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (unregisterContest):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`unregisterContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Unregister an entire team for all contests.
     * @param team Team ID
     * @returns Registration status
     */
    async unregisterAllContests(team: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const teamNumId = parseInt(team, 36);
            if (isNaN(teamNumId)) return DatabaseOpCode.NOT_FOUND;
            const res = await this.db.query('UPDATE teams SET registrations=\'{}\' WHERE id=$1 RETURNING id', [
                teamNumId
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (unregisterAllContests):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`unregisterAllContests in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete a team and remove all members from it.
     * @param team Team ID
     * @returns Deletion status
     */
    async deleteTeam(team: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const teamNumId = parseInt(team, 36);
            if (isNaN(teamNumId)) return DatabaseOpCode.NOT_FOUND;
            const res = await this.db.query('DELETE FROM teams WHERE id=$1 RETURNING id', [
                teamNumId
            ]);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            this.logger.info(`Deleted team "${team}"`, true);
            this.teamCache.delete(team);
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (deleteTeam):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`deleteTeam in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Moves all instances of a contest from upcoming registrations of every team to the past registrations of every member.
     * @param contest Contest ID to mark as completed
     * @returns status
     */
    async finishContest(contest: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            await this.db.query(`
                UPDATE users SET pastRegistrations=(users.pastRegistrations || $1)
                WHERE users.team=ANY(SELECT teams.id FROM teams WHERE $1=ANY(teams.registrations))
                AND NOT $1=ANY(users.pastRegistrations)
                `, [
                contest
            ]);
            await this.db.query(`
                UPDATE teams SET registrations=ARRAY_REMOVE(registrations, $1)
            `, [
                contest
            ]);
            // these don't count as cache refreshes
            for (const [team, entry] of this.teamCache) {
                const set = new Set(entry.data.registrations);
                set.delete(contest);
                entry.data.registrations = [...set];
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (finishContest):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`finishContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get a list of all users that are registered for a contest.
     * @param contest Contest ID
     * @returns Array of usernames with registrations for the contest, or an error code
     */
    async getAllRegisteredUsers(contest: string): Promise<string[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT users.username FROM users WHERE users.team=ANY(SELECT teams.id FROM teams WHERE $1=ANY(teams.registrations)) ORDER BY username ASC', [
                contest
            ]);
            return data.rows.map((row) => row.username);
        } catch (err) {
            this.logger.handleError('Database error (getAllRegisteredUsers):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAllRegisteredUsers in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get a list of all teams that are registered for a contest.
     * @param contest Contest ID
     * @returns Array of team IDs with registrations for the contest, or an error code
     */
    async getAllRegisteredTeams(contest: string): Promise<string[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT id FROM teams WHERE $1=ANY(registrations) ORDER BY id ASC', [
                contest
            ]);
            return data.rows.map((row) => Number(row.id).toString(36));
        } catch (err) {
            this.logger.handleError('Database error (getAllRegisteredTeams):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAllRegisteredTeams in ${performance.now() - startTime}ms`, true);
        }
    }

    private readonly adminCache: Map<string, { permissions: number, expiration: number }> = new Map();
    /**
     * Check if an administrator has a certain permission.
     * @param username Valid administrator username
     * @param flag Permission flag to check against
     * @returns If the administrator has the permission, or an error code
     */
    async hasAdminPerms(username: string, flag: AdminPerms): Promise<boolean | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            if (this.adminCache.has(username) && this.adminCache.get(username)!.expiration < performance.now()) this.adminCache.delete(username);
            if (this.adminCache.has(username)) return (this.adminCache.get(username)!.permissions & flag) != 0;
            const data = await this.db.query('SELECT permissions FROM admins WHERE username=$1', [username]);
            if (data.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            this.adminCache.set(username, {
                permissions: data.rows[0].permissions,
                expiration: performance.now() + config.dbCacheTime
            });
            return (data.rows[0].permissions & flag) != 0;
        } catch (err) {
            this.logger.handleError('Database error (hasAdminPerms):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`hasAdminPerms in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Get a list of all administrators and their boolean permission flags.
     * @returns Paired usernames and permissions, or an error code
     */
    async getAdminList(): Promise<{ username: string, permissions: number }[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT username, permissions FROM admins ORDER BY username ASC');
            for (const row of data.rows) {
                this.adminCache.set(row.username, {
                    permissions: row.permissions,
                    expiration: performance.now() + config.dbCacheTime
                });
            }
            return data.rows;
        } catch (err) {
            this.logger.handleError('Database error (getAdminList):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getAdminList in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Set the permission bit flags of an administrator, or add a new administrator. If permissions bit 0 is false (not admin), the administrator is removed.
     * @param username Valid username
     * @param permissions Permission flags, as a number (boolean OR)
     * @returns Write status
     */
    async setAdminPerms(username: string, permissions: number): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            if ((permissions & AdminPerms.ADMIN) == 0) {
                // delete instead
                await this.db.query('DELETE FROM admins WHERE username=$1', [username]);
                this.adminCache.delete(username);
            } else {
                const existing = await this.db.query('UPDATE admins SET permissions=$2 WHERE username=$1 RETURNING username', [username, permissions]);
                if (existing.rows.length == 0) await this.db.query('INSERT INTO admins (username, permissions) VALUES ($1, $2)', [username, permissions]);
                this.adminCache.set(username, {
                    permissions: permissions,
                    expiration: performance.now() + config.dbCacheTime
                });
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (setAdminPerms):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`setAdminPerms in ${performance.now() - startTime}ms`, true);
        }
    }

    private readonly contestCache: Map<string, { contest: Contest, expiration: number }> = new Map();
    /**
     * Read a list of all contest IDs that exist. Bypasses cache.
     * @returns List of contest IDs, or an error code
     */
    async getContestList(): Promise<string[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT id FROM contests ORDER BY id ASC');
            return data.rows.map((r) => r.id);
        } catch (err) {
            this.logger.handleError('Database error (getContestList):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getContestList in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Filter and get a list of contest data from the contests table according to a criteria.
     * @param c Filter criteria. Leaving one undefined removes the criteria
     * @returns Array of contest data matching the filter criteria, or an error code
     */
    async readContests(c: ReadContestsCriteria = {}): Promise<Contest[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const contestIdSet: Set<string> = new Set();
            // filter will break if ID and contest are used at same time
            if (c.id !== undefined) {
                if (typeof c.id == 'string') contestIdSet.add(c.id);
                else if (Array.isArray(c.id)) for (const contest of c.id) contestIdSet.add(contest);
                else if (c.id.op == '=') {
                    if (typeof c.id.v == 'string' && isUUID(c.id.v)) contestIdSet.add(c.id.v);
                    else c.id.v.filter(isUUID).forEach((pid) => contestIdSet.add(pid));
                }
            }
            const contests: Contest[] = [];
            for (const id of contestIdSet) {
                if (this.contestCache.has(id) && this.contestCache.get(id)!.expiration < performance.now()) this.contestCache.delete(id);
                if (this.contestCache.has(id)) {
                    contestIdSet.delete(id);
                    const contest = this.contestCache.get(id)!.contest;
                    if ((c.startTime === undefined || filterCompare<number>(contest.startTime, c.startTime)) && (c.endTime === undefined || filterCompare<number>(contest.endTime, c.endTime)) && (c.public === undefined || contest.public === c.public)) {
                        contests.push(structuredClone(contest));
                    }
                }
            }
            // list of uncached contests needed to be fetched from database (or "read everything" call)
            const contestIdList = Array.from(contestIdSet.values());
            if (contestIdList.length > 0 || c.id === undefined) {
                const { queryConditions, bindings } = this.buildColumnConditions([
                    { name: 'id', value: c.id !== undefined ? contestIdList : undefined },
                    { name: 'starttime', value: c.startTime },
                    { name: 'endtime', value: c.endTime },
                    { name: 'public', value: c.public },
                    { name: 'type', value: c.type }
                ]);
                const data = await this.db.query(`SELECT * FROM contests ${queryConditions} ORDER BY id ASC`, bindings);
                for (const contest of data.rows) {
                    const co: Contest = {
                        id: contest.id,
                        rounds: contest.rounds,
                        exclusions: contest.exclusions,
                        maxTeamSize: contest.maxteamsize,
                        startTime: Number(contest.starttime),
                        endTime: Number(contest.endtime),
                        public: contest.public,
                        type: contest.type
                    };
                    this.contestCache.set(contest.id, {
                        contest: structuredClone(co),
                        expiration: performance.now() + config.dbCacheTime
                    });
                    if (c.id === undefined || filterCompare<string>(co.id, c.id)) contests.push(co);
                }
            }
            return contests;
        } catch (err) {
            this.logger.handleError('Database error (readContests):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`readContests in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a contest to the contests table.
     * @param contest Contest to write
     * @returns Write status
     */
    async writeContest(contest: Contest): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = [contest.id, contest.rounds, contest.exclusions, contest.maxTeamSize, contest.startTime, contest.endTime, contest.public, contest.type];
            const update = await this.db.query('UPDATE contests SET rounds=$2, exclusions=$3, maxteamsize=$4, starttime=$5, endtime=$6, public=$7, type=$8 WHERE id=$1 RETURNING id', data);
            if (update.rows.length == 0) await this.db.query('INSERT INTO contests (id, rounds, exclusions, maxteamsize, starttime, endtime, public, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', data);
            this.contestCache.set(contest.id, {
                contest: structuredClone(contest),
                expiration: performance.now() + config.dbCacheTime
            });
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (writeContest):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`writeContest in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete a contest from the contests table.
     * @param id Contest to delete
     * @returns Deletion status
     */
    async deleteContest(id: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.db.query('DELETE FROM contests WHERE id=$1 RETURNING id', [id]);
            this.contestCache.delete(id);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (deleteContest):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`deleteContest in ${performance.now() - startTime}ms`, true);
        }
    }

    private readonly roundCache: Map<string, { round: Round, expiration: number }> = new Map();
    /**
     * Read a list of all round IDs that exist. Bypasses cache.
     * @returns List of round IDs, or an error code
     */
    async getRoundList(): Promise<string[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT id FROM rounds ORDER BY id ASC');
            return data.rows.map((r) => r.id);
        } catch (err) {
            this.logger.handleError('Database error (getRoundList):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getRoundList in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Filter and get a list of round data from the rounds table according to a criteria.
     * @param c Filter criteria. Leaving one undefined removes the criteria
     * @returns Array of round data matching the filter criteria, or an error code
     */
    async readRounds(c: ReadRoundsCriteria = {}): Promise<Round[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const roundIdSet: Set<string> = new Set();
            // filter will break if ID and contest are used at same time
            if (c.id !== undefined) {
                if (typeof c.id == 'string' && isUUID(c.id)) roundIdSet.add(c.id);
                else if (Array.isArray(c.id)) c.id.filter(isUUID).forEach((r) => roundIdSet.add(r));
                else if (c.id.op == '=') {
                    if (typeof c.id.v == 'string' && isUUID(c.id.v)) roundIdSet.add(c.id.v);
                    else c.id.v.filter(isUUID).forEach((pid) => roundIdSet.add(pid));
                }
            }
            if (c.contest !== undefined) {
                const contests = await this.readContests({ id: c.contest });
                if (contests == DatabaseOpCode.ERROR) return DatabaseOpCode.ERROR;
                contests.flatMap((c) => c.rounds).forEach((v, i) => {
                    if (c.round === undefined || filterCompare<number>(i, c.round)) roundIdSet.add(v);
                });
            }
            const rounds: Round[] = [];
            for (const id of roundIdSet) {
                if (this.roundCache.has(id) && this.roundCache.get(id)!.expiration < performance.now()) this.roundCache.delete(id);
                if (this.roundCache.has(id)) {
                    roundIdSet.delete(id);
                    const round = this.roundCache.get(id)!.round;
                    if ((c.startTime === undefined || filterCompare<number>(round.startTime, c.startTime)) && (c.endTime === undefined || filterCompare<number>(round.endTime, c.endTime))) {
                        rounds.push(structuredClone(round));
                    }
                }
            }
            // list of uncached rounds needed to be fetched from database (or "read everything" call)
            const roundIdList = Array.from(roundIdSet.values());
            if (roundIdList.length > 0 || (c.id === undefined && c.contest === undefined && c.round === undefined)) {
                const { queryConditions, bindings } = this.buildColumnConditions([
                    { name: 'id', value: (c.id !== undefined || c.contest !== undefined || c.round !== undefined) ? roundIdList : undefined },
                    { name: 'starttime', value: c.startTime },
                    { name: 'endtime', value: c.endTime }
                ]);
                const data = await this.db.query(`SELECT * FROM rounds ${queryConditions} ORDER BY id ASC`, bindings);
                for (const round of data.rows) {
                    const r: Round = {
                        id: round.id,
                        problems: round.problems,
                        startTime: Number(round.starttime),
                        endTime: Number(round.endtime)
                    };
                    this.roundCache.set(round.id, {
                        round: structuredClone(r),
                        expiration: performance.now() + config.dbCacheTime
                    });
                    // band-aid fix for filters borked by "contest"
                    if (c.id === undefined || filterCompare<UUID>(r.id, c.id)) rounds.push(r);
                }
            }
            return rounds;
        } catch (err) {
            this.logger.handleError('Database error (readRounds):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`readRounds in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a round to the rounds table.
     * @param round Round to write
     * @returns Write status
     */
    async writeRound(round: Round): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = [round.id, round.problems, round.startTime, round.endTime];
            const update = await this.db.query('UPDATE rounds SET problems=$2, starttime=$3, endtime=$4 WHERE id=$1 RETURNING id', data);
            if (update.rows.length == 0) await this.db.query('INSERT INTO rounds (id, problems, starttime, endtime) VALUES ($1, $2, $3, $4)', data);
            this.roundCache.set(round.id, {
                round: structuredClone(round),
                expiration: performance.now() + config.dbCacheTime
            });
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (writeRound):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`writeRound in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete a round from the round table.
     * @param id Round to delete
     * @returns Deletion status
     */
    async deleteRound(id: UUID): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.db.query('DELETE FROM rounds WHERE id=$1', [id]);
            this.roundCache.delete(id);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (deleteRound):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`deleteRound in ${performance.now() - startTime}ms`, true);
        }
    }

    private readonly problemCache: Map<string, { problem: Problem, expiration: number }> = new Map();
    /**
     * Read a list of all problem IDs that exist. Bypasses cache.
     * @returns List of problem IDs, or an error code
     */
    async getProblemList(): Promise<string[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT id FROM problems ORDER BY id ASC');
            return data.rows.map((r) => r.id);
        } catch (err) {
            this.logger.handleError('Database error (getProblemList):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getProblemList in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Filter and get a list of problems from the problems table according to a criteria.
     * @param c Filter criteria. Leaving one undefined removes the criteria
     * @returns Array of problems matching the filter criteria, or an error code
     */
    async readProblems(c: ReadProblemsCriteria = {}): Promise<Problem[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const problemIdSet: Set<string> = new Set();
            // filter will break if ID and contest are used at same time
            if (c.id !== undefined) {
                if (typeof c.id == 'string' && isUUID(c.id)) problemIdSet.add(c.id);
                else if (Array.isArray(c.id)) c.id.filter(isUUID).forEach((pid) => problemIdSet.add(pid));
                else if (c.id.op == '=') {
                    if (typeof c.id.v == 'string' && isUUID(c.id.v)) problemIdSet.add(c.id.v);
                    else c.id.v.filter(isUUID).forEach((pid) => problemIdSet.add(pid));
                }
            }
            if (c.contest !== undefined) {
                const rounds = await this.readRounds({
                    contest: c.contest.contest,
                    round: c.contest.round,
                    id: c.contest.roundId
                });
                if (rounds == DatabaseOpCode.ERROR) return DatabaseOpCode.ERROR;
                if (c.contest.number !== undefined) {
                    const n = c.contest.number;
                    if (typeof n == 'number') rounds.map((r) => r.problems[n]).filter(v => v !== undefined).forEach((v) => problemIdSet.add(v));
                    else rounds.flatMap((r) => r.problems.filter((v, i) => v !== undefined && filterCompare<number>(i, n))).forEach((v) => problemIdSet.add(v));
                }
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdSet.add(v));
            }
            const problems: Problem[] = [];
            for (const id of problemIdSet) {
                if (this.problemCache.has(id) && this.problemCache.get(id)!.expiration < performance.now()) this.problemCache.delete(id);
                if (this.problemCache.has(id)) {
                    problemIdSet.delete(id);
                    const problem = this.problemCache.get(id)!.problem;
                    if ((c.name === undefined || filterCompare<string>(problem.name, c.name)) && (c.author === undefined || filterCompare<string>(problem.author, c.author))) {
                        problems.push(structuredClone(problem));
                    }
                }
            }
            // list of uncached problems needed to be fetched from database (or "read everything" call)
            const problemIdList = Array.from(problemIdSet.values());
            if (problemIdList.length > 0 || (c.id === undefined && c.contest?.contest === undefined && c.contest?.round === undefined && c.contest?.roundId === undefined && c.contest?.number === undefined)) {
                const { queryConditions, bindings } = this.buildColumnConditions([
                    { name: 'id', value: (c.id !== undefined || c.contest !== undefined) ? problemIdList : undefined },
                    { name: 'name', value: c.name },
                    { name: 'author', value: c.author }
                ]);
                if (bindings.length == 0) this.logger.warn('Reading all problems from database! This could cause high resource usage and result in a crash! Is this a bug?');
                const data = await this.db.query(`SELECT * FROM problems ${queryConditions} ORDER BY id ASC`, bindings);
                for (const problem of data.rows) {
                    const p: Problem = {
                        id: problem.id,
                        name: problem.name,
                        author: problem.author,
                        content: problem.content,
                        constraints: problem.constraints,
                        solution: problem.solution
                    };
                    this.problemCache.set(problem.id, {
                        problem: structuredClone(p),
                        expiration: performance.now() + config.dbProblemCacheTime
                    });
                    // band-aid fix for filters borked by "contest"
                    if (c.id === undefined || filterCompare<UUID>(problem.id, c.id)) problems.push(p);
                }
            }
            return problems;
        } catch (err) {
            this.logger.handleError('Database error (readProblems):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`readProblems in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a problem to the problems table.
     * @param problem Problem to write
     * @returns Write status
     */
    async writeProblem(problem: Problem): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = [problem.id, problem.name, problem.content, problem.author, JSON.stringify(problem.constraints), problem.solution];
            const update = await this.db.query('UPDATE problems SET name=$2, content=$3, author=$4, constraints=$5, solution=$6 WHERE id=$1 RETURNING id', data);
            if (update.rows.length == 0) await this.db.query('INSERT INTO problems (id, name, content, author, constraints, solution) VALUES ($1, $2, $3, $4, $5, $6)', data);
            this.problemCache.set(problem.id, {
                problem: structuredClone(problem),
                expiration: performance.now() + config.dbProblemCacheTime
            });
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (writeProblem):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`writeProblem in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete a problem from the problems table.
     * @param id Problem to delete
     * @returns Deletion status
     */
    async deleteProblem(id: UUID): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.db.query('DELETE FROM problems WHERE id=$1', [id]);
            this.problemCache.delete(id);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (deleteProblem):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`deleteProblem in ${performance.now() - startTime}ms`, true);
        }
    }

    private readonly submissionCache: Map<string, { submission: Submission, expiration: number }> = new Map();
    /**
     * Read a list of all submission ID strings, created from problem ID, username, and analysis mode, like `problemId:username:analysis` that exist. Bypasses cache.
     * @returns List of submission ID strings, or an error code
     */
    async getSubmissionList(): Promise<string[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const data = await this.db.query('SELECT id, username, analysis FROM submissions ORDER BY username ASC, id ASC, analysis ASC');
            return data.rows.map((r) => `${r.id}:${r.username}:${r.analysis}`);
        } catch (err) {
            this.logger.handleError('Database error (getSubmissionList):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`getSubmissionList in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Filter and get a list of submissions from the submissions table according to a criteria.
     * @param c Filter criteria. Leaving one undefined removes the criteria
     * @returns Array of submissions matching the filter criteria, or an error code
     */
    async readSubmissions(c: ReadSubmissionsCriteria = {}): Promise<Submission[] | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const submissionIdSet: Set<string> = new Set();
            const problemIdSet: Set<string> = new Set();
            // filter will break if ID and contest are used at same time
            if (c.id !== undefined) {
                if (typeof c.id == 'string') submissionIdSet.add(c.id);
                else if (Array.isArray(c.id)) c.id.filter(isUUID).forEach((id) => submissionIdSet.add(id));
                else if (c.id.op == '=') {
                    if (typeof c.id.v == 'string' && isUUID(c.id.v)) submissionIdSet.add(c.id.v);
                    else c.id.v.filter(isUUID).forEach((pid) => submissionIdSet.add(pid));
                }
            }
            if (c.problemId !== undefined) {
                if (typeof c.problemId == 'string' && isUUID(c.problemId)) problemIdSet.add(c.problemId);
                else if (Array.isArray(c.problemId)) c.problemId.filter(isUUID).forEach((pid) => problemIdSet.add(pid));
                else if (c.problemId.op == '=') {
                    if (typeof c.problemId.v == 'string' && isUUID(c.problemId.v)) problemIdSet.add(c.problemId.v);
                    else c.problemId.v.filter(isUUID).forEach((pid) => problemIdSet.add(pid));
                }
            }
            if (c.contest !== undefined) {
                const rounds = await this.readRounds({
                    contest: c.contest.contest,
                    round: c.contest.round,
                    id: c.contest.roundId
                });
                if (rounds == DatabaseOpCode.ERROR) return DatabaseOpCode.ERROR;
                if (c.contest.number !== undefined) {
                    const n = c.contest.number;
                    if (typeof n == 'number') rounds.map((r) => r.problems[n]).filter(v => v !== undefined).forEach((v) => problemIdSet.add(v));
                    else rounds.flatMap((r) => r.problems.filter((v, i) => v !== undefined && filterCompare<number>(i, n))).forEach((v) => problemIdSet.add(v));
                }
                else rounds.flatMap((r) => r.problems).forEach((v) => problemIdSet.add(v));
            }
            const submissions: Submission[] = [];
            for (const id of submissionIdSet) {
                if (this.submissionCache.has(id) && this.submissionCache.get(id)!.expiration < performance.now()) this.submissionCache.delete(id);
                if (this.submissionCache.has(id)) {
                    submissionIdSet.delete(id);
                    const submission = this.submissionCache.get(id)!.submission;
                    if ((c.username === undefined || filterCompare<string>(submission.username, c.username))
                        && (c.team === undefined || filterCompare<string | null>(submission.team, c.team))
                        && (c.time === undefined || filterCompare<number>(submission.time, c.time))
                        && (c.analysis === undefined || filterCompare<boolean>(submission.analysis, c.analysis))) {
                        submissions.push(structuredClone(submission));
                    }
                }
            }
            // list of uncached submissions needed to be fetched from database (or "read everything" call)
            const submissionIdList = Array.from(submissionIdSet.values());
            const problemIdList = Array.from(problemIdSet.values());
            if (problemIdList.length > 0 || (c.problemId === undefined && c.contest?.contest === undefined && c.contest?.round === undefined && c.contest?.roundId === undefined && c.contest?.number === undefined)) {
                const { queryConditions, bindings } = this.buildColumnConditions([
                    { name: 'id', value: (c.id !== undefined) ? submissionIdList : undefined },
                    { name: 'problem', value: (c.problemId !== undefined || c.contest !== undefined) ? problemIdList : undefined },
                    { name: 'username', value: c.username },
                    { name: 'team', value: c.team },
                    { name: 'time', value: c.time },
                    { name: 'analysis', value: c.analysis }
                ]);
                if (bindings.length == 0) this.logger.warn('Reading all submissions from database! This could cause high resource usage and result in a crash! Is this a bug?');
                const data = await this.db.query(`SELECT * FROM submissions ${queryConditions} ORDER BY id ASC`, bindings);
                for (const submission of data.rows) {
                    const s: Submission = {
                        id: submission.id,
                        username: submission.username,
                        team: submission.team,
                        problemId: submission.problem,
                        time: Number(submission.time),
                        file: submission.file,
                        language: submission.language,
                        scores: submission.scores,
                        analysis: submission.analysis
                    };
                    this.submissionCache.set(s.id, {
                        submission: structuredClone(s),
                        expiration: performance.now() + config.dbCacheTime
                    });
                    // band-aid fix for filters borked by "contest"
                    if (c.problemId === undefined || filterCompare<UUID>(submission.problemId, c.problemId)) submissions.push(s);
                }
            }
            return submissions;
        } catch (err) {
            this.logger.handleError('Database error (readSubmissions):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`readSubmissions in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Write a submission to the submissions table. Will only overwrite scores for existing submissions.
     * @param submission Submission to write
     * @returns Write status
     */
    async writeSubmission(submission: Submission): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const existing = await this.db.query('SELECT id FROM submissions WHERE id=$1', [submission.id]);
            if (existing.rows.length > 0) {
                await this.db.query('UPDATE submissions SET scores=$2 WHERE id=$1');
                if (this.submissionCache.has(submission.id)) {
                    // this doesn't count as cache refresh, just patching cache here
                    const entry = this.submissionCache.get(submission.id)!;
                    entry.submission.scores = structuredClone(submission.scores);
                }
            } else {
                await this.db.query('INSERT INTO submissions (id, username, team, problem, file, language, scores, time, analysis) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
                    submission.id, submission.username, submission.team !== null ? parseInt(submission.team, 36) : null, submission.problemId, submission.file, submission.language, JSON.stringify(submission.scores), submission.time, submission.analysis
                ]);
                this.submissionCache.set(submission.id, {
                    submission: structuredClone(submission),
                    expiration: performance.now() + config.dbCacheTime
                });
                await this.purgeOldSubmissions(submission.username);
            }
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (writeSubmission):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`writeSubmission in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete all but the newest {@link config.maxSubmissionHistory} submissions for a user. Does not check user exists.
     * @param username Username to remove submissions from
     * @returns Deletion status
     */
    async purgeOldSubmissions(username: string): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            await this.db.query('DELETE FROM submissions WHERE id IN (SELECT id FROM submissions WHERE username=$1 ORDER BY time DESC OFFSET $2)', [
                username, config.maxSubmissionHistory
            ]);
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (purgeOldSubmissions):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`purgeOldSubmissions in ${performance.now() - startTime}ms`, true);
        }
    }
    /**
     * Delete a submission from the submission table.
     * @param id ID of submission to delete
     * @returns Deletion status
     */
    async deleteSubmission(id: UUID): Promise<DatabaseOpCode.SUCCESS | DatabaseOpCode.NOT_FOUND | DatabaseOpCode.ERROR> {
        const startTime = performance.now();
        try {
            const res = await this.db.query('DELETE FROM submissions WHERE id=$1 RETURNING id', [id]);
            this.problemCache.delete(id);
            if (res.rows.length == 0) return DatabaseOpCode.NOT_FOUND;
            return DatabaseOpCode.SUCCESS;
        } catch (err) {
            this.logger.handleError('Database error (deleteSubmission):', err);
            return DatabaseOpCode.ERROR;
        } finally {
            if (config.debugMode) this.logger.debug(`deleteSubmission in ${performance.now() - startTime}ms`, true);
        }
    }

    /**
     * Clears all database account, team, admin, contest, round, problem, and submission cache entries.
     */
    clearCache() {
        this.userCache.clear();
        this.teamCache.clear();
        this.adminCache.clear();
        this.contestCache.clear();
        this.roundCache.clear();
        this.problemCache.clear();
        this.submissionCache.clear();
        if (global.gc) global.gc();
        this.logger.debug('Cache cleared');
    }
}

export default Database;

export type SqlValue = number | string | boolean | null | number[] | string[] | boolean[] | null[];

/**Response codes for operations involving account data */
export enum DatabaseOpCode {
    /**The operation succeeded */
    SUCCESS = 200,
    /**The operation failed because the database found existing data that conflicts */
    CONFLICT = 409,
    /**The operation failed because the database could not find the requested data */
    NOT_FOUND = 404,
    /**The operation failed because of an authentication failure */
    UNAUTHORIZED = 401,
    /**The operation failed because the requested action is restricted*/
    FORBIDDEN = 403,
    /**The operation failed because of an unexpected issue */
    ERROR = 503
}

/**Admin permission level bit flags */
export enum AdminPerms {
    /**Base admin permission; allows login and general functions */
    ADMIN = 1,
    /**Create, read, edit, and delete accounts */
    MANAGE_ACCOUNTS = 1 << 1,
    /**Create, read, edit, and delete problems */
    MANAGE_PROBLEMS = 1 << 2,
    /**Create, read, edit, and delete contests and rounds */
    MANAGE_CONTESTS = 1 << 3,
    /**Access running contests through exposed ContestHost functions */
    CONTROL_CONTESTS = 1 << 4,
    /**Add admins and edit permissions for other admins */
    MANAGE_ADMINS = 1 << 30 // only 31 bits available due to js/pg working differently
}

/**Descriptor for an account */
export type AccountData = {
    /**Username */
    readonly username: string
    /**Email */
    email: string
    /**Parent and/or guardian email (or student's email again) */
    email2: string
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
    /**List of contests that have ended that were registered for */
    pastRegistrations: string[]
    /**ID of team, or null if not on any team */
    team: string | null
}
/**Descriptor for a team */
export type TeamData = {
    /**Unique team id, a base36 integer, postfixing with `joinKey` creates the join code */
    readonly id: string
    /**The name of the team */
    name: string
    /**Team's biography */
    bio: string
    /**List of usernames of team members */
    members: string[]
    /**List of registered contests */
    registrations: string[]
    /**A random 6-character alphanumeric string, prefixing with `id` creates the join code */
    joinKey: string
}

/**Descriptor for a single contest */
export type Contest = {
    /**Contest ID, also used as name */
    readonly id: string
    /**The tournament the contest is part of */
    type: string
    /**List of round UUIDs within the contest */
    rounds: UUID[]
    /**List of other contest ids that cannot be registered simultaneously */
    exclusions: string[]
    /**Maximum team size allowed to register */
    maxTeamSize: number
    /**Time of contest start, UNIX */
    startTime: number
    /**Time of contest end, UNIX */
    endTime: number
    /**If the contest is publicly archived once finished (problems remain accessible through upsolve) */
    public: boolean
}
/**Descriptor for a single round */
export type Round = {
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
export type Problem = {
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
    /**"Correct" answer used in contests with answer grading ({@link config.ContestConfiguration.submitSolver} is false) */
    solution: string | null
}
/**Descriptor for a single submission */
export type Submission = {
    /**UUID */
    readonly id: UUID
    /**Username of submitter */
    readonly username: string
    /**Team of submitter at the time of submission */
    readonly team: string | null
    /**UUID of problem submitted to */
    readonly problemId: UUID
    /**Time of submission, UNIX milliseconds */
    time: number
    /**Contents of the submission file */
    file: string
    /**Submission language */
    language: string
    /**Resulting scores of the submission */
    scores: Score[]
    /**If the submission was submitted through the upsolve system */
    analysis: boolean
}
/**Descriptor for the score of a single test case */
export type Score = {
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
    PASS = 1,
    INCORRECT = 2,
    TIME_LIM_EXCEEDED = 3,
    MEM_LIM_EXCEEDED = 4,
    RUNTIME_ERROR = 5,
    COMPILE_ERROR = 6
}

/**Criteria to filter by. Leaving a value undefined removes the criteria */
export type ReadContestsCriteria = {
    /**Contest ID */
    id?: FilterComparison<string>
    /**Start of contest, UNIX time */
    startTime?: FilterComparison<number>
    /**End of contest, UNIX time */
    endTime?: FilterComparison<number>
    /**If the contest is publicly archived once finished */
    public?: boolean
    /**The tournament the contest is part of */
    type?: string
}
/**Criteria to filter by. Leaving a value undefined removes the criteria */
export type ReadRoundsCriteria = {
    /**Contest ID */
    contest?: FilterComparison<string>
    /**Zero-indexed round within the contest */
    round?: FilterComparison<number>
    /**Round ID */
    id?: FilterComparison<UUID>
    /**Start of round, UNIX time */
    startTime?: FilterComparison<number>
    /**End of round, UNIX time */
    endTime?: FilterComparison<number>
}
/**Contest-based filter including contest, round, problem number, and round ID */
export type ProblemRoundCriteria = {
    /**Contest ID */
    contest?: FilterComparison<string>
    /**Zero-indexed round within the contest */
    round?: FilterComparison<number>
    /**Zero-indexed problem number within the round */
    number?: FilterComparison<number>
    /**Round ID (will break filters if used in conjunction with contest/round) */
    roundId?: FilterComparison<UUID>
}
/**Criteria to filter by. Leaving a value undefined removes the criteria */
export type ReadProblemsCriteria = {
    /**UUID of problem */
    id?: FilterComparison<UUID>
    /**Display name of problem */
    name?: FilterComparison<string>
    /**Author username of problem */
    author?: FilterComparison<string>
    /**{@inheritDoc ProblemRoundCriteria} */
    contest?: ProblemRoundCriteria
}
/**Criteria to filter by. Leaving a value undefined removes the criteria */
export type ReadSubmissionsCriteria = {
    /**UUID */
    id?: FilterComparison<UUID>
    /**Username of submitter */
    username?: FilterComparison<string>
    /**Username of submitter */
    team?: FilterComparison<string | null>
    /**UUID of problem */
    problemId?: FilterComparison<UUID>
    /**{@inheritDoc ProblemRoundCriteria} */
    contest?: ProblemRoundCriteria
    /**Time of submission */
    time?: FilterComparison<number>
    /**If the submission was submitted through the upsolve system */
    analysis?: boolean
}
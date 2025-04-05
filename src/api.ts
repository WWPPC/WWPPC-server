import { json as parseBodyJson } from 'body-parser';
import { Express } from 'express';

import ClientAuth from './auth';
import config from './config';
import Database, { DatabaseOpCode, Score } from './database';
import Mailer from './email';
import { defaultLogger, NamedLogger } from './log';
import { reverse_enum, sendDatabaseResponse, UUID, validateRequestBody } from './util';

/**
 * Bundles general API functions into a single class.
 */
export class ClientAPI {
    private static instance: ClientAPI | null = null;

    /**
     * Valid input values for fields within account data.
     */
    static readonly validAccountData = {
        languages: ['python', 'c', 'cpp', 'cs', 'java', 'js', 'sql', 'asm', 'php', 'swift', 'pascal', 'ruby', 'rust', 'scratch', 'g', 'ktx', 'lua', 'bash'] as const,
        grades: [8, 9, 10, 11, 12, 13, 14] as const,
        experienceLevels: [0, 1, 2, 3, 4] as const
    } as const;

    readonly db: Database;
    readonly app: Express;
    readonly mailer: Mailer;
    readonly logger: NamedLogger;

    private readonly clientConfig = {
        maxProfileImgSize: config.maxProfileImgSize,
        contests: Object.entries(config.contests).reduce<Record<string, object>>((p: Record<string, object>, [cId, cConfig]) => {
            if (cConfig === undefined) return p;
            p[cId] = {
                rounds: cConfig.rounds,
                submitSolver: cConfig.submitSolver,
                acceptedSolverLanguages: cConfig.acceptedSolverLanguages,
                maxSubmissionSize: cConfig.maxSubmissionSize
            };
            return p;
        }, {})
    };

    private constructor(db: Database, app: Express, mailer: Mailer) {
        this.db = db;
        this.app = app;
        this.mailer = mailer;
        this.logger = new NamedLogger(defaultLogger, 'ClientAPI');
        this.createEndpoints();
    }

    private createEndpoints() {
        // always public
        this.app.get('/api/config', (req, res) => res.json(this.clientConfig));
        this.app.get('/api/userData/:username', async (req, res) => {
            const data = await this.db.getAccountData(req.params.username);
            if (typeof data == 'object') {
                if (config.debugMode) this.logger.debug(`${req.path}: SUCCESS (${req.ip})`);
                // some info we don't want public
                data.email = '';
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/api/teamData/:username', async (req, res) => {
            const data = await this.db.getTeamData(req.params.username);
            if (typeof data == 'object') {
                if (config.debugMode) this.logger.debug(`${req.path}: SUCCESS (${req.ip})`);
                // some info we don't want public
                data.joinKey = '';
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        // add email list unsubscribe endpoint for CAN-SPAM act compliance
        this.app.get('/api/coffee', (req, res) => {
            this.logger.warn(`Attempt to brew coffee using teapot (${req.ip})`);
            res.sendStatus(418);
        });
        // account & team management
        const auth = ClientAuth.use();
        const sessionUsername = Symbol('username');
        this.app.use('/api/self/*', (req, res, next) => {
            if (auth.isTokenValid(req.cookies.sessionToken)) {
                // save username so don't have to check if token disappeared between this and later handlers
                req.cookies[sessionUsername] = auth.getTokenUsername(req.cookies.sessionToken)!;
                next();
            } else {
                sendDatabaseResponse(req, res, DatabaseOpCode.UNAUTHORIZED, {}, this.logger);
            }
        });
        this.app.get('/api/self/userData', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const data = await this.db.getAccountData(username);
            if (typeof data == 'object') {
                if (config.debugMode) this.logger.debug(`${req.path}: SUCCESS (${req.ip})`);
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger, username);
        });
        this.app.put('/api/self/userData', parseBodyJson(), validateRequestBody({
            firstName: 'required|string|length:32,1',
            lastName: 'required|string|length:32,1',
            displayName: 'required|string|length:64,1',
            profileImage: `required|mime:jpg,png,webp|size:${config.maxProfileImgSize}`,
            bio: 'required|string|length:2048',
            school: 'required|string|length:64,1',
            languages: 'required|arrayUnique|length:32',
            'languages.*': `required|string|in:${ClientAPI.validAccountData.languages.join()}`,
            grade: `required|integer|in:${ClientAPI.validAccountData.grades.join()}`,
            experience: `required|integer|in:${ClientAPI.validAccountData.experienceLevels.join()}`
        }, this.logger), async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const check = await this.db.updateAccountData(username, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.displayName,
                profileImage: req.body.profileImage,
                bio: req.body.bio,
                school: req.body.school,
                languages: req.body.languages,
                grade: req.body.grade,
                experience: req.body.experience
            });
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.get('/api/self/teamData', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const data = await this.db.getTeamData(username);
            if (typeof data == 'object') {
                if (config.debugMode) this.logger.debug(`${req.path}: SUCCESS (${req.ip})`);
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger, username);
        });
        this.app.put('/api/self/teamData', parseBodyJson(), validateRequestBody({
            teamName: 'required|string|length:32,1',
            teamBio: 'required|string|length:1024'
        }, this.logger), async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const check = await this.db.updateTeamData(username, {
                name: req.body.teamName,
                bio: req.body.teamBio
            });
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.post('/api/self/team', parseBodyJson(), validateRequestBody({
            name: `required|string|length:32,1`
        }), async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            // create & join new team
            const existing = await this.db.getAccountTeam(username);
            if (existing !== null) {
                if (typeof existing == 'string') {
                    if (config.debugMode) this.logger.debug(`${req.path}: Cannot create team while on a team (${username}, ${req.ip})`);
                    res.status(403).send('Cannot create team while on a team');
                } else sendDatabaseResponse(req, res, existing, {}, this.logger, username, 'Check team');
                return;
            }
            const teamId = await this.db.createTeam(req.body.name);
            if (typeof teamId != 'string') {
                sendDatabaseResponse(req, res, teamId, {}, this.logger, username, 'Create team');
                return;
            }
            const check = await this.db.setAccountTeam(username, teamId);
            sendDatabaseResponse(req, res, check, { [DatabaseOpCode.NOT_FOUND]: 'Team not found after creation' }, this.logger, username, 'Set team');
        });
        this.app.put('/api/self/team', parseBodyJson(), validateRequestBody({
            code: `required|alphaDash|length:${Database.teamJoinKeyLength + 6},${Database.teamJoinKeyLength + 1}`
        }), async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const joinCode = req.body.code as string;
            // join existing team
            const existing = await this.db.getAccountTeam(username);
            if (existing !== null) {
                if (typeof existing == 'string') {
                    if (config.debugMode) this.logger.debug(`${req.path}: Cannot join team while on a team (${username}, ${req.ip})`);
                    res.status(403).send('Cannot join team while on a team');
                } else sendDatabaseResponse(req, res, existing, {}, this.logger, username, 'Check team');
                return;
            }
            const teamId = joinCode.substring(0, joinCode.length - Database.teamJoinKeyLength);
            const joinKey = joinCode.substring(joinCode.length - Database.teamJoinKeyLength);
            const teamData = await this.db.getTeamData(teamId);
            if (typeof teamData != 'object') {
                sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check team');
                return;
            }
            if (teamData.joinKey != joinKey) {
                if (config.debugMode) this.logger.debug(`${req.path}: Not found (incorrect join key) (${username}, ${req.ip})`);
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check team');
            }
            // make sure doesn't violate registration restrictions
            const contests = await this.db.readContests({ id: teamData.registrations });
            if (typeof contests != 'object') {
                sendDatabaseResponse(req, res, contests, {}, this.logger, username, 'Check team');
                return;
            }
            for (const contest of contests) {
                if (teamData.members.length >= contest.maxTeamSize) {
                    sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, {[DatabaseOpCode.FORBIDDEN]: 'Forbidden by registrations'}, this.logger, username, 'Check team');
                    return;
                }
            }
            const check = await this.db.setAccountTeam(username, teamId);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set team');
        });
        this.app.delete('/api/self/team', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            // leave current team
            const existing = await this.db.getAccountTeam(username);
            if (typeof existing != 'string') {
                if (existing === null) {
                    if (config.debugMode) this.logger.debug(`${req.path}: Cannot leave team without a team (${username}, ${req.ip})`);
                    res.status(403).send('Cannot leave team without a team');
                } else sendDatabaseResponse(req, res, existing, {}, this.logger, username, 'Check team');
                return;
            }
            const check = await this.db.setAccountTeam(username, null);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Leave team');
            // deletion check is only a warning, extra teams have no impact and can be removed later
            const teamData = await this.db.getTeamData(existing);
            if (typeof teamData != 'object') {
                this.logger.warn(`${req.path}: Empty team check failed: ${reverse_enum(DatabaseOpCode, teamData)} - leftover empty team may remain`);
                return;
            }
            if (teamData.members.length == 0) {
                const delCheck = await this.db.deleteTeam(teamData.id);
                if (delCheck != DatabaseOpCode.SUCCESS) this.logger.warn(`${req.path}: Empty team check failed: ${reverse_enum(DatabaseOpCode, teamData)} - leftover empty team may remain`);
                else if (config.debugMode) this.logger.debug(`${req.path}: Removed empty team after leaving`);
            }
        });
        this.app.delete('/api/self/team/:member', async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const member = req.params.member;
            if (username == member) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, { [DatabaseOpCode.FORBIDDEN]: 'Cannot kick self' }, this.logger, username);
                return;
            }
            const selfTeam = await this.db.getAccountTeam(username);
            const memberTeam = await this.db.getAccountTeam(member);
            if (typeof selfTeam != 'string' && selfTeam !== null) {
                sendDatabaseResponse(req, res, selfTeam, {}, this.logger, username, 'Check team');
                return;
            }
            if (typeof memberTeam != 'string' && memberTeam !== null) {
                sendDatabaseResponse(req, res, memberTeam, {}, this.logger, username, 'Check team');
                return;
            }
            if (memberTeam != selfTeam) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, { [DatabaseOpCode.NOT_FOUND]: 'User not on team' }, this.logger, username, 'Set team');
                return;
            }
            const check = await this.db.setAccountTeam(member, null);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set team');
        });
        // reserve the /api/self path
        this.app.use('/api/self/*', (req, res) => res.sendStatus(404));
    }

    /**
     * Initialize the client API.
     * @param db Database connection
     * @param app Express app (HTTP server) to attach API to
     * @param mailer SMTP mailing server connection
     */
    static init(db: Database, app: Express, mailer: Mailer): ClientAPI {
        return this.instance = this.instance ?? new ClientAPI(db, app, mailer);
    }

    /**
     * Get the client API instance.
     */
    static use(): ClientAPI {
        if (this.instance === null) throw new TypeError('ClientAPI init() must be called before use()');
        return this.instance;
    }
}

/**Descriptor for a single contest as represented by the client */
export type ClientContest = {
    readonly id: string
    type: string
    rounds: ClientRound[]
    startTime: number
    endTime: number
}
/**Descriptor for a single round as represented by the client */
export type ClientRound = {
    readonly contest: string
    readonly round: number
    problems: UUID[]
    startTime: number
    endTime: number
}
/**Descriptor for a single problem as represented by the client */
export type ClientProblem = {
    readonly id: UUID
    readonly contest: string
    readonly round: number
    readonly number: number
    name: string
    author: string
    content: string
    constraints: {
        time: number
        memory: number
    }
}
/**Descriptor for a single submission as represented by the client */
export type ClientSubmission = {
    time: number
    language: string
    scores: Score[]
    status: ClientProblemCompletionState
    analysis: boolean
}
/**Client enum for completion state of problems */
export enum ClientProblemCompletionState {
    /**Not attempted */
    NOT_UPLOADED = 0,
    /**Uploaded but not graded, can still be changed */
    UPLOADED = 1,
    /**Submitted but not graded, submissions locked */
    SUBMITTED = 2,
    /**Submitted, graded, and failed all subtasks */
    GRADED_FAIL = 3,
    /**Submitted, graded, passed at least one subtask and failed at least one subtask */
    GRADED_PARTIAL = 4,
    /**Submitted, graded, and passed all subtasks */
    GRADED_PASS = 5
}

export default ClientAPI;
import { json as parseBodyJson } from 'body-parser';
import { Express, NextFunction, Request, Response } from 'express';

import ClientAuth from './auth';
import config from './config';
import Database, { DatabaseOpCode, Score } from './database';
import Mailer from './email';
import { defaultLogger, NamedLogger } from './log';
import { reverse_enum, UUID } from './util';
import { sendDatabaseResponse, rateLimitWithTrigger, validateRequestBody } from './netUtil';

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
                restrictiveRounds: cConfig.restrictiveRounds,
                scoreFreezeTime: cConfig.scoreFreezeTime,
                withholdResults: cConfig.withholdResults,
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

    /**
     * Create HTTP endpoints
     */
    private createEndpoints() {
        const auth = ClientAuth.use();
        // always public
        this.app.get('/api/config', (req, res) => res.json(this.clientConfig));
        this.app.get('/api/userData/:username', async (req, res) => {
            const data = await this.db.getAccountData(req.params.username);
            if (typeof data == 'object') {
                if (config.debugMode) this.logger.debug(`${req.ip} | ${req.method} ${req.path}: SUCCESS`);
                // some info we don't want public
                data.email = '';
                data.email2 = '';
                // maybe also filter out pastRegistrations from hidden contests?
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        this.app.get('/api/teamData/:id', async (req, res) => {
            const teamId = parseInt(req.params.id);
            if (isNaN(teamId)) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid team ID (${req.ip})`);
                res.status(400).send('Invalid team ID');
                return;
            }
            const data = await this.db.getTeamData(teamId);
            if (typeof data == 'object') {
                if (config.debugMode) this.logger.debug(`${req.ip} | ${req.method} ${req.path}: SUCCESS`);
                // some info we don't want public
                data.joinKey = '';
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger);
        });
        // add email list unsubscribe endpoint for CAN-SPAM act compliance
        this.app.get('/api/coffee', rateLimitWithTrigger({
            windowMs: 10000,
            limit: 5,
            message: 'Do you not get the hint? I can\'t brew coffee, I\m a teapot!'
        }, (req, res) => this.logger.warn(`Excessive requests for coffee from ${req.ip}`)), (req, res) => {
            res.status(418).send('I\'m a teapot');
        });
        // account & team management
        const sessionUsername = Symbol('username');
        const sessionTeam = Symbol('team');
        const getTeam = async (req: Request, res: Response, next: NextFunction) => {
            const username = req.cookies[sessionUsername as any] as string;
            const team = await this.db.getAccountTeam(username);
            if (team !== null && typeof team != 'number') {
                sendDatabaseResponse(req, res, team, {}, this.logger, username, 'Get team');
                return;
            }
            req.cookies[sessionTeam as any] = team;
            next();
        };
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
                if (config.debugMode) this.logger.debug(`${username} @ ${req.ip} | ${req.method} ${req.path}: SUCCESS`);
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger, username);
        });
        this.app.put('/api/self/userData', parseBodyJson(), validateRequestBody({
            email2: 'encryptedEmail-auth',
            firstName: 'required|string|length:32,1',
            lastName: 'required|string|length:32,1',
            displayName: 'required|string|length:64,1',
            profileImage: `required|base64Mime:jpg,png,webp|base64Size:${config.maxProfileImgSize}`,
            bio: 'string|length:2048',
            organization: 'string|length:64',
            languages: 'arrayUnique|length:32',
            'languages.*': `required|string|in:${ClientAPI.validAccountData.languages.join()}`,
            grade: `required|integer|in:${ClientAPI.validAccountData.grades.join()}`,
            experience: `required|integer|in:${ClientAPI.validAccountData.experienceLevels.join()}`
        }, this.logger), async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const email2 = req.body.email2 != undefined ? await auth.encryption.decrypt(req.body.email2) : '';
            if (email2 === null) {
                this.logger.error(`${req.method} ${req.path} fail: email decrypt failed after verification`);
                res.status(503).send('Email decryption error');
                return;
            }
            const check = await this.db.updateAccountData(username, {
                email2: email2,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.displayName,
                profileImage: req.body.profileImage,
                bio: req.body.bio ?? '',
                organization: req.body.organization ?? '',
                languages: req.body.languages,
                grade: req.body.grade,
                experience: req.body.experience
            });
            sendDatabaseResponse(req, res, check, {}, this.logger, username);
        });
        this.app.get('/api/self/teamData', getTeam, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number | null;
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, 'Not on a team', this.logger, username, 'Get team');
                return;
            }
            const data = await this.db.getTeamData(team);
            if (typeof data == 'object') {
                if (config.debugMode) this.logger.debug(`${username} @ ${req.ip} | ${req.method} ${req.path}: SUCCESS`);
                res.json(data);
            } else sendDatabaseResponse(req, res, data, {}, this.logger, username, 'Get data');
        });
        this.app.put('/api/self/teamData', parseBodyJson(), validateRequestBody({
            name: 'required|string|length:32,1',
            bio: 'string|length:1024'
        }, this.logger), getTeam, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number | null;
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, 'Not on a team', this.logger, username, 'Get team');
                return;
            }
            const check = await this.db.updateTeamData(team, {
                name: req.body.name,
                bio: req.body.bio ?? ''
            });
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set data');
        });
        this.app.post('/api/self/team', parseBodyJson(), validateRequestBody({
            name: `required|string|length:32,1`
        }), getTeam, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number | null;
            // create & join new team
            if (team !== null && team !== undefined) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Cannot create team while on a team', this.logger, username, 'Check team');
                return;
            }
            const teamId = await this.db.createTeam(req.body.name);
            if (typeof teamId != 'number') {
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
            const team = req.cookies[sessionTeam] as number | null;
            const joinCode = req.body.code as string;
            // join existing team
            if (team !== null && team !== undefined) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Cannot join team while on a team', this.logger, username, 'Check team');
                return;
            }
            const teamId = parseInt(joinCode.substring(0, joinCode.length - Database.teamJoinKeyLength), 36);
            if (isNaN(teamId)) {
                if (config.debugMode) this.logger.warn(`${req.method} ${req.path} malformed: Invalid team ID (${req.ip})`);
                res.status(400).send('Invalid team ID');
                return;
            }
            const joinKey = joinCode.substring(joinCode.length - Database.teamJoinKeyLength);
            const teamData = await this.db.getTeamData(teamId);
            if (typeof teamData != 'object') {
                sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check team');
                return;
            }
            if (teamData.joinKey.toUpperCase() != joinKey.toUpperCase()) {
                if (config.debugMode) this.logger.debug(`${username} @ ${req.ip} | ${req.method} ${req.path}: Incorrect join key`);
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Check team');
                return;
            }
            // make sure doesn't violate registration restrictions
            const contests = await this.db.readContests({ id: teamData.registrations });
            if (typeof contests != 'object') {
                sendDatabaseResponse(req, res, contests, {}, this.logger, username, 'Check team');
                return;
            }
            for (const contest of contests) {
                if (teamData.members.length >= contest.maxTeamSize) {
                    sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Forbidden by registrations', this.logger, username, 'Check team');
                    return;
                }
            }
            const check = await this.db.setAccountTeam(username, teamId);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set team');
        });
        this.app.delete('/api/self/team', getTeam, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number | null;
            // leave current team
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Cannot leave team without a team', this.logger, username, 'Check team');
                return;
            }
            const check = await this.db.setAccountTeam(username, null);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Leave team');
            // deletion check is only a warning, extra teams have no impact and can be removed later
            const teamData = await this.db.getTeamData(team);
            if (typeof teamData != 'object') {
                this.logger.warn(`${req.method} ${req.path}: Empty team check failed: ${reverse_enum(DatabaseOpCode, teamData)} - leftover empty team may remain`);
                return;
            }
            if (teamData.members.length == 0) {
                const delCheck = await this.db.deleteTeam(teamData.id);
                if (delCheck != DatabaseOpCode.SUCCESS) this.logger.warn(`${req.method} ${req.path}: Empty team check failed: ${reverse_enum(DatabaseOpCode, teamData)} - leftover empty team may remain`);
                else if (config.debugMode) this.logger.debug(`${req.method} ${req.path}: Removed empty team after leaving`);
            }
        });
        this.app.delete('/api/self/team/:member', getTeam, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number | null;
            const member = req.params.member;
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Cannot kick member while not on a team', this.logger, username, 'Get team');
                return;
            }
            if (username == member) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Cannot kick self', this.logger, username);
                return;
            }
            const memberTeam = await this.db.getAccountTeam(member);
            if (typeof memberTeam != 'number' && memberTeam !== null) {
                sendDatabaseResponse(req, res, memberTeam, {}, this.logger, username, 'Check team');
                return;
            }
            if (memberTeam != team) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, 'User not on team', this.logger, username, 'Set team');
                return;
            }
            const check = await this.db.setAccountTeam(member, null);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set team');
        });
        this.app.post('/api/self/registrations/:contest', getTeam, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number | null;
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Cannot register without a team', this.logger, username, 'Get team');
                return;
            }
            const contestRes = await this.db.readContests({ id: req.params.contest });
            if (!Array.isArray(contestRes)) {
                sendDatabaseResponse(req, res, contestRes, {}, this.logger, username, 'Fetch contest');
                return;
            }
            if (contestRes.length != 1) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, {}, this.logger, username, 'Fetch contest');
                return;
            }
            const contest = contestRes[0];
            if (Date.now() >= contest.endTime) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, {}, this.logger, username, 'Fetch contest');
                return;
            }
            if (contest.hidden) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, {}, this.logger, username, 'Fetch contest');
                return;
            }
            const teamData = await this.db.getTeamData(team);
            if (typeof teamData != 'object') {
                sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check contest');
                return;
            }
            if (teamData.members.length > contest.maxTeamSize) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Too many team members; max size ' + contest.maxTeamSize, this.logger, username, 'Check contest');
                return;
            }
            const restrictedContestRes = await this.db.readContests({ id: contest.exclusions });
            if (!Array.isArray(restrictedContestRes)) {
                sendDatabaseResponse(req, res, restrictedContestRes, {}, this.logger, username, 'Check contest');
                return;
            }
            if (restrictedContestRes.some((contest) => teamData.registrations.includes(contest.id))) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Conflict with existing registrations', this.logger, username, 'Check contest');
                return;
            }
            const check = await this.db.registerContest(team, contest.id);
            sendDatabaseResponse(req, res, check, { [DatabaseOpCode.CONFLICT]: 'Already registered for contest' }, this.logger, username, 'Set registration');
        });
        this.app.delete('/api/self/registrations/:contest', getTeam, async (req, res) => {
            const username = req.cookies[sessionUsername] as string;
            const team = req.cookies[sessionTeam] as number | null;
            if (team === null) {
                sendDatabaseResponse(req, res, DatabaseOpCode.FORBIDDEN, 'Cannot unregister without a team', this.logger, username, 'Get team');
                return;
            }
            const teamData = await this.db.getTeamData(team);
            if (typeof teamData != 'object') {
                sendDatabaseResponse(req, res, teamData, {}, this.logger, username, 'Check team');
                return;
            }
            if (!teamData.registrations.includes(req.params.contest)) {
                sendDatabaseResponse(req, res, DatabaseOpCode.NOT_FOUND, 'Not registered', this.logger, username, 'Check team');
                return;
            }
            const check = await this.db.unregisterContest(team, req.params.contest);
            sendDatabaseResponse(req, res, check, {}, this.logger, username, 'Set registration');

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

export default ClientAPI;

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
/**Descriptor for a single submission in abridged submission list as represented by the client */
export type ClientSubmission = {
    id: string
    time: number
    language: string
    scores: Score[]
    status: ClientProblemCompletionState
    analysis: boolean
}
/**Descriptor for a single submission with all fields as represented by the client */
export type ClientSubmissionFull = ClientSubmission & {
    username: string
    team: number | null
    problemId: UUID
    file: string
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
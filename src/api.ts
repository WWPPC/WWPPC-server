import { Express } from 'express';

import Database, { AccountOpResult, TeamOpResult } from './database';
import Logger, { defaultLogger, NamedLogger } from './log';
import config from './config';

/**
 * Bundles general API functions into a single class.
 */
export class ClientAPI {
    private static instance: ClientAPI | null = null;

    readonly db: Database;
    readonly app: Express;
    readonly logger: NamedLogger;

    private readonly clientConfig = {
        maxProfileImgSize: config.maxProfileImgSize,
        contests: Object.entries(config.contests).reduce<Record<string, object>>((p: Record<string, object>, [cId, cConfig]) => {
            if (cConfig == undefined) return p;
            p[cId] = {
                rounds: cConfig.rounds,
                submitSolver: cConfig.submitSolver,
                acceptedSolverLanguages: cConfig.acceptedSolverLanguages,
                maxSubmissionSize: cConfig.maxSubmissionSize
            };
            return p;
        }, {})
    };

    private constructor(db: Database, app: Express) {
        this.db = db;
        this.app = app;
        this.logger = new NamedLogger(defaultLogger, 'ClientAPI');
        this.createEndpoints();
    }

    private createEndpoints() {
        this.app.get('/api/config', (req, res) => res.json(this.clientConfig));
        this.app.get('/api/userData/:username', async (req, res) => {
            const data = await this.db.getAccountData(req.params.username);
            if (data == AccountOpResult.NOT_EXISTS) res.sendStatus(404);
            else if (data == AccountOpResult.ERROR) res.sendStatus(500);
            else {
                // some info we don't want public
                const data2 = structuredClone(data);
                data2.email = '';
                res.json(data2);
            }
        });
        this.app.get('/api/teamData/:username', async (req, res) => {
            const data = await this.db.getTeamData(req.params.username);
            if (data == TeamOpResult.NOT_EXISTS) res.sendStatus(404);
            else if (data == TeamOpResult.ERROR) res.sendStatus(500);
            else {
                // some info we don't want public
                const data2 = structuredClone(data);
                data2.joinCode = '';
                res.json(data2);
            }
        });
    }

    /**
     * Initialize the client API.
     * @param {Database} db Database connection
     * @param {Express} app Express app (HTTP server) to attach API to
     */
    static init(db: Database, app: Express): ClientAPI {
        return this.instance = this.instance ?? new ClientAPI(db, app);
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
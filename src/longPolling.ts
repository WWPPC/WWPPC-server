import { Express, Response } from 'express';
import { ElementOf } from './util';

type ForceLiteralArray<T> = T extends string[] ? string[] extends T ? never : T : never

/**
 * Handles long-polling HTTP events on an Express application.
 */
export class LongPollEventEmitter<EventList extends readonly string[] = []> {
    readonly app: Express;
    private readonly eventList: ForceLiteralArray<EventList>;
    private readonly eventWaiters: Map<ElementOf<typeof this.eventList>, Set<Response>> = new Map();
    private readonly eventInitialData: Map<ElementOf<typeof this.eventList>, any> = new Map();
    private readonly knownClients: Set<string> = new Set();
    readonly timeoutMs: number;

    /**
     * @param {express} app Express app (HTTP server) to attach events to
     * @param {string} path URI path to place all events under (`path/event`)
     * @param {string[]} events List of GET endpoint events to create, must not contain subpaths
     *          (Array must have "as const" declaration so TypeScript can enforce event types for `emit`)
     * @param {number} timeoutMs Time in milliseconds before a long-polling request will resolve with
     *          an empty response (Higher values may cause issues with some browsers; default: 10000)
     */
    constructor(app: Express, path: string, events: typeof this.eventList, timeoutMs?: number) {
        this.app = app;
        this.eventList = events;
        this.timeoutMs = timeoutMs ?? 10000;
        const normPath = path.endsWith('/') ? path : path + '/';
        for (const ev of this.eventList) {
            if (ev.includes('/')) throw new TypeError('Event names cannot contain paths');
            const waiting: Set<Response> = new Set();
            const ev2 = ev as ElementOf<typeof this.eventList>;
            this.eventWaiters.set(ev2, waiting);
            app.get(normPath + ev, (req, res) => {
                const cid = req.headers['X-polling-id'];
                if (typeof cid != 'string') {
                    res.sendStatus(400);
                    return;
                }
                // initial request ensures client has data even if an update hasn't occured, unless no data
                if (!this.knownClients.has(cid)) {
                    this.knownClients.add(cid);
                    const dat = this.eventInitialData.get(ev2);
                    if (dat !== undefined) {
                        res.send(dat);
                        return;
                    }
                }
                waiting.add(res);
                // eventually times out after some time
                setTimeout(() => {
                    waiting.delete(res);
                    if (!res.closed) res.sendStatus(204);
                }, this.timeoutMs);
            });
        }
    }

    emit(ev: ElementOf<typeof this.eventList>, data: any): void {
        const waiting = this.eventWaiters.get(ev);
        if (waiting === undefined) throw new TypeError('Cannot emit event not in event list');
        this.eventInitialData.set(ev, data);
        for (const res of waiting) {
            res.send(data);
        }
        waiting.clear();
    }
}
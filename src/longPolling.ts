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

    /**
     * @param {express} app Express app (HTTP server) to attach events to
     * @param {string} path URI path to place all events under (`path/event`)
     * @param {string[]} events List of GET endpoint events to create, must not contain subpaths
     *                          (Array must have "as const" declaration so TypeScript can
     *                          enforce event types for `emit`)
     */
    constructor(app: Express, path: string, events: typeof this.eventList) {
        this.app = app;
        this.eventList = events;
        const normPath = path.endsWith('/') ? path : path + '/';
        for (const ev of this.eventList) {
            if (ev.includes('/')) throw new TypeError('Event names cannot contain paths');
            this.eventWaiters.set(ev as ElementOf<typeof this.eventList>, new Set());
            // anything other than GET doesn't make sense
            app.get(normPath + ev, (req, res) => this.eventWaiters.get(ev as ElementOf<typeof this.eventList>)!.add(res));
        }
    }

    emit(ev: ElementOf<typeof this.eventList>, data: any) {
        const waiting = this.eventWaiters.get(ev);
        if (waiting === undefined) throw new TypeError('Cannot emit event not in event list');
        for (const res of waiting) {
            res.send(data);
        }
        waiting.clear();
    }
}
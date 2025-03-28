import { Express, Response } from 'express';
import { ElementOf } from './util';

type ForceLiteralArray<T> = T extends string[] ? string[] extends T ? never : T : never

/**
 * Handles long-polling HTTP events on an Express application.
 */
export class LongPollEventEmitter<EventList extends readonly string[] = []> {
    readonly app: Express;
    private readonly eventList: ForceLiteralArray<EventList>;
    private readonly eventWaiters: Map<ElementOf<ForceLiteralArray<EventList>>, Set<Response>> = new Map();
    private readonly eventInitialData: Map<ElementOf<ForceLiteralArray<EventList>>, any> = new Map();
    private readonly knownClients: Set<string> = new Set();
    readonly timeoutMs: number;
    private open = true;

    /**
     * @param app Express app (HTTP server) to attach events to
     * @param path URI path to place all events under (`path/event`)
     * @param events List of GET endpoint events to create, must not contain subpaths
     *          (Array must have "as const" declaration so TypeScript can enforce event types for `emit`)
     * @param timeoutMs Time in milliseconds before a long-polling request will resolve with
     *          an empty response (Higher values may cause issues with some browsers; default: 10000)
     */
    constructor(app: Express, path: string, events: ForceLiteralArray<EventList>, timeoutMs?: number) {
        this.app = app;
        this.eventList = events;
        this.timeoutMs = timeoutMs ?? 10000;
        const normPath = path.endsWith('/') ? path : path + '/';
        for (const ev of this.eventList) {
            if (ev.includes('/')) throw new TypeError('Event names cannot contain paths');
            const ev2 = ev as ElementOf<ForceLiteralArray<EventList>>;
            const waiting: Set<Response> = new Set();
            this.eventWaiters.set(ev2, waiting);
            app.get(normPath + ev, (req, res, next) => {
                if (!this.open) {
                    next();
                    return;
                }
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

    /**
     * Emit an event with new data.
     * @param ev Event name
     * @param data Updated data
     */
    emit(ev: ElementOf<ForceLiteralArray<EventList>>, data: any): void {
        const waiting = this.eventWaiters.get(ev);
        if (waiting === undefined) throw new TypeError('Cannot emit event not in event list');
        this.eventInitialData.set(ev, data);
        for (const res of waiting) {
            res.send(data);
        }
        waiting.clear();
    }

    /**
     * Timeout all waiting requests and stop accepting new requests.
     */
    close(): void {
        this.open = false;
        for (const waiting of this.eventWaiters.values()) {
            for (const res of waiting) {
                res.sendStatus(204);
            }
            waiting.clear();
        }
    }
}

/**
 * Handles long-polling HTTP events on an Express application. Adds support for dynamically
 * created/deleted namespaces under the base path. Namespaces have isolated event spaces within,
 * and can be created/deleted at any point.
 */
export class NamespacedLongPollEventEmitter<EventList extends readonly string[] = []> {
    readonly app: Express;
    private readonly eventList: ForceLiteralArray<EventList>;
    private readonly eventWaiters: Map<string, Map<ElementOf<ForceLiteralArray<EventList>>, Set<Response>>> = new Map();
    private readonly eventInitialData: Map<string, Map<ElementOf<ForceLiteralArray<EventList>>, any>> = new Map();
    private readonly knownClients: Set<string> = new Set();
    readonly timeoutMs: number;
    private open = true;

    /**
     * @param app Express app (HTTP server) to attach events to
     * @param path URI path to place all events under (`path/event`)
     * @param events List of GET endpoint events to create, must not contain subpaths
     *          (Array must have "as const" declaration so TypeScript can enforce event types for `emit`)
     * @param initNspaces Initial namespace list
     * @param timeoutMs Time in milliseconds before a long-polling request will resolve with
     *          an empty response (Higher values may cause issues with some browsers; default: 10000)
     */
    constructor(app: Express, path: string, events: ForceLiteralArray<EventList>, initNspaces: string[], timeoutMs?: number) {
        this.app = app;
        this.eventList = events;
        this.timeoutMs = timeoutMs ?? 10000;
        const normPath = path.endsWith('/') ? path : path + '/';
        for (const space of initNspaces) this.addNamespace(space);
        for (const ev of this.eventList) {
            if (ev.includes('/')) throw new TypeError('Event names cannot contain paths');
            const ev2 = ev as ElementOf<ForceLiteralArray<EventList>>;
            app.get(`${normPath}:namespace/${ev}`, (req, res, next) => {
                if (!this.open) {
                    next();
                    return;
                }
                const cid = req.headers['X-polling-id'];
                if (typeof cid != 'string') {
                    res.sendStatus(400);
                    return;
                }
                const namespace = req.params.namespace;
                if (!this.eventWaiters.has(namespace)) {
                    res.sendStatus(404);
                    return;
                }
                const waiters = this.eventWaiters.get(namespace)!.get(ev2)!;
                // initial request ensures client has data even if an update hasn't occured, unless no data
                if (!this.knownClients.has(cid)) {
                    this.knownClients.add(cid);
                    const initData = this.eventInitialData.get(namespace)!.get(ev2);
                    if (initData !== undefined) {
                        res.send(initData);
                        return;
                    }
                }
                waiters.add(res);
                // eventually times out after some time
                setTimeout(() => {
                    waiters.delete(res);
                    if (!res.closed) res.sendStatus(204);
                }, this.timeoutMs);
            });
        }
    }

    /**
     * Emit an event to a namespace with new data.
     * @param namespace Namespace to emit to
     * @param ev Event name
     * @param data New data
     */
    emit(namespace: string, ev: ElementOf<ForceLiteralArray<EventList>>, data: any): void {
        const events = this.eventWaiters.get(namespace);
        if (events === undefined) throw new TypeError('Cannot emit to nonexistent namespace');
        const waiting = events.get(ev);
        if (waiting === undefined) throw new TypeError('Cannot emit event not in event list');
        this.eventInitialData.get(namespace)!.set(ev, data);
        for (const res of waiting) {
            res.send(data);
        }
        waiting.clear();
    }

    /**
     * Emit an event to all namespaces with new data.
     * @param ev Event name
     * @param data New data
     */
    emitAll(ev: ElementOf<ForceLiteralArray<EventList>>, data: any): void {
        for (const [namespace, events] of this.eventWaiters) {
            const waiting = events.get(ev);
            if (waiting === undefined) throw new TypeError('Cannot emit event not in event list');
            this.eventInitialData.get(namespace)!.set(ev, data);
            for (const res of waiting) {
                res.send(data);
            }
            waiting.clear();
        }
    }

    /**
     * Create a new namespace.
     * @param name Namespace id
     * @returns `true` if a new namespace was created
     */
    addNamespace(name: string): boolean {
        if (this.eventWaiters.has(name)) return false;
        const events: Map<ElementOf<ForceLiteralArray<EventList>>, Set<Response>> = new Map();
        const initData: Map<ElementOf<ForceLiteralArray<EventList>>, any> = new Map();
        for (const ev of this.eventList) {
            events.set(ev as ElementOf<ForceLiteralArray<EventList>>, new Set());
        }
        this.eventWaiters.set(name, events);
        this.eventInitialData.set(name, initData);
        return true;
    }

    /**
     * Remove an existing namcespace.
     * @param name Namespace id
     * @returns `true` if a namespace was removed
     */
    removeNamespace(name: string): boolean {
        if (!this.eventWaiters.has(name)) return false;
        this.eventWaiters.delete(name);
        this.eventInitialData.delete(name);
        return true;
    }

    /**
     * Timeout all waiting requests and stop accepting new requests.
     */
    close(): void {
        this.open = false;
        for (const events of this.eventWaiters.values()) {
            for (const waiting of events.values()) {
                for (const res of waiting) {
                    res.sendStatus(204);
                }
                waiting.clear();
            }
        }
        this.eventWaiters.clear();
    }
}

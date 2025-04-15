import { Response } from 'express';
import config from './config';
import Logger, { NamedLogger } from './log';

/**
 * Simple HTTP long-polling event-based emitter for Express applications.
 */
export class LongPollEventEmitter<TEvents extends Record<string, any>> {
    private static idCounter = 0;

    readonly logger: NamedLogger;
    private readonly waiters: Map<keyof TEvents, Set<Response>> = new Map();
    private readonly initData: Map<keyof TEvents, TEvents[keyof TEvents]> = new Map();
    readonly timeoutMs: number;
    private open: boolean = true;

    /**
     * @param logger Logging instance
     * @param timeoutMs Time in milliseconds before a request will resolve with status code 204
     */
    constructor(logger: Logger, timeoutMs?: number) {
        this.logger = new NamedLogger(logger, 'LP-EV-' + (LongPollEventEmitter.idCounter++).toString());
        this.timeoutMs = timeoutMs ?? 10000;
    }

    /**
     * Add an Express `Response` to wait for an event. 
     * @param ev Event name
     * @param res Express `Response` object
     */
    addWaiter(ev: keyof TEvents & string, res: Response): void {
        if (!this.open) return;
        if (config.debugMode) this.logger.debug(`WAITER "${ev}"`);
        if (!this.waiters.has(ev)) this.waiters.set(ev, new Set());
        const w = this.waiters.get(ev)!;
        w.add(res);
        setTimeout(() => {
            w.delete(res);
            if (!res.closed) res.sendStatus(204);
        }, this.timeoutMs);
    }

    /**
     * Add an Express `Response` to immediately respond to with the most recent data for an event.
     * If no previously emitted data is available, it is added as a waiter instead.
     * @param ev Event name
     * @param res Express `Response` object
     */
    addImmediate(ev: keyof TEvents & string, res: Response): void {
        if (!this.open) return;
        if (config.debugMode) this.logger.debug(`IMMEDIATE "${ev}" success=${this.initData.has(ev)}`);
        if (!this.initData.has(ev)) this.addWaiter(ev, res);
        else res.json(this.initData.get(ev));
    }

    /**
     * Emit new data to all Express `Response` waiters added through {@link addWaiter}.
     * @param ev Event name
     * @param data Data to update with
     */
    emit<TEvent extends keyof TEvents & string>(ev: TEvent, data: TEvents[TEvent]): void {
        if (!this.open) return;
        if (config.debugMode) this.logger.debug(`EMIT "${ev}"`);
        this.initData.set(ev, data);
        const w = this.waiters.get(ev);
        if (w === undefined) return;
        for (const res of w) res.json(data);
        w.clear();
    }

    get currentWaiterCount(): number {
        return [...this.waiters.values()].reduce((p, w) => p + w.size, 0);
    }

    /**
     * Timeout all waiters and stop accepting new ones.
     */
    close() {
        if (!this.open) return;
        this.open = false;
        this.waiters.forEach((w) => w.forEach((res) => res.sendStatus(204)));
    }
}

/**
 * Namespace-separated HTTP long-polling event-based emitter for Express applications.
 */
export class NamespacedLongPollEventEmitter<TEvents extends Record<string, any>> {
    private static idCounter = 0;

    readonly logger: NamedLogger;
    readonly timeoutMs: number;
    private readonly emitters: Map<string, LongPollEventEmitter<TEvents>> = new Map();
    private open: boolean = true;

    /**
     * @param logger Logging instance
     * @param timeoutMs Time in milliseconds before a request will resolve with status code 204
     */
    constructor(logger: Logger, timeoutMs?: number) {
        this.logger = new NamedLogger(logger, 'NLP-EV-' + (NamespacedLongPollEventEmitter.idCounter++).toString());
        this.timeoutMs = timeoutMs ?? 10000;
    }

    private ensureEmitter(nsp: string) {
        if (!this.emitters.has(nsp)) this.emitters.set(nsp, new LongPollEventEmitter(new NamedLogger(this.logger.logger, `${this.logger.name}/"${nsp}"`), this.timeoutMs));
    }

    /**
     * Add an Express `Response` to wait for an event. 
     * @param nsp Namespace to hold response in
     * @param ev Event name
     * @param res Express `Response` object
     */
    addWaiter(nsp: string, ev: keyof TEvents & string, res: Response): void {
        if (!this.open) return;
        this.ensureEmitter(nsp);
        this.emitters.get(nsp)!.addWaiter(ev, res);
    }

    /**
     * Add an Express `Response` to immediately respond to with the most recent data for an event.
     * If no previously emitted data is available, it is added as a waiter instead.
     * @param nsp Namespace to hold response in
     * @param ev Event name
     * @param res Express `Response` object
     */
    addImmediate(nsp: string, ev: keyof TEvents & string, res: Response): void {
        if (!this.open) return;
        this.ensureEmitter(nsp);
        this.emitters.get(nsp)!.addImmediate(ev, res);
    }

    /**
     * Emit new data to all Express `Response` waiters added through {@link addWaiter}.
     * @param nsp Namespace to hold response in
     * @param ev Event name
     * @param data Data to update with
     */
    emit<TEvent extends keyof TEvents & string>(nsp: string, ev: TEvent, data: TEvents[TEvent]): void {
        if (!this.open) return;
        this.ensureEmitter(nsp);
        this.emitters.get(nsp)!.emit(ev, data);
    }

    /**
     * Timeout all waiters and stop accepting new ones.
     */
    close() {
        if (!this.open) return;
        this.open = false;
        this.emitters.forEach((emitter) => emitter.close());
    }
}
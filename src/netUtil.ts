import { Response } from 'express';

/**
 * Simple long-polling HTTP event-based emitter for Express applications.
 */
export class LongPollEventEmitter<TEvents extends Record<string, any>> {
    private readonly waiters: Map<keyof TEvents, Set<Response>> = new Map();
    private readonly initData: Map<keyof TEvents, TEvents[keyof TEvents]> = new Map();
    readonly timeoutMs: number;
    private open: boolean = true;

    /**
     * @param timeoutMs Time in milliseconds before a request will resolve with status code 204
     */
    constructor(timeoutMs?: number) {
        this.timeoutMs = timeoutMs ?? 10000;
    }

    /**
     * Add an Express `Response` to wait for an event. 
     * @param ev Event name
     * @param res Express `Response` object
     */
    addWaiter(ev: keyof TEvents & string, res: Response): void {
        if (!this.open) return;
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
 * Namespace-separated long-polling HTTP event-based emitter for Express applications.
 */
export class NamespacedLongPollEventEmitter<TEvents extends Record<string, any>> {
    readonly timeoutMs: number;
    private readonly emitters: Map<string, LongPollEventEmitter<TEvents>> = new Map();
    private open: boolean = true;
    private readonly maintenanceLoop: NodeJS.Timeout;

    /**
     * @param timeoutMs Time in milliseconds before a request will resolve with status code 204
     */
    constructor(timeoutMs?: number) {
        this.timeoutMs = timeoutMs ?? 10000;
        // periodically clean out empty emitters to avoid resource leaks
        this.maintenanceLoop = setInterval(() => this.emitters.forEach((emitter, nsp) => {
            if (emitter.currentWaiterCount == 0) this.emitters.delete(nsp);
        }), 60000);
    }

    /**
     * Add an Express `Response` to wait for an event. 
     * @param nsp Namespace to hold response in
     * @param ev Event name
     * @param res Express `Response` object
     */
    addWaiter(nsp: string, ev: keyof TEvents & string, res: Response): void {
        if (!this.open) return;
        if (!this.emitters.has(nsp)) this.emitters.set(nsp, new LongPollEventEmitter(this.timeoutMs));
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
        if (!this.emitters.has(nsp)) this.emitters.set(nsp, new LongPollEventEmitter(this.timeoutMs));
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
        if (!this.emitters.has(nsp)) return;
        this.emitters.get(nsp)!.emit(ev, data);
    }
    
    /**
     * Timeout all waiters and stop accepting new ones.
     */
    close() {
        if (!this.open) return;
        this.open = false;
        this.emitters.forEach((emitter) => emitter.close());
        clearInterval(this.maintenanceLoop);
    }
}
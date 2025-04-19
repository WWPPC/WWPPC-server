import { NextFunction, Request, Response } from 'express';
import rateLimit, { Options as RateLimitOptions, RateLimitRequestHandler } from 'express-rate-limit';
import { extend as nivExtend, extendMessages as nivExtendMessages, Validator } from 'node-input-validator';
import { validate } from 'uuid';

import config from './config';
import { RSAEncryptionHandler } from './cryptoUtil';
import { DatabaseOpCode } from './database';
import Logger, { NamedLogger } from './log';
import { reverse_enum } from './util';

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

// these are used in a couple places
nivExtend('lowerAlphaNumDash', ({ value }: any) => {
    if (typeof value != 'string') return false;
    return /^[a-z0-9-_]+$/.test(value);
});
nivExtend('uuid', ({ value }: any) => {
    return validate(value);
});
nivExtend('base64Mime', async ({ value, args }: any) => {
    if (args.length == 0) throw new Error('Invalid seed for rule base64Mime');
    if (!await new Validator({ v: value.split(',')[1] }, { v: 'required|base64' }).check()) return false;
    const mime = /^data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=]+)$/g.exec(value);
    if (mime === null) return false;
    if (!(args as string[]).includes(mime[1])) return false;
    return true;
});
nivExtend('base64Size', async ({ value, args }: any) => {
    if (args.length != 1 || isNaN(Number(args[0]))) throw new Error('Invalid seed for rule base64Size');
    // remove MIME type (if doesn't have it that's fine)
    const split = (value as string).split(',');
    // this will check if it's base64 as well
    try {
        return Buffer.from(split[1] ?? split[0], 'base64').length <= Number(args[0]);
    } catch (err) {
        return false;
    }
});
nivExtendMessages({
    lowerAlphaNumDash: 'The :attribute can only contain lowercase letters, numbers, dashes, and underscores',
    uuid: 'The :attribute must be a valid UUID',
    base64Mime: 'The :attribute is an invalid MIME type',
    base64Size: 'The :attribute must be :arg0 bytes or less'
});
export function createNivEncryptedRules(encryptor: RSAEncryptionHandler, name: string) {
    nivExtend(`encrypted-${name}`, async ({ value }: any) => {
        if (typeof value != 'string') return false;
        return typeof (await encryptor.decrypt(value)) == 'string';
    });
    nivExtend(`encryptedEmail-${name}`, async ({ value }: any) => {
        if (typeof value != 'string') return false;
        return await new Validator({ v: await encryptor.decrypt(value) }, { v: 'email|length:64,1' }).check();
    });
    nivExtend(`encryptedLen-${name}`, async ({ value, args }: any) => {
        if (args.length < 1 || args.length > 2) throw new Error('Invalid seed for rule encryptedLen-auth');
        if (typeof value != 'string') return false;
        return await new Validator({
            v: await encryptor.decrypt(value)
        }, {
            v: `string|length:${args[0]}${args.length > 1 ? `,${args[1]}` : ''}`
        }).check();
    });
    // can't do this in object literals
    const rules: Record<string, string> = {};
    rules[`encrypted-${name}`] = 'The :attribute must be RSA-OAEP encrypted using the server public key (maybe your session expired?)';
    rules[`encryptedemail-${name}`] = 'The :attribute must be a valid e-mail address and RSA-OAEP encrypted using the server public key (maybe your session expired?)';
    rules[`encryptedLen-${name}`] = 'The :attribute must be a valid length and RSA-OAEP encrypted using the server public key (maybe your session expired?)';
    nivExtendMessages(rules, 'en');
}

/**
 * Create an instance of `express-rate-limit` IP rate limiter, with a handler
 * for the first trigger of the rate limiter per window.
 * @param options Options to configure the rate limiter.
 * @param cb Callback handler for the first trigger
 */
export function rateLimitWithTrigger(options: Partial<Omit<RateLimitOptions, 'handler'>>, cb: (req: Request, res: Response) => any): RateLimitRequestHandler {
    const window = options.windowMs ?? 60000;
    const recentTriggers: Map<string, number> = new Map();
    return rateLimit({
        ...options,
        handler: async (req, res, next, options) => {
            if (recentTriggers.get(req.ip!) ?? -Infinity < performance.now() - window) await cb(req, res);
            recentTriggers.set(req.ip!, performance.now());
            res.status(options.statusCode).send(options.message);
        }
    });
}
/**
 * Returns middleware that validates the request body using the node-input-validator package.
 * @param rules Input validation rules
 * @param logger Logging instance
 */
export function validateRequestBody(rules: object, logger?: Logger, responseCode: number = 400): (req: Request, res: Response, next: NextFunction) => Promise<void> {
    return async (req, res, next) => {
        const validator = new Validator(req.body, rules);
        validator.doBail = !config.debugMode;
        if (await validator.check()) {
            next();
        } else {
            if (config.debugMode && logger !== undefined) logger.warn(`${req.method} ${req.path} malformed: ${validator.errors} (${req.ip})`);
            res.status(responseCode).send('Errors:\n' + Array.from(Object.values(validator.errors)).map<string>((err: any) => err.message).join('\n'));
        }
    };
}
const defaultDbResMessages: Record<DatabaseOpCode, string> = {
    [DatabaseOpCode.SUCCESS]: 'Success',
    [DatabaseOpCode.CONFLICT]: 'Already exists',
    [DatabaseOpCode.NOT_FOUND]: 'Not found',
    [DatabaseOpCode.UNAUTHORIZED]: 'Unauthorized',
    [DatabaseOpCode.FORBIDDEN]: 'Forbidden',
    [DatabaseOpCode.ERROR]: 'Internal error'
};
/**
 * Send a response code and message based on a `DatabaseOpCode`, with logging of responses.
 * @param req Express request
 * @param res Express response
 * @param code Response code
 * @param messages Optional override messages for each code (if this is a string, returns the same message for all codes - **ONLY use this IF the response `code` is constant!**)
 * @param logger Logging instance
 * @param username Username of request sender (optional)
 * @param messagePrefix Optional prefix for response messages
 */
export function sendDatabaseResponse(req: Request, res: Response, code: DatabaseOpCode, messages: Partial<Record<DatabaseOpCode, string>> | string, logger: Logger, username?: string, messagePrefix?: string): void {
    const message = (messagePrefix ? messagePrefix + ' - ' : '') + (typeof messages == 'string' ? messages : (messages[code] ?? defaultDbResMessages[code]));
    if (config.debugMode) logger.debug(`${username !== undefined ? `${username} @ ` : ''}${req.ip} | ${req.method} ${req.path}: ${reverse_enum(DatabaseOpCode, code)} - ${message}`);
    switch (code) {
        case DatabaseOpCode.ERROR:
            logger.error(`${username !== undefined ? `${username} @ ` : ''}${req.ip} | ${req.method} ${req.path} error`);
        case DatabaseOpCode.SUCCESS:
        case DatabaseOpCode.CONFLICT:
        case DatabaseOpCode.NOT_FOUND:
        case DatabaseOpCode.UNAUTHORIZED:
        case DatabaseOpCode.FORBIDDEN:
            res.status(code).send(message);
            break;
        default:
            logger.error(`${req.method} ${req.path} unexpected DatabaseOpCode ${reverse_enum(DatabaseOpCode, code)}`);
            res.sendStatus(503);
    }
}
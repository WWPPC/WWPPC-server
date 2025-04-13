import { EventEmitter } from 'events';
import { NextFunction, Request, Response } from 'express';
import rateLimit, { Options as RateLimitOptions, RateLimitRequestHandler } from 'express-rate-limit';
import { extend as nivExtend, extendMessages as nivExtendMessages, Validator } from 'node-input-validator';
import { validate } from 'uuid';

import config from './config';
import { DatabaseOpCode } from './database';
import Logger from './log';

// important comparator (streamlines filtering everywhere)
export type primitive = number | string | boolean | undefined | null;
/**
 * Flexible comparison type for filtering items. Allows for primitive comparisons (`=`, `!`),
 * numerical comparisons (`>`, `<`, `>=`, `<=`), range comparisons (`><`, `<>`, `=><`, `><=`, `=><=`, `=<>`, `<>=`, `=<>=`),
 * substring searches (`~`), as well as list searches using `Array` values.
 * 
 * ### To be used with {@link filterCompare}
 * 
 * ### Matching
 * 
 * ```
 * primitive | primitive[]
 * ```
 * 
 * If the value is a `primitive`, {@link filterCompare} will check exact matches.
 * 
 * If the value is a `primitive[]` (`Array` of `primitive`), {@link filterCompare} will check if the value is included in the array.
 * 
 * ### Generic Comparison
 * 
 * ```
 * {
 *     op: '=' | '!',
 *     v: primitive | primitive[]
 * }
 * ```
 * 
 * If `v` is a `primitive`, {@link filterCompare} will check if the value exactly matches `v`.
 * 
 * If `v` is a `primitive[]` (`Array` of `primitive`), {@link filterCompare} will check if the value is included in `v`.
 * 
 * ### Numerical Comparison
 * 
 * ```
 * {
 *     op: '>' | '<' | '>=' | '<='
 *     v: number
 * }
 * ```
 * 
 * {@link filterCompare} will perform a numerical comparison with `v` using `op` on the value. That is, `inputValue` `op` `v`.
 * 
 * ### Range Comparison
 * 
 * ```
 * {
 *     op: '><' | '<>' | '=><' | '><=' | '=><=' | '=<>' | '<>=' | '=<>='
 *     v1: number
 *     v2: number
 * }
 * ```
 * 
 * {@link filterCompare} will perform two numerical comparisons using `v1` as the lower bound and `v2` as the upper bound for `op` on the value.
 * 
 * `{ op: '=><', v1: 10, v2: 24 }` is satisfied within the range [10, 24) (i.e. greater than or equal to 10 and less than 24).
 * 
 * ### Substring Matching
 * 
 * ```
 * {
 *     op: '~'
 *     v: string
 * }
 * ```
 * 
 * {@link filterCompare} will check if `v` is a substring of the value.
 * 
 * */
export type FilterComparison<T> = T extends primitive ? ({
    op: '=' | '!'
    v: T | T[]
} | {
    op: '>' | '<' | '>=' | '<='
    v: number & T
} | {
    op: '><' | '<>' | '=><' | '><=' | '=><=' | '=<>' | '<>=' | '=<>='
    v1: number & T
    v2: number & T
} | {
    op: '~'
    v: string & T
} | T | T[]) : never;

/**
 * Compare a value using a {@link FilterComparison}.
 * 
 * **Examples:**
 * 
 * ```
 * filterCompare<string>('baz', ['foo', 'bar', 'baz', 'buh']); // true, since "baz" is in the array
 * ```
 * ```
 * filterCompare<number>(22, { op: '<=', v: 22 }); // true, since 22 is less than or equal to 22
 * ```
 * ```
 * filterCompare<number>(33.33, { op: '><=', v1: 34, v2: 100 }); // false, since 33.33 is not within the range (34, 100]
 * ```
 * ```
 * filterCompare<number>(-5, { op: '<>', v1: -1, v2: 1}); // true, since -5 is out of the range (-1, 1)
 * ```
 * 
 * @param v Value to compare
 * @param c Comparison
 * @returns  Comparison result
 */
export function filterCompare<T>(v: T & primitive, c: FilterComparison<T>): boolean {
    if (c === null || c === undefined) return c === v;
    if (Array.isArray(c)) return c.includes(v);
    if (typeof c != 'object') return c === v;
    if ('op' in c) {
        switch (c.op) {
            case '=':
                if (Array.isArray(c.v)) return c.v.includes(v);
                return v === c.v;
            case '!':
                if (Array.isArray(c.v)) return !c.v.includes(v);
                return v !== c.v;
            case '~':
                return (v as string).includes(c.v);
        }
        if (typeof v == 'number') {
            if ('v' in c) {
                switch (c.op) {
                    case '<': return v < c.v;
                    case '>': return v > c.v;
                    case '<=': return v <= c.v;
                    case '>=': return v >= c.v;
                }
            }
            if ('v1' in c && 'v2' in c) switch (c.op) {
                case '><': return v > c.v1 && v < c.v2;
                case '<>': return v < c.v1 || v > c.v2;
                case '=><': return v >= c.v1 && v < c.v2;
                case '><=': return v > c.v1 && v <= c.v2;
                case '=><=': return v >= c.v1 && v <= c.v2;
                case '=<>': return v <= c.v1 || v > c.v2;
                case '<>=': return v < c.v1 || v >= c.v2;
                case '=<>=': return v <= c.v1 || v >= c.v2
            }
        }
    }
    return c === v;
}

// extended event emitter
/**
 * Extension of the built-in Node.js `EventEmitter` module, with added type safety.
 */
export class TypedEventEmitter<TEvents extends Record<string, any[]>> {
    private readonly emitter: EventEmitter = new EventEmitter();

    /**
     * Emit an event.
     * @param ev Event name
     * @param args Event data, passed to each listener
     */
    emit<TEvent extends keyof TEvents & string>(ev: TEvent, ...args: TEvents[TEvent]): void {
        this.emitter.emit(ev, ...args);
    }
    /**
     * Add a listener for an event.
     * @param ev Event name
     * @param cb Callback function
     */
    addListener<TEvent extends keyof TEvents & string>(ev: TEvent, cb: (...args: TEvents[TEvent]) => any): void {
        this.emitter.on(ev, cb);
    }
    /**
     * Remove an existing listener for an event.
     * @param ev Event name
     * @param cb Callback function
     */
    removeListener<TEvent extends keyof TEvents & string>(ev: TEvent, cb: (...args: TEvents[TEvent]) => any): void {
        this.emitter.off(ev, cb);
    }
    /**
     * Add a listener for an event. (Alias of `addListener`)
     * @param ev Event name
     * @param cb Callback function
     */
    on<TEvent extends keyof TEvents & string>(ev: TEvent, cb: (...args: TEvents[TEvent]) => any): void {
        this.emitter.on(ev, cb);
    }
    /**
     * Remove an existing listener for an event. (Alias of `removeListener`)
     * @param ev Event name
     * @param cb Callback function
     */
    off<TEvent extends keyof TEvents & string>(ev: TEvent, cb: (...args: TEvents[TEvent]) => any): void {
        this.emitter.off(ev, cb);
    }
}

// these are used in a couple places
nivExtend('lowerAlphaNumDash', ({ value }: any) => {
    if (typeof value != 'string') return false;
    return /^[a-z]([a-z0-9-]*[a-z0-9])?$/.test(value);
});
nivExtend('uuid', ({ value }: any) => {
    return validate(value);
});
nivExtend('base64Mime', async ({ value, args }: any) => {
    if (args.length == 0) throw new Error('Invalid seed for rule base64Mime');
    if (!await new Validator({ v: value }, { v: 'required/base64' }).check()) return false;
    const mime = /^data:(.+?);base64,/g.exec(value);
    if (mime === null) return false;
    if (!(args as string[]).includes(mime[0])) return false;
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
    base64Mine: 'The :attribute is an invalid MIME type',
    base64Size: 'The :attribute must be :arg0'
});

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
            res.status(responseCode).send(validator.errors);
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

// more helpers
export type UUID = string;

export function isUUID(id: any): id is UUID {
    return validate(id);
}

/**
 * Look up the name of an enumeration based on the value
 */
export function reverse_enum(enumeration: any, v: any): any {
    for (const k in enumeration) if (enumeration[k] === v) return k;
    return v;
}
/**
 * Check if a value is in an enumeration
 */
export function is_in_enum(v: any, enumeration: any): boolean {
    for (const k in enumeration) if (enumeration[k] === v) return true;
    return false;
}

export type ElementOf<T extends readonly unknown[]> = T extends readonly (infer Element)[] ? Element : never;
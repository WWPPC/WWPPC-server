import { EventEmitter } from 'events';
import { validate } from 'uuid';

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
} | (T extends number ? ({
    op: '>' | '<' | '>=' | '<='
    v: number
} | {
    op: '><' | '<>' | '=><' | '><=' | '=><=' | '=<>' | '<>=' | '=<>='
    v1: number
    v2: number
}) : never) | (T extends string ? ({
    op: '~'
    v: string
}) : never) | T | T[]) : never;

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
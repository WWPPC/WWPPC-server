import { validate } from 'uuid';

export type primitive = number | string | boolean | undefined | null;
/**Flexible comparison type for filtering */
export type FilterComparison<T> = T extends primitive ? ({
    op: '=' | '!'
    v: T | T[]
} | {
    op: '<' | '>' | '>=' | '<='
    v: number & T
} | {
    op: '><' | '<>' | '=><' | '><=' | '=><=' | '=<>' | '<>=' | '=<>='
    v1: number & T
    v2: number & T
} | T | T[]) : never;
export function filterCompare<T>(v: T & primitive, c: FilterComparison<T>): boolean {
    if (c === null || c === undefined) return c === v;
    if (Array.isArray(c)) return c.includes(v);
    if (typeof c != 'object') return c === v;
    if ('op' in c) {
        switch (c.op) {
            case '=': return v === c.v;
            case '!': return v !== c.v;
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

export type UUID = string;

export function isUUID(id: string): id is UUID {
    return validate(id);
}

export function reverse_enum(enumerator, v): string {
    for (const k in enumerator) if (enumerator[k] === v) return k;
    return v;
}
export function is_in_enum(v, enumerator): boolean {
    for (const k in enumerator) if (enumerator[k] === v) return true;
    return false;
}
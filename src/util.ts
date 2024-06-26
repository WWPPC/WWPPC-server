import { subtle, webcrypto } from 'crypto';
import { validate } from 'uuid';

import Logger, { NamedLogger } from './log';

// encryption helpers
export type RSAEncrypted = Buffer | string;

/**
 * Simple RSA-OAEP asymmetric encryption wrapper.
 */
export class RSAAsymmetricEncryptionHandler {
    static #counter = 0;
    readonly logger: NamedLogger;
    #keypair: Promise<webcrypto.CryptoKeyPair>;
    #publicKey: webcrypto.JsonWebKey | undefined;
    #session: number;
    readonly ready: Promise<any>;

    constructor(logger: Logger) {
        this.logger = new NamedLogger(logger, 'RSAAsymmetricEncryptionHandler-' + RSAAsymmetricEncryptionHandler.#counter++);
        this.#keypair = subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, false, ['encrypt', 'decrypt']);
        this.ready = new Promise((resolve) => {
            this.#keypair.then(({ publicKey }) => subtle.exportKey('jwk', publicKey).then((key) => this.#publicKey = key).then(resolve));
        });
        this.#session = Math.random();
    }

    /**
     * RA-OAEP public key, exported in "jwk" format.
     */
    get publicKey() { return this.#publicKey; }
    /**
     * Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.
     */
    get sessionID() { return this.#session; }

    /**
     * Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.
     */
    async rotateKeys() {
        const newKeys = subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, false, ['encrypt', 'decrypt']);
        const pKey = await subtle.exportKey('jwk', (await newKeys).publicKey);
        // avoid desync with promises (rare but will cause lots of random issues)
        this.#keypair = newKeys;
        this.#publicKey = pKey;
        this.#session++;
    }
    /**
     * Decrypt a message using the RSA-OAEP private key.
     * @param {ArrayBuffer | string} buf Encrypted ArrayBuffer representing a string or an unencrypted string (pass-through if encryption is not possible)
     * @returns {string} Decrypted string
     */
    async decrypt(buf: RSAEncrypted) {
        try {
            return buf instanceof Buffer ? await new TextDecoder().decode(await subtle.decrypt({ name: "RSA-OAEP" }, (await this.#keypair).privateKey, buf).catch(() => new Uint8Array([30]))) : buf;
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
            return buf;
        }
    }
}

// important comparator (streamlines filtering everywhere)
export type primitive = number | string | boolean | undefined | null;
/**
 * Flexible comparison type for filtering items. Allows for primitive comparisons (`=`, `!`),
 * numerical comparisons (`>`, `<`, `>=`, `<=`), range comparisons (`><`, `<>`, `=><`, `><=`, `=><=`, `=<>`, `<>=`, `=<>=`),
 * as well as list searches using `Array` values.
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
} | T | T[]) : never;

/**
 * Compare a value using a `FilterComparison` ({@link FilterComparison}).
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
 * @param {primitive} v Value to compare
 * @param {FilterComparison<primitive>} c Comparison
 * @returns {boolean} Comparison result
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

// more helpers
export type UUID = string;

export function isUUID(id: string): id is UUID {
    return validate(id);
}

/**
 * Look up the name of an enumeration based on the value
 */
export function reverse_enum(enumeration, v): string {
    for (const k in enumeration) if (enumeration[k] === v) return k;
    return v;
}
/**
 * Check if a value is in an enumeration
 */
export function is_in_enum(v, enumeration): boolean {
    for (const k in enumeration) if (enumeration[k] === v) return true;
    return false;
}
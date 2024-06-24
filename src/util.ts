import { subtle, webcrypto } from 'crypto';
import { validate } from 'uuid';

import Logger, { NamedLogger } from './log';

export type RSAEncrypted = Buffer | string;

export class RSAAsymmetricEncryptionHandler {
    readonly logger: NamedLogger;
    #keypair: Promise<webcrypto.CryptoKeyPair>;
    #publicKey: webcrypto.JsonWebKey | undefined;
    #session: number;
    readonly ready: Promise<any>;

    constructor(logger: Logger) {
        this.logger = new NamedLogger(logger, 'RSAAsymmetricEncryptionHandler');
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
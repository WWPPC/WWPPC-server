import { createCipheriv, createDecipheriv, randomBytes, randomUUID, subtle, webcrypto } from 'crypto';

import Logger, { NamedLogger } from './log';

// encryption helpers
export type RSAEncrypted = Buffer | string;

/**
 * Simple RSA-OAEP-256 asymmetric encryption wrapper.
 */
export class RSAEncryptionHandler {
    static #counter = 0;
    readonly logger: NamedLogger;
    #keypair: Promise<webcrypto.CryptoKeyPair>;
    #publicKey: webcrypto.JsonWebKey | undefined;
    #session: number;
    readonly ready: Promise<any>;

    /**
     * @param {Logger} logger Logger instance
     */
    constructor(logger: Logger) {
        this.logger = new NamedLogger(logger, 'RSAEncryptionHandler-' + RSAEncryptionHandler.#counter++);
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

/**
 * Simple AES-GCM-256 symmetric encryption wrapper.
 */
export class AESEncryptionHandler {
    static #counter: 0;
    readonly logger: NamedLogger;
    readonly #key: Buffer;

    /**
     * @param {Buffer} key Valid AES key
     * @param {Logger} logger Logger instance
     */
    constructor(key: Buffer, logger: Logger) {
        this.logger = new NamedLogger(logger, 'AESEncryptionHandler-' + AESEncryptionHandler.#counter++);
        this.#key = key;
    }

    /**
     * Symmetrically encrypt a plaintext string to a formatted string.
     * @param {string} plaintext Plaintext string
     * @returns {string} Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag (the plaintext string if there was an error)
     */
    encrypt(plaintext: string): string {
        try {
            const initVector = randomBytes(12);
            const cipher = createCipheriv('aes-256-gcm', this.#key, initVector);
            return `${cipher.update(plaintext, 'utf8', 'base64') + cipher.final('base64')}:${initVector.toString('base64')}:${cipher.getAuthTag().toString('base64')}`;
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
            return plaintext;
        }
    }

    /**
     * Symmetrically decrypt a formatted encrypted string to a plaintext string.
     * @param {string} encrypted Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag
     * @returns {string} Plaintext string (the formatted encrypted string if there was an error)
     */
    decrypt(encrypted: string): string {
        try {
            const text = encrypted.split(':');
            const decipher = createDecipheriv('aes-256-gcm', this.#key, Buffer.from(text[1], 'base64'));
            decipher.setAuthTag(Buffer.from(text[2], 'base64'));
            return decipher.update(text[0], 'base64', 'utf8') + decipher.final('utf8');
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
            return encrypted;
        }
    }
}

/**
 * Basic access token system with permissions checking and linked data.
 * @type {PType} Type of permissions list entries
 * @type {DType} Type of linked data
 */
export class AccessTokenHandler<PType, DType> {
    readonly #tokens: Map<string, { data: DType, perms: PType[] }> = new Map();

    /**
     * Create and register a new token with specified permissions list that optionally expires after some time.
     * @param {PType[]} perms Permissions list
     * @param {DType} linkedData Data to associate with the new token
     * @param {number | undefined} expiration Seconds until expiration removes the token
     * @returns {string} Access token
     */
    createToken(perms: PType[], linkedData: DType, expiration?: number): string {
        const token = randomUUID();
        this.#tokens.set(token, { data: linkedData, perms: perms.slice() });
        if (expiration !== undefined) setTimeout(() => this.removeToken(token), expiration * 1000);
        return token;
    }

    /**
     * Get a map of all tokens and corresponding permissions lists.
     * @returns {Map<string, { data: DType, perms: PType[] }>} Copy of token map
     */
    getTokens(): Map<string, { data: DType, perms: PType[] }> {
        const ret = new Map<string, { data: DType, perms: PType[] }>();
        this.#tokens.forEach((v, k) => ret.set(k, { data: v.data, perms: v.perms.slice() }));
        return ret;
    }

    /**
     * Check if a token is registered.
     * @param {string} token Token to check
     * @returns {boolean} If the token is registered
     */
    tokenExists(token: string): boolean {
        return this.#tokens.has(token);
    }

    /**
     * Get the permissions list for a token if it exists.
     * @param {string} token Token to check
     * @returns {PType[] | null} Token permissions list or null if not exists
     */
    tokenPermissions(token: string): PType[] | null {
        if (!this.#tokens.has(token)) return null;
        return this.#tokens.get(token)!.perms.slice();
    }

    /**
     * Get the linked data for a token if it exists.
     * @param {string} token Token to check
     * @returns {DType | null} Token linked data or null if not exists
     */
    tokenData(token: string): DType | null {
        if (!this.#tokens.has(token)) return null;
        return this.#tokens.get(token)!.data;
    }

    /**
     * Check if a token has a permission or all permissions in a list of permissions.
     * @param {string} token Token to check
     * @param {PType | PType[]} perms Permission or list of permissions
     * @returns {boolean} If the token contains the permission or all permissions from the list
     */
    tokenHasPermissions(token: string, perms: PType | PType[]): boolean {
        perms = Array.isArray(perms) ? perms : [perms];
        if (!this.#tokens.has(token)) return false;
        const tokenPerms = this.#tokens.get(token)!;
        return perms.every((perm) => tokenPerms.perms.includes(perm));
    }

    /**
     * Unregister a token for all permissions.
     * @param {string} token Token to unregister
     * @returns {boolean} If a token was previously registered and is now unregistered
     */
    removeToken(token: string): boolean {
        return this.#tokens.delete(token);
    }
}
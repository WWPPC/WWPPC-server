import { createCipheriv, createDecipheriv, randomBytes, randomUUID, subtle, webcrypto } from 'crypto';

import Logger, { NamedLogger } from './log';
import config from './config';

/**
 * Simple RSA-OAEP-256 asymmetric encryption wrapper.
 */
export class RSAEncryptionHandler {
    private static counter = 0;
    readonly logger: NamedLogger;
    private keypair: Promise<webcrypto.CryptoKeyPair>;
    private pubKey: webcrypto.JsonWebKey | undefined;
    private session: number;
    readonly ready: Promise<any>;

    /**
     * @param logger Logger instance
     */
    constructor(logger: Logger) {
        this.logger = new NamedLogger(logger, 'RSAEncryptionHandler-' + RSAEncryptionHandler.counter++);
        this.keypair = subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, false, ['encrypt', 'decrypt']);
        this.ready = new Promise((resolve) => {
            this.keypair.then(({ publicKey }) => subtle.exportKey('jwk', publicKey).then((key) => this.pubKey = key).then(resolve));
        });
        this.session = Date.now();
    }

    /**
     * RA-OAEP public key, exported in "jwk" format.
     */
    get publicKey(): webcrypto.JsonWebKey | undefined { return this.pubKey; }
    /**
     * Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.
     */
    get sessionID(): number { return this.session; }

    /**
     * Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.
     */
    async rotateKeys(): Promise<void> {
        const newKeys = subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, false, ['encrypt', 'decrypt']);
        const pKey = await subtle.exportKey('jwk', (await newKeys).publicKey);
        // avoid desync with promises (rare but will cause lots of random issues)
        this.keypair = newKeys;
        this.pubKey = pKey;
        this.session++;
    }
    /**
     * Decrypt a message using the RSA-OAEP private key.
     * @param base64 Encrypted ArrayBuffer encoded in base64 representing a string or an unencrypted string (pass-through if encryption is not possible)
     * @returns  Decrypted string
     */
    async decrypt(base64: string): Promise<string | null> {
        try {
            return new TextDecoder().decode(await subtle.decrypt({ name: "RSA-OAEP" }, (await this.keypair).privateKey, Buffer.from(base64, 'base64')));
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
            return null;
        }
    }
}

/**
 * Simple AES-GCM-256 symmetric encryption wrapper.
 */
export class AESEncryptionHandler {
    private static counter: 0;
    readonly logger: NamedLogger;
    private readonly key: Buffer;

    /**
     * @param key Valid AES key
     * @param logger Logger instance
     */
    constructor(key: Buffer, logger: Logger) {
        this.logger = new NamedLogger(logger, 'AESEncryptionHandler-' + AESEncryptionHandler.counter++);
        this.key = key;
    }

    /**
     * Symmetrically encrypt a plaintext string to a formatted string.
     * @param plaintext Plaintext string
     * @returns  Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag (the plaintext string if there was an error)
     */
    encrypt(plaintext: string): string {
        try {
            const initVector = randomBytes(12);
            const cipher = createCipheriv('aes-256-gcm', this.key, initVector);
            return `${cipher.update(plaintext, 'utf8', 'base64') + cipher.final('base64')}:${initVector.toString('base64')}:${cipher.getAuthTag().toString('base64')}`;
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
            return plaintext;
        }
    }

    /**
     * Symmetrically decrypt a formatted encrypted string to a plaintext string.
     * @param encrypted Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag
     * @returns  Plaintext string (the formatted encrypted string if there was an error)
     */
    decrypt(encrypted: string): string {
        try {
            const text = encrypted.split(':');
            const decipher = createDecipheriv('aes-256-gcm', this.key, Buffer.from(text[1], 'base64'));
            decipher.setAuthTag(Buffer.from(text[2], 'base64'));
            return decipher.update(text[0], 'base64', 'utf8') + decipher.final('utf8');
        } catch (err) {
            this.logger.handleError('RSA decrypt error:', err);
            return encrypted;
        }
    }
}

/**
 * Basic access token system with linked data.
 * @type {DType} Type of linked data
 */
export class TokenHandler<DType> {
    private readonly tokens: Map<string, { data: DType, expiration?: number }> = new Map();
    private readonly tokenData: Map<DType, number> = new Map(); // reference counter optimization

    constructor() {
        setInterval(() => {
            for (const [token, data] of this.tokens) {
                if (data.expiration !== undefined && data.expiration < Date.now()) {
                    this.tokens.delete(token);
                    const refs = this.tokenData.get(data.data);
                    if (refs == 0 || refs === undefined) this.tokenData.delete(data.data);
                    else this.tokenData.set(data.data, refs - 1);
                }
            }
        }, 1000);
    }

    /**
     * Create and register a new token that optionally expires after some time.
     * @param linkedData Data to associate with the new token
     * @param expiration Seconds until expiration removes the token
     * @returns  Access token
     */
    createToken(linkedData: DType, expiration?: number): string {
        const token = randomUUID();
        this.tokens.set(token, { data: linkedData, expiration: expiration === undefined ? undefined : Date.now() + expiration * 3600 * 1000 });
        this.tokenData.set(linkedData, (this.tokenData.get(linkedData) ?? 0) + 1);
        return token;
    }

    /**
     * Get a map of all tokens and corresponding data.
     * @returns  Copy of token map
     */
    getTokens(): Record<string, DType> {
        const ret: Record<string, DType> = {};
        this.tokens.forEach((v, k) => ret[k] = v.data);
        return ret;
    }

    /**
     * Check if a token is registered.
     * @param token Token to check
     * @returns  If the token is registered
     */
    tokenExists(token: string): boolean {
        return this.tokens.has(token);
    }

    /**
     * Check token expiration time.
     * @param token Token to check
     * @returns  Expiration time, if the token exists and has an expiration
     */
    tokenExpiration(token: string): number | undefined {
        return this.tokenExists(token) ? this.tokens.get(token)!.expiration : undefined;
    }

    /**
     * Update token expiration time.
     * @param token Token to update
     * @param expiration New expiration duration in seconds, added onto the current time
     * @returns  If a token was found and the expiration time updated
     */
    extendTokenExpiration(token: string, expiration: number): boolean {
        if (!this.tokenExists(token)) return false;
        this.tokens.get(token)!.expiration = Date.now() + (expiration * 1000);
        return true;
    }

    /**
     * Get the linked data for a token if it exists.
     * @param token Token to check
     * @returns  Token linked data or null if not exists
     */
    getTokenData(token: string): DType | null {
        if (!this.tokens.has(token)) return null;
        return this.tokens.get(token)!.data;
    }

    /**
     * Set the linked data for a token if it exists.
     * @param token Token to check
     * @param linkedData New data
     * @returns  If a token was found and the data updated
     */
    setTokenData(token: string, linkedData: DType): boolean {
        const existing = this.tokens.get(token);
        if (existing === undefined) return false;
        existing.data = linkedData;
        const refs = this.tokenData.get(existing.data);
        if (refs == 0 || refs === undefined) this.tokenData.delete(existing.data);
        else this.tokenData.set(existing.data, refs - 1);
        this.tokenData.set(linkedData, (this.tokenData.get(linkedData) ?? 0) + 1);
        return true;
    }

    /**
     * Check if any token has the linked data requested.
     * @param linkedData Data to search for
     * @returns  If any token with equal linked data is found
     */
    dataExists(linkedData: DType): boolean {
        return this.tokenData.has(linkedData);
    }

    /**
     * Unregister a token for all permissions.
     * @param token Token to unregister
     * @returns  If a token was previously registered and is now unregistered
     */
    removeToken(token: string): boolean {
        const data = this.tokens.get(token);
        if (data === undefined) return false;
        const refs = this.tokenData.get(data.data);
        if (refs == 0 || refs === undefined) this.tokenData.delete(data.data);
        else this.tokenData.set(data.data, refs - 1);
        return this.tokens.delete(token);
    }
}
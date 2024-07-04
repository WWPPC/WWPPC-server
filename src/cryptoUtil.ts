import { createCipheriv, createDecipheriv, randomBytes, subtle, webcrypto } from 'crypto';

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
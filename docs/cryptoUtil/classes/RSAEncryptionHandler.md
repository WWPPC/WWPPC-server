[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [cryptoUtil](../README.md) / RSAEncryptionHandler

# Class: RSAEncryptionHandler

Simple RSA-OAEP-256 asymmetric encryption wrapper.

## Constructors

### new RSAEncryptionHandler()

> **new RSAEncryptionHandler**(`logger`): [`RSAEncryptionHandler`](RSAEncryptionHandler.md)

#### Parameters

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`RSAEncryptionHandler`](RSAEncryptionHandler.md)

#### Source

src/cryptoUtil.ts:22

## Properties

### #keypair

> `private` **#keypair**: `Promise`\<`CryptoKeyPair`\>

#### Source

src/cryptoUtil.ts:14

***

### #publicKey

> `private` **#publicKey**: `undefined` \| `JsonWebKey`

#### Source

src/cryptoUtil.ts:15

***

### #session

> `private` **#session**: `number`

#### Source

src/cryptoUtil.ts:16

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

src/cryptoUtil.ts:13

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Source

src/cryptoUtil.ts:17

***

### #counter

> `static` `private` **#counter**: `number` = `0`

#### Source

src/cryptoUtil.ts:12

## Accessors

### publicKey

> `get` **publicKey**(): `undefined` \| `JsonWebKey`

RA-OAEP public key, exported in "jwk" format.

#### Returns

`undefined` \| `JsonWebKey`

#### Source

src/cryptoUtil.ts:39

***

### sessionID

> `get` **sessionID**(): `number`

Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.

#### Returns

`number`

#### Source

src/cryptoUtil.ts:43

## Methods

### decrypt()

> **decrypt**(`buf`): `Promise`\<[`RSAEncrypted`](../type-aliases/RSAEncrypted.md)\>

Decrypt a message using the RSA-OAEP private key.

#### Parameters

• **buf**: [`RSAEncrypted`](../type-aliases/RSAEncrypted.md)

Encrypted ArrayBuffer representing a string or an unencrypted string (pass-through if encryption is not possible)

#### Returns

`Promise`\<[`RSAEncrypted`](../type-aliases/RSAEncrypted.md)\>

Decrypted string

#### Source

src/cryptoUtil.ts:66

***

### rotateKeys()

> **rotateKeys**(): `Promise`\<`void`\>

Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.

#### Returns

`Promise`\<`void`\>

#### Source

src/cryptoUtil.ts:48

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [util](../README.md) / RSAAsymmetricEncryptionHandler

# Class: RSAAsymmetricEncryptionHandler

Simple RSA-OAEP asymmetric encryption wrapper.

## Constructors

### new RSAAsymmetricEncryptionHandler()

> **new RSAAsymmetricEncryptionHandler**(`logger`): [`RSAAsymmetricEncryptionHandler`](RSAAsymmetricEncryptionHandler.md)

#### Parameters

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

#### Returns

[`RSAAsymmetricEncryptionHandler`](RSAAsymmetricEncryptionHandler.md)

#### Source

[src/util.ts:20](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L20)

## Properties

### #keypair

> `private` **#keypair**: `Promise`\<`CryptoKeyPair`\>

#### Source

[src/util.ts:15](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L15)

***

### #publicKey

> `private` **#publicKey**: `undefined` \| `JsonWebKey`

#### Source

[src/util.ts:16](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L16)

***

### #session

> `private` **#session**: `number`

#### Source

[src/util.ts:17](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L17)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/util.ts:14](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L14)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Source

[src/util.ts:18](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L18)

***

### #counter

> `static` `private` **#counter**: `number` = `0`

#### Source

[src/util.ts:13](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L13)

## Accessors

### publicKey

> `get` **publicKey**(): `undefined` \| `JsonWebKey`

RA-OAEP public key, exported in "jwk" format.

#### Returns

`undefined` \| `JsonWebKey`

#### Source

[src/util.ts:37](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L37)

***

### sessionID

> `get` **sessionID**(): `number`

Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.

#### Returns

`number`

#### Source

[src/util.ts:41](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L41)

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

[src/util.ts:64](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L64)

***

### rotateKeys()

> **rotateKeys**(): `Promise`\<`void`\>

Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.

#### Returns

`Promise`\<`void`\>

#### Source

[src/util.ts:46](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/util.ts#L46)

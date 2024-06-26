[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [util](../README.md) / RSAAsymmetricEncryptionHandler

# Class: RSAAsymmetricEncryptionHandler

## Constructors

### new RSAAsymmetricEncryptionHandler()

> **new RSAAsymmetricEncryptionHandler**(`logger`): [`RSAAsymmetricEncryptionHandler`](RSAAsymmetricEncryptionHandler.md)

#### Parameters

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

#### Returns

[`RSAAsymmetricEncryptionHandler`](RSAAsymmetricEncryptionHandler.md)

#### Source

[src/util.ts:15](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L15)

## Properties

### #keypair

> `private` **#keypair**: `Promise`\<`CryptoKeyPair`\>

#### Source

[src/util.ts:10](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L10)

***

### #publicKey

> `private` **#publicKey**: `undefined` \| `JsonWebKey`

#### Source

[src/util.ts:11](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L11)

***

### #session

> `private` **#session**: `number`

#### Source

[src/util.ts:12](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L12)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/util.ts:9](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L9)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Source

[src/util.ts:13](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L13)

## Accessors

### publicKey

> `get` **publicKey**(): `undefined` \| `JsonWebKey`

RA-OAEP public key, exported in "jwk" format.

#### Returns

`undefined` \| `JsonWebKey`

#### Source

[src/util.ts:32](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L32)

***

### sessionID

> `get` **sessionID**(): `number`

Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.

#### Returns

`number`

#### Source

[src/util.ts:36](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L36)

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

[src/util.ts:59](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L59)

***

### rotateKeys()

> **rotateKeys**(): `Promise`\<`void`\>

Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.

#### Returns

`Promise`\<`void`\>

#### Source

[src/util.ts:41](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/util.ts#L41)

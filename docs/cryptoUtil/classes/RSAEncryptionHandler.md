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

#### Defined in

[cryptoUtil.ts:22](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/cryptoUtil.ts#L22)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[cryptoUtil.ts:13](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/cryptoUtil.ts#L13)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Defined in

[cryptoUtil.ts:17](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/cryptoUtil.ts#L17)

## Accessors

### publicKey

> `get` **publicKey**(): `undefined` \| `JsonWebKey`

RA-OAEP public key, exported in "jwk" format.

#### Returns

`undefined` \| `JsonWebKey`

#### Defined in

[cryptoUtil.ts:39](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/cryptoUtil.ts#L39)

***

### sessionID

> `get` **sessionID**(): `number`

Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.

#### Returns

`number`

#### Defined in

[cryptoUtil.ts:43](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/cryptoUtil.ts#L43)

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

#### Defined in

[cryptoUtil.ts:66](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/cryptoUtil.ts#L66)

***

### rotateKeys()

> **rotateKeys**(): `Promise`\<`void`\>

Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.

#### Returns

`Promise`\<`void`\>

#### Defined in

[cryptoUtil.ts:48](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/cryptoUtil.ts#L48)

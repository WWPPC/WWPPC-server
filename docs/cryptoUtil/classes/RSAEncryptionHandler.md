[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [cryptoUtil](../README.md) / RSAEncryptionHandler

# Class: RSAEncryptionHandler

Simple RSA-OAEP-256 asymmetric encryption wrapper.

## Constructors

### new RSAEncryptionHandler()

> **new RSAEncryptionHandler**(`logger`): [`RSAEncryptionHandler`](RSAEncryptionHandler.md)

#### Parameters

##### logger

[`Logger`](../../log/classes/Logger.md)

Logger instance

#### Returns

[`RSAEncryptionHandler`](RSAEncryptionHandler.md)

#### Defined in

[cryptoUtil.ts:20](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L20)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[cryptoUtil.ts:11](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L11)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Defined in

[cryptoUtil.ts:15](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L15)

## Accessors

### publicKey

#### Get Signature

> **get** **publicKey**(): `undefined` \| `JsonWebKey`

RA-OAEP public key, exported in "jwk" format.

##### Returns

`undefined` \| `JsonWebKey`

#### Defined in

[cryptoUtil.ts:37](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L37)

***

### sessionID

#### Get Signature

> **get** **sessionID**(): `number`

Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.

##### Returns

`number`

#### Defined in

[cryptoUtil.ts:41](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L41)

## Methods

### decrypt()

> **decrypt**(`base64`): `Promise`\<`string` \| `Buffer`\<`ArrayBufferLike`\>\>

Decrypt a message using the RSA-OAEP private key.

#### Parameters

##### base64

`string`

Encrypted ArrayBuffer encoded in base64 representing a string or an unencrypted string (pass-through if encryption is not possible)

#### Returns

`Promise`\<`string` \| `Buffer`\<`ArrayBufferLike`\>\>

Decrypted string

#### Defined in

[cryptoUtil.ts:64](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L64)

***

### rotateKeys()

> **rotateKeys**(): `Promise`\<`void`\>

Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.

#### Returns

`Promise`\<`void`\>

#### Defined in

[cryptoUtil.ts:46](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L46)

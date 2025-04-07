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

[cryptoUtil.ts:19](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L19)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[cryptoUtil.ts:10](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L10)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Defined in

[cryptoUtil.ts:14](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L14)

## Accessors

### publicKey

#### Get Signature

> **get** **publicKey**(): `undefined` \| `JsonWebKey`

RA-OAEP public key, exported in "jwk" format.

##### Returns

`undefined` \| `JsonWebKey`

#### Defined in

[cryptoUtil.ts:36](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L36)

***

### sessionID

#### Get Signature

> **get** **sessionID**(): `number`

Session ID of the current rotation of keys. Changes for every `rotateRSAKeys()` call.

##### Returns

`number`

#### Defined in

[cryptoUtil.ts:40](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L40)

## Methods

### decrypt()

> **decrypt**(`buf`): `Promise`\<`string` \| `Buffer`\<`ArrayBufferLike`\>\>

Decrypt a message using the RSA-OAEP private key.

#### Parameters

##### buf

`Buffer`\<`ArrayBufferLike`\>

Encrypted ArrayBuffer representing a string or an unencrypted string (pass-through if encryption is not possible)

#### Returns

`Promise`\<`string` \| `Buffer`\<`ArrayBufferLike`\>\>

Decrypted string

#### Defined in

[cryptoUtil.ts:63](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L63)

***

### rotateKeys()

> **rotateKeys**(): `Promise`\<`void`\>

Re-generates the RSA-OAEP keypair used in `RSAdecrypt`, resolving when the public key has been updated.

#### Returns

`Promise`\<`void`\>

#### Defined in

[cryptoUtil.ts:45](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L45)

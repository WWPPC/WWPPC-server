[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [cryptoUtil](../README.md) / AESEncryptionHandler

# Class: AESEncryptionHandler

Simple AES-GCM-256 symmetric encryption wrapper.

## Constructors

### new AESEncryptionHandler()

> **new AESEncryptionHandler**(`key`, `logger`): [`AESEncryptionHandler`](AESEncryptionHandler.md)

#### Parameters

##### key

`Buffer`\<`ArrayBufferLike`\>

Valid AES key

##### logger

[`Logger`](../../log/classes/Logger.md)

Logger instance

#### Returns

[`AESEncryptionHandler`](AESEncryptionHandler.md)

#### Defined in

[cryptoUtil.ts:85](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/cryptoUtil.ts#L85)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[cryptoUtil.ts:78](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/cryptoUtil.ts#L78)

## Methods

### decrypt()

> **decrypt**(`encrypted`): `string`

Symmetrically decrypt a formatted encrypted string to a plaintext string.

#### Parameters

##### encrypted

`string`

Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag

#### Returns

`string`

Plaintext string (the formatted encrypted string if there was an error)

#### Defined in

[cryptoUtil.ts:111](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/cryptoUtil.ts#L111)

***

### encrypt()

> **encrypt**(`plaintext`): `string`

Symmetrically encrypt a plaintext string to a formatted string.

#### Parameters

##### plaintext

`string`

Plaintext string

#### Returns

`string`

Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag (the plaintext string if there was an error)

#### Defined in

[cryptoUtil.ts:95](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/cryptoUtil.ts#L95)

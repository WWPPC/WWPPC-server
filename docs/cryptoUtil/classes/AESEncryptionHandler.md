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

[cryptoUtil.ts:86](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L86)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[cryptoUtil.ts:79](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L79)

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

[cryptoUtil.ts:112](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L112)

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

[cryptoUtil.ts:96](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/cryptoUtil.ts#L96)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [cryptoUtil](../README.md) / AESEncryptionHandler

# Class: AESEncryptionHandler

Simple AES-GCM-256 symmetric encryption wrapper.

## Constructors

### new AESEncryptionHandler()

> **new AESEncryptionHandler**(`key`, `logger`): [`AESEncryptionHandler`](AESEncryptionHandler.md)

#### Parameters

• **key**: `Buffer`

Valid AES key

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`AESEncryptionHandler`](AESEncryptionHandler.md)

#### Defined in

[cryptoUtil.ts:88](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/cryptoUtil.ts#L88)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[cryptoUtil.ts:81](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/cryptoUtil.ts#L81)

## Methods

### decrypt()

> **decrypt**(`encrypted`): `string`

Symmetrically decrypt a formatted encrypted string to a plaintext string.

#### Parameters

• **encrypted**: `string`

Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag

#### Returns

`string`

Plaintext string (the formatted encrypted string if there was an error)

#### Defined in

[cryptoUtil.ts:114](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/cryptoUtil.ts#L114)

***

### encrypt()

> **encrypt**(`plaintext`): `string`

Symmetrically encrypt a plaintext string to a formatted string.

#### Parameters

• **plaintext**: `string`

Plaintext string

#### Returns

`string`

Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag (the plaintext string if there was an error)

#### Defined in

[cryptoUtil.ts:98](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/cryptoUtil.ts#L98)

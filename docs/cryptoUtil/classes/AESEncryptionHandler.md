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

#### Source

[src/cryptoUtil.ts:88](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/cryptoUtil.ts#L88)

## Properties

### #key

> `private` `readonly` **#key**: `Buffer`

#### Source

[src/cryptoUtil.ts:82](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/cryptoUtil.ts#L82)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/cryptoUtil.ts:81](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/cryptoUtil.ts#L81)

***

### #counter

> `static` `private` **#counter**: `0`

#### Source

[src/cryptoUtil.ts:80](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/cryptoUtil.ts#L80)

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

#### Source

[src/cryptoUtil.ts:114](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/cryptoUtil.ts#L114)

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

#### Source

[src/cryptoUtil.ts:98](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/cryptoUtil.ts#L98)

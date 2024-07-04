[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [util](../README.md) / AESEncryptionHandler

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

[src/util.ts:89](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/util.ts#L89)

## Properties

### #key

> `private` `readonly` **#key**: `Buffer`

#### Source

[src/util.ts:83](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/util.ts#L83)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/util.ts:82](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/util.ts#L82)

***

### #counter

> `static` `private` **#counter**: `0`

#### Source

[src/util.ts:81](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/util.ts#L81)

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

[src/util.ts:115](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/util.ts#L115)

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

[src/util.ts:99](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/util.ts#L99)

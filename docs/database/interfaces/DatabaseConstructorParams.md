[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseConstructorParams

# Interface: DatabaseConstructorParams

## Properties

### key

> **key**: `string` \| `Buffer`\<`ArrayBufferLike`\>

AES-256 GCM 32-byte key (base64 string)

#### Defined in

[database.ts:16](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L16)

***

### logger

> **logger**: [`Logger`](../../log/classes/Logger.md)

Logging instance

#### Defined in

[database.ts:20](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L20)

***

### sslCert?

> `optional` **sslCert**: `string` \| `Buffer`\<`ArrayBufferLike`\>

Optional SSL Certificate

#### Defined in

[database.ts:18](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L18)

***

### uri

> **uri**: `string`

Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)

#### Defined in

[database.ts:14](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L14)

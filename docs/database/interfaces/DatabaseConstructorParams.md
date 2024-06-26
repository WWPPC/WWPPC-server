[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseConstructorParams

# Interface: DatabaseConstructorParams

## Properties

### key

> **key**: `string` \| `Buffer`

AES-256 GCM 32-byte key (base64 string)

#### Source

[src/database.ts:17](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L17)

***

### logger

> **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logging instance

#### Source

[src/database.ts:21](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L21)

***

### sslCert?

> `optional` **sslCert**: `string` \| `Buffer`

Optional SSL Certificate

#### Source

[src/database.ts:19](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L19)

***

### uri

> **uri**: `string`

Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)

#### Source

[src/database.ts:15](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L15)

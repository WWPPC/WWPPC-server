[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseConstructorParams

# Interface: DatabaseConstructorParams

## Properties

### key

> **key**: `string` \| `Buffer`

AES-256 GCM 32-byte key (base64 string)

#### Defined in

[database.ts:16](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L16)

***

### logger

> **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logging instance

#### Defined in

[database.ts:20](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L20)

***

### sslCert?

> `optional` **sslCert**: `string` \| `Buffer`

Optional SSL Certificate

#### Defined in

[database.ts:18](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L18)

***

### uri

> **uri**: `string`

Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)

#### Defined in

[database.ts:14](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L14)

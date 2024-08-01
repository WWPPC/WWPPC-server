[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseConstructorParams

# Interface: DatabaseConstructorParams

## Properties

### key

> **key**: `string` \| `Buffer`

AES-256 GCM 32-byte key (base64 string)

#### Source

[src/database.ts:16](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L16)

***

### logger

> **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logging instance

#### Source

[src/database.ts:20](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L20)

***

### sslCert?

> `optional` **sslCert**: `string` \| `Buffer`

Optional SSL Certificate

#### Source

[src/database.ts:18](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L18)

***

### uri

> **uri**: `string`

Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)

#### Source

[src/database.ts:14](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L14)

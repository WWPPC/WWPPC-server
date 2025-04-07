[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseConstructorParams

# Type Alias: DatabaseConstructorParams

> **DatabaseConstructorParams**: `object`

## Type declaration

### key

> **key**: `string` \| `Buffer`

AES-256 GCM 32-byte key (base64 string or buffer)

### logger

> **logger**: [`Logger`](../../log/classes/Logger.md)

Logging instance

### sslCert?

> `optional` **sslCert**: `string` \| `Buffer`

Optional SSL Certificate

### uri

> **uri**: `string`

Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)

## Defined in

[database.ts:12](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/database.ts#L12)

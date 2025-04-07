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

[database.ts:12](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L12)

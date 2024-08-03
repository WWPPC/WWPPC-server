[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseConstructorParams

# Interface: DatabaseConstructorParams

## Properties

### key

> **key**: `string` \| `Buffer`

AES-256 GCM 32-byte key (base64 string)

#### Defined in

[database.ts:16](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L16)

***

### logger

> **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logging instance

#### Defined in

[database.ts:20](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L20)

***

### sslCert?

> `optional` **sslCert**: `string` \| `Buffer`

Optional SSL Certificate

#### Defined in

[database.ts:18](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L18)

***

### uri

> **uri**: `string`

Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)

#### Defined in

[database.ts:14](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L14)

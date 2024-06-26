[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseConstructorParams

# Interface: DatabaseConstructorParams

## Properties

### key

> **key**: `string` \| `Buffer`

AES-256 GCM 32-byte key (base64 string)

#### Source

[src/database.ts:17](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L17)

***

### logger

> **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logging instance

#### Source

[src/database.ts:21](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L21)

***

### mailer

> **mailer**: [`Mailer`](../../email/classes/Mailer.md)

Nodemailer wrapper instance

#### Source

[src/database.ts:23](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L23)

***

### sslCert?

> `optional` **sslCert**: `string` \| `Buffer`

Optional SSL Certificate

#### Source

[src/database.ts:19](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L19)

***

### uri

> **uri**: `string`

Valid PostgreSQL connection URI (postgresql://username:password@host:port/database)

#### Source

[src/database.ts:15](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L15)

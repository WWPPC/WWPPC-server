[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [auth](../README.md) / ClientAuth

# Class: ClientAuth

Bundles code for client authentication into a single class.

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[auth.ts:20](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L20)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[auth.ts:19](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L19)

***

### encryption

> `readonly` **encryption**: [`RSAEncryptionHandler`](../../cryptoUtil/classes/RSAEncryptionHandler.md)

#### Defined in

[auth.ts:22](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L22)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[auth.ts:23](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L23)

***

### mailer

> `readonly` **mailer**: [`Mailer`](../../email/classes/Mailer.md)

#### Defined in

[auth.ts:21](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L21)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Defined in

[auth.ts:28](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L28)

## Methods

### getTokenUsername()

> **getTokenUsername**(`token`): `null` \| `string`

#### Parameters

##### token

`any`

#### Returns

`null` \| `string`

#### Defined in

[auth.ts:270](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L270)

***

### isTokenValid()

> **isTokenValid**(`token`): `boolean`

#### Parameters

##### token

`any`

#### Returns

`boolean`

#### Defined in

[auth.ts:266](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L266)

***

### init()

> `static` **init**(`db`, `app`, `mailer`): [`ClientAuth`](ClientAuth.md)

Initialize the ClientAuth system.

#### Parameters

##### db

[`Database`](../../database/classes/Database.md)

Database connection

##### app

`Express`

Express app (HTTP server) to attach API to

##### mailer

[`Mailer`](../../email/classes/Mailer.md)

SMTP mailing server connection

#### Returns

[`ClientAuth`](ClientAuth.md)

#### Defined in

[auth.ts:280](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L280)

***

### use()

> `static` **use**(): [`ClientAuth`](ClientAuth.md)

Get the ClientAuth system.

#### Returns

[`ClientAuth`](ClientAuth.md)

#### Defined in

[auth.ts:287](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/auth.ts#L287)

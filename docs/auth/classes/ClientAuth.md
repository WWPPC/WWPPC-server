[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [auth](../README.md) / ClientAuth

# Class: ClientAuth

Bundles code for client authentication into a single class.

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[auth.ts:20](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L20)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[auth.ts:19](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L19)

***

### encryption

> `readonly` **encryption**: [`RSAEncryptionHandler`](../../cryptoUtil/classes/RSAEncryptionHandler.md)

#### Defined in

[auth.ts:22](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L22)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[auth.ts:23](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L23)

***

### mailer

> `readonly` **mailer**: [`Mailer`](../../email/classes/Mailer.md)

#### Defined in

[auth.ts:21](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L21)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Defined in

[auth.ts:28](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L28)

## Methods

### getTokenUsername()

> **getTokenUsername**(`token`): `null` \| `string`

Get the username associated with a session token.

#### Parameters

##### token

`any`

Session token string

#### Returns

`null` \| `string`

Username, or null if not connected to a username

#### Defined in

[auth.ts:306](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L306)

***

### isTokenValid()

> **isTokenValid**(`token`): `boolean`

Check if a session token exists and is connected to a username.

#### Parameters

##### token

`any`

Session token string

#### Returns

`boolean`

Token is valid

#### Defined in

[auth.ts:297](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L297)

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

[auth.ts:316](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L316)

***

### use()

> `static` **use**(): [`ClientAuth`](ClientAuth.md)

Get the ClientAuth system.

#### Returns

[`ClientAuth`](ClientAuth.md)

#### Defined in

[auth.ts:323](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/auth.ts#L323)

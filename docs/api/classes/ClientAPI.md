[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [api](../README.md) / ClientAPI

# Class: ClientAPI

Bundles general API functions into a single class.

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[api.ts:27](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/api.ts#L27)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[api.ts:26](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/api.ts#L26)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[api.ts:29](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/api.ts#L29)

***

### mailer

> `readonly` **mailer**: [`Mailer`](../../email/classes/Mailer.md)

#### Defined in

[api.ts:28](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/api.ts#L28)

***

### validAccountData

> `readonly` `static` **validAccountData**: `object`

Valid input values for fields within account data.

#### experienceLevels

> `readonly` **experienceLevels**: readonly [`0`, `1`, `2`, `3`, `4`]

#### grades

> `readonly` **grades**: readonly [`8`, `9`, `10`, `11`, `12`, `13`, `14`]

#### languages

> `readonly` **languages**: readonly [`"python"`, `"c"`, `"cpp"`, `"cs"`, `"java"`, `"js"`, `"sql"`, `"asm"`, `"php"`, `"swift"`, `"pascal"`, `"ruby"`, `"rust"`, `"scratch"`, `"g"`, `"ktx"`, `"lua"`, `"bash"`]

#### Defined in

[api.ts:20](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/api.ts#L20)

## Methods

### init()

> `static` **init**(`db`, `app`, `mailer`): [`ClientAPI`](ClientAPI.md)

Initialize the client API.

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

[`ClientAPI`](ClientAPI.md)

#### Defined in

[api.ts:264](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/api.ts#L264)

***

### use()

> `static` **use**(): [`ClientAPI`](ClientAPI.md)

Get the client API instance.

#### Returns

[`ClientAPI`](ClientAPI.md)

#### Defined in

[api.ts:271](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/api.ts#L271)

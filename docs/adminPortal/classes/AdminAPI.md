[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [adminPortal](../README.md) / AdminAPI

# Class: AdminAPI

Bundles administrator API into a single class.

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[adminPortal.ts:25](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/adminPortal.ts#L25)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[adminPortal.ts:24](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/adminPortal.ts#L24)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[adminPortal.ts:26](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/adminPortal.ts#L26)

## Methods

### init()

> `static` **init**(`db`, `app`): [`AdminAPI`](AdminAPI.md)

Initialize the admin API.

#### Parameters

##### db

[`Database`](../../database/classes/Database.md)

Database connection

##### app

`Express`

Express app (HTTP server) to attach API to

#### Returns

[`AdminAPI`](AdminAPI.md)

#### Defined in

[adminPortal.ts:409](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/adminPortal.ts#L409)

***

### use()

> `static` **use**(): [`AdminAPI`](AdminAPI.md)

Get the admin API instance.

#### Returns

[`AdminAPI`](AdminAPI.md)

#### Defined in

[adminPortal.ts:416](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/adminPortal.ts#L416)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [adminPortal](../README.md) / AdminAPI

# Class: AdminAPI

Bundles administrator API into a single class.

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[adminPortal.ts:25](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/adminPortal.ts#L25)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[adminPortal.ts:24](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/adminPortal.ts#L24)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[adminPortal.ts:26](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/adminPortal.ts#L26)

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

[adminPortal.ts:407](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/adminPortal.ts#L407)

***

### use()

> `static` **use**(): [`AdminAPI`](AdminAPI.md)

Get the admin API instance.

#### Returns

[`AdminAPI`](AdminAPI.md)

#### Defined in

[adminPortal.ts:414](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/adminPortal.ts#L414)

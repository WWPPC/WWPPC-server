[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [upsolve](../README.md) / UpsolveManager

# Class: UpsolveManager

`UpsolveManager` allows viewing and submitting to problems of past contests.

## Constructors

### new UpsolveManager()

> **new UpsolveManager**(`db`, `app`, `grader`): [`UpsolveManager`](UpsolveManager.md)

#### Parameters

##### db

[`Database`](../../database/classes/Database.md)

##### app

`Express`

##### grader

[`Grader`](../../grader/classes/Grader.md)

#### Returns

[`UpsolveManager`](UpsolveManager.md)

#### Defined in

[upsolve.ts:28](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L28)

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[upsolve.ts:18](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L18)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[upsolve.ts:17](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L17)

***

### eventEmitter

> `readonly` **eventEmitter**: [`LongPollEventEmitter`](../../netUtil/classes/LongPollEventEmitter.md)\<`object`\>

#### Defined in

[upsolve.ts:19](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L19)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[upsolve.ts:20](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L20)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[upsolve.ts:21](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L21)

## Methods

### addUser()

> **addUser**(`s`): `Promise`\<`void`\>

Add a username-linked SocketIO connection to the user list.

#### Parameters

##### s

`any`

SocketIO connection (with modifications)

#### Returns

`Promise`\<`void`\>

#### Defined in

[upsolve.ts:144](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L144)

***

### close()

> **close**(): `void`

Closes the upsolve manager

#### Returns

`void`

#### Defined in

[upsolve.ts:275](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L275)

***

### init()

> `static` **init**(`db`, `app`, `grader`): [`UpsolveManager`](UpsolveManager.md)

Initialize the UpsolveManager system.

#### Parameters

##### db

[`Database`](../../database/classes/Database.md)

Database connection

##### app

`Express`

Express app (HTTP server) to attach API to

##### grader

[`Grader`](../../grader/classes/Grader.md)

Grading system to use

#### Returns

[`UpsolveManager`](UpsolveManager.md)

#### Defined in

[upsolve.ts:128](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L128)

***

### use()

> `static` **use**(): [`UpsolveManager`](UpsolveManager.md)

Get the UpsolveManager system.

#### Returns

[`UpsolveManager`](UpsolveManager.md)

#### Defined in

[upsolve.ts:135](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L135)

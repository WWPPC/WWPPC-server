[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [upsolve](../README.md) / UpsolveManager

# Class: UpsolveManager

`UpsolveManager` allows viewing and submitting to problems of past contests.

## Constructors

### new UpsolveManager()

> **new UpsolveManager**(`db`, `app`, `grader`, `logger`): [`UpsolveManager`](UpsolveManager.md)

#### Parameters

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **app**: `Express`

Express app (HTTP server) to attach API to

• **grader**: [`Grader`](../../grader/classes/Grader.md)

Grading system to use

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`UpsolveManager`](UpsolveManager.md)

#### Defined in

[upsolve.ts:30](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/upsolve.ts#L30)

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[upsolve.ts:18](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/upsolve.ts#L18)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[upsolve.ts:17](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/upsolve.ts#L17)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[upsolve.ts:20](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/upsolve.ts#L20)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[upsolve.ts:19](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/upsolve.ts#L19)

## Methods

### addUser()

> **addUser**(`s`): `Promise`\<`void`\>

Add a username-linked SocketIO connection to the user list.

#### Parameters

• **s**: [`ServerSocket`](../../clients/interfaces/ServerSocket.md)

SocketIO connection (with modifications)

#### Returns

`Promise`\<`void`\>

#### Defined in

[upsolve.ts:127](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/upsolve.ts#L127)

***

### close()

> **close**(): `void`

Closes the upsolve manager

#### Returns

`void`

#### Defined in

[upsolve.ts:258](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/upsolve.ts#L258)

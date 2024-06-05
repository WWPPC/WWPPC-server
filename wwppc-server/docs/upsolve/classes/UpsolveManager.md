[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [upsolve](../README.md) / UpsolveManager

# Class: UpsolveManager

`UpsolveManager` allows viewing and submitting to problems of past contests.

## Constructors

### new UpsolveManager()

> **new UpsolveManager**(`db`, `app`, `logger`): [`UpsolveManager`](UpsolveManager.md)

#### Parameters

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **app**: `Express`

Express app (HTTP server) to attach API to

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`UpsolveManager`](UpsolveManager.md)

#### Source

[src/upsolve.ts:30](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L30)

## Properties

### #grader

> `private` `readonly` **#grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/upsolve.ts:21](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L21)

***

### #open

> `private` **#open**: `boolean` = `true`

#### Source

[src/upsolve.ts:23](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L23)

***

### #sockets

> `private` `readonly` **#sockets**: `Set`\<`ServerSocket`\>

#### Source

[src/upsolve.ts:16](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L16)

***

### app

> `readonly` **app**: `Express`

#### Source

[src/upsolve.ts:19](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L19)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/upsolve.ts:18](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L18)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/upsolve.ts:20](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L20)

## Methods

### #getCompletionState()

> `private` **#getCompletionState**(`round`, `scores`): [`ClientProblemCompletionState`](../../contest/enumerations/ClientProblemCompletionState.md)

#### Parameters

• **round**: `number`

• **scores**: `undefined` \| [`Score`](../../database/interfaces/Score.md)[]

#### Returns

[`ClientProblemCompletionState`](../../contest/enumerations/ClientProblemCompletionState.md)

#### Source

[src/upsolve.ts:178](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L178)

***

### addUser()

> **addUser**(`s`): `Promise`\<`void`\>

Add a username-linked SocketIO connection to the user list.

#### Parameters

• **s**: `ServerSocket`

SocketIO connection (with modifications)

#### Returns

`Promise`\<`void`\>

#### Source

[src/upsolve.ts:145](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L145)

***

### close()

> **close**(): `void`

Closes the upsolve manager

#### Returns

`void`

#### Source

[src/upsolve.ts:191](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/upsolve.ts#L191)

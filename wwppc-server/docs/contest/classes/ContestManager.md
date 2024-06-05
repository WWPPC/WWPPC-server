[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestManager

# Class: ContestManager

`ContestManager` handles automatic contest running and interfacing with clients.
It will automatically start and stop contests, advance rounds, and process submissions and leaderboards.

## Constructors

### new ContestManager()

> **new ContestManager**(`db`, `app`, `io`, `logger`): [`ContestManager`](ContestManager.md)

#### Parameters

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **app**: `Express`

Express app (HTTP server) to attach API to

• **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

Socket.IO server

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`ContestManager`](ContestManager.md)

#### Source

[src/contest.ts:37](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L37)

## Properties

### #contests

> `private` `readonly` **#contests**: `Map`\<`string`, [`ContestHost`](ContestHost.md)\>

#### Source

[src/contest.ts:20](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L20)

***

### #grader

> `private` `readonly` **#grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/contest.ts:27](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L27)

***

### #open

> `private` **#open**: `boolean` = `true`

#### Source

[src/contest.ts:29](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L29)

***

### #sockets

> `private` `readonly` **#sockets**: `Set`\<`ServerSocket`\>

#### Source

[src/contest.ts:19](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L19)

***

### #updateLoop

> `private` `readonly` **#updateLoop**: `Timeout`

#### Source

[src/contest.ts:21](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L21)

***

### app

> `readonly` **app**: `Express`

#### Source

[src/contest.ts:24](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L24)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/contest.ts:23](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L23)

***

### io

> `readonly` **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Source

[src/contest.ts:25](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L25)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/contest.ts:26](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L26)

## Methods

### addUser()

> **addUser**(`s`): `Promise`\<`void`\>

Add a username-linked SocketIO connection to the user list.

#### Parameters

• **s**: `ServerSocket`

SocketIO connection (with modifications)

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:77](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L77)

***

### close()

> **close**(): `void`

Stops all contests and closes the contest manager

#### Returns

`void`

#### Source

[src/contest.ts:172](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L172)

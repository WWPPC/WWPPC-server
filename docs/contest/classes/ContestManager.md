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

[src/contest.ts:36](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L36)

## Properties

### #contests

> `private` `readonly` **#contests**: `Map`\<`string`, [`ContestHost`](ContestHost.md)\>

#### Source

[src/contest.ts:19](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L19)

***

### #grader

> `private` `readonly` **#grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/contest.ts:26](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L26)

***

### #open

> `private` **#open**: `boolean` = `true`

#### Source

[src/contest.ts:28](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L28)

***

### #sockets

> `private` `readonly` **#sockets**: `Set`\<`ServerSocket`\>

#### Source

[src/contest.ts:18](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L18)

***

### #updateLoop

> `private` `readonly` **#updateLoop**: `Timeout`

#### Source

[src/contest.ts:20](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L20)

***

### app

> `readonly` **app**: `Express`

#### Source

[src/contest.ts:23](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L23)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/contest.ts:22](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L22)

***

### io

> `readonly` **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Source

[src/contest.ts:24](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L24)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/contest.ts:25](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L25)

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

[src/contest.ts:76](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L76)

***

### close()

> **close**(): `void`

Stops all contests and closes the contest manager

#### Returns

`void`

#### Source

[src/contest.ts:172](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L172)

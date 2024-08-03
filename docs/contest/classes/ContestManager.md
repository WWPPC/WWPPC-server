[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestManager

# Class: ContestManager

`ContestManager` handles automatic contest running and interfacing with clients.
It will automatically start and stop contests, advance rounds, and process submissions and leaderboards.

## Constructors

### new ContestManager()

> **new ContestManager**(`db`, `app`, `io`, `grader`, `logger`): [`ContestManager`](ContestManager.md)

#### Parameters

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **app**: `Express`

Express app (HTTP server) to attach API to

• **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

Socket.IO server

• **grader**: [`Grader`](../../grader/classes/Grader.md)

Grading system to use

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`ContestManager`](ContestManager.md)

#### Defined in

[contest.ts:38](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L38)

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[contest.ts:24](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L24)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[contest.ts:23](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L23)

***

### io

> `readonly` **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Defined in

[contest.ts:25](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L25)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[contest.ts:26](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L26)

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

[contest.ts:92](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L92)

***

### close()

> **close**(): `void`

Stops all contests and closes the contest manager

#### Returns

`void`

#### Defined in

[contest.ts:188](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L188)

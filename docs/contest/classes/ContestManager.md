[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestManager

# Class: ContestManager

`ContestManager` handles automatic contest running and interfacing with clients through HTTP.
It will automatically start and stop contests, advance rounds, and process submissions and leaderboards.

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[contest.ts:23](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L23)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[contest.ts:22](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L22)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[contest.ts:33](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L33)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[contest.ts:34](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L34)

## Methods

### close()

> **close**(): `void`

Stops all contests and closes the contest manager

#### Returns

`void`

#### Defined in

[contest.ts:428](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L428)

***

### getRunningContests()

> **getRunningContests**(): [`ContestHost`](ContestHost.md)[]

Get a list of running contests

#### Returns

[`ContestHost`](ContestHost.md)[]

the contests

#### Defined in

[contest.ts:421](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L421)

***

### init()

> `static` **init**(`db`, `app`, `grader`): [`ContestManager`](ContestManager.md)

Initialize the ContestManager system.

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

[`ContestManager`](ContestManager.md)

#### Defined in

[contest.ts:58](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L58)

***

### use()

> `static` **use**(): [`ContestManager`](ContestManager.md)

Get the ContestManager system.

#### Returns

[`ContestManager`](ContestManager.md)

#### Defined in

[contest.ts:65](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/contest.ts#L65)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [grader](../README.md) / Grader

# Class: Grader

Custom grading system that offloads grading to a network of other servers.

## Constructors

### new Grader()

> **new Grader**(`db`, `app`, `path`, `password`, `logger`): [`Grader`](Grader.md)

#### Parameters

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **app**: `Express`

Express app (HTTP server) to attach API to

• **path**: `string`

Path of API

• **password**: `string`

Global password for graders to authenticate with

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`Grader`](Grader.md)

#### Defined in

[grader.ts:32](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L32)

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[grader.ts:15](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L15)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[grader.ts:17](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L17)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[grader.ts:16](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L16)

## Methods

### cancelUngraded()

> **cancelUngraded**(`username`, `problemId`): `boolean`

Cancel all ungraded submissions from a user to a problem.

#### Parameters

• **username**: `string`

Username of submitter

• **problemId**: `string`

ID or problem

#### Returns

`boolean`

#### Defined in

[grader.ts:221](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L221)

***

### close()

> **close**(): `void`

Cancels all submissions and stops accepting submissions to the queue

#### Returns

`void`

#### Defined in

[grader.ts:264](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L264)

***

### queueUngraded()

> **queueUngraded**(`submission`, `cb`): `void`

Add a submission to the ungraded queue of submissions.

#### Parameters

• **submission**: [`Submission`](../../database/interfaces/Submission.md)

New submission

• **cb**

#### Returns

`void`

#### Defined in

[grader.ts:203](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L203)

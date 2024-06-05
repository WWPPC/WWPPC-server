[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [wwppcGrader](../README.md) / WwppcGrader

# Class: WwppcGrader

## Extends

- [`Grader`](../../grader/classes/Grader.md)

## Constructors

### new WwppcGrader()

> **new WwppcGrader**(`app`, `path`, `password`, `logger`, `db`): [`WwppcGrader`](WwppcGrader.md)

#### Parameters

• **app**: `Express`

Express app (HTTP server) to attach api to

• **path**: `string`

path of of API

• **password**: `string`

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

#### Returns

[`WwppcGrader`](WwppcGrader.md)

#### Overrides

[`Grader`](../../grader/classes/Grader.md).[`constructor`](../../grader/classes/Grader.md#constructors)

#### Source

[src/wwppcGrader.ts:32](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L32)

## Properties

### #nodes

> `private` `readonly` **#nodes**: `Map`\<`string`, [`GraderNode`](../interfaces/GraderNode.md)\>

#### Source

[src/wwppcGrader.ts:13](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L13)

***

### #open

> `private` **#open**: `boolean` = `true`

#### Source

[src/wwppcGrader.ts:22](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L22)

***

### #password

> `private` `readonly` **#password**: `string`

#### Source

[src/wwppcGrader.ts:20](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L20)

***

### #path

> `private` `readonly` **#path**: `string`

#### Source

[src/wwppcGrader.ts:19](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L19)

***

### #ungradedSubmissions

> `private` **#ungradedSubmissions**: [`SubmissionWithCallback`](../interfaces/SubmissionWithCallback.md)[] = `[]`

#### Source

[src/wwppcGrader.ts:24](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L24)

***

### app

> `readonly` **app**: `Express`

#### Source

[src/wwppcGrader.ts:16](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L16)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/wwppcGrader.ts:18](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L18)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/wwppcGrader.ts:17](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L17)

## Methods

### #getAuth()

> `private` **#getAuth**(`req`): `string` \| `number`

#### Parameters

• **req**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

#### Returns

`string` \| `number`

#### Source

[src/wwppcGrader.ts:246](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L246)

***

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

#### Overrides

[`Grader`](../../grader/classes/Grader.md).[`cancelUngraded`](../../grader/classes/Grader.md#cancelungraded)

#### Source

[src/wwppcGrader.ts:219](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L219)

***

### close()

> **close**(): `void`

Cancels all submissions and stops accepting submissions to the queue

#### Returns

`void`

#### Overrides

[`Grader`](../../grader/classes/Grader.md).[`close`](../../grader/classes/Grader.md#close)

#### Source

[src/wwppcGrader.ts:259](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L259)

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

#### Overrides

[`Grader`](../../grader/classes/Grader.md).[`queueUngraded`](../../grader/classes/Grader.md#queueungraded)

#### Source

[src/wwppcGrader.ts:206](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L206)

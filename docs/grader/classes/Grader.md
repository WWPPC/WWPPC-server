[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [grader](../README.md) / Grader

# Class: Grader

Custom grading system that offloads grading to a network of other servers.

## Constructors

### new Grader()

> **new Grader**(`app`, `path`, `password`, `logger`, `db`): [`Grader`](Grader.md)

#### Parameters

• **app**: `Express`

Express app (HTTP server) to attach API to

• **path**: `string`

Path of API

• **password**: `string`

Global password for graders to authenticate with

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

#### Returns

[`Grader`](Grader.md)

#### Source

[src/grader.ts:32](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L32)

## Properties

### #nodes

> `private` `readonly` **#nodes**: `Map`\<`string`, [`GraderNode`](../interfaces/GraderNode.md)\>

#### Source

[src/grader.ts:13](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L13)

***

### #open

> `private` **#open**: `boolean` = `true`

#### Source

[src/grader.ts:21](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L21)

***

### #password

> `private` `readonly` **#password**: `string`

#### Source

[src/grader.ts:19](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L19)

***

### #path

> `private` `readonly` **#path**: `string`

#### Source

[src/grader.ts:18](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L18)

***

### #ungradedSubmissions

> `private` **#ungradedSubmissions**: [`SubmissionWithCallback`](../interfaces/SubmissionWithCallback.md)[] = `[]`

#### Source

[src/grader.ts:23](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L23)

***

### app

> `readonly` **app**: `Express`

#### Source

[src/grader.ts:15](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L15)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/grader.ts:17](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L17)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/grader.ts:16](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L16)

## Methods

### #getAuth()

> `private` **#getAuth**(`req`): `string` \| `number`

#### Parameters

• **req**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

#### Returns

`string` \| `number`

#### Source

[src/grader.ts:257](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L257)

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

#### Source

[src/grader.ts:230](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L230)

***

### close()

> **close**(): `void`

Cancels all submissions and stops accepting submissions to the queue

#### Returns

`void`

#### Source

[src/grader.ts:273](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L273)

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

#### Source

[src/grader.ts:212](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L212)

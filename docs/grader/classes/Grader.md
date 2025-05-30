[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [grader](../README.md) / Grader

# Class: Grader

Custom grading system that offloads grading to a network of other servers.

## Constructors

### new Grader()

> **new Grader**(`db`, `app`, `path`, `password`, `logger`): [`Grader`](Grader.md)

#### Parameters

##### db

[`Database`](../../database/classes/Database.md)

Database connection

##### app

`Express`

Express app (HTTP server) to attach API to

##### path

`string`

Path of API

##### password

`string`

Global password for graders to authenticate with

##### logger

[`Logger`](../../log/classes/Logger.md)

Logger instance

#### Returns

[`Grader`](Grader.md)

#### Defined in

[grader.ts:32](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L32)

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[grader.ts:15](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L15)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[grader.ts:17](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L17)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[grader.ts:16](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L16)

## Methods

### cancelUngraded()

> **cancelUngraded**(`team`, `problemId`): `boolean`

Cancel all ungraded submissions from a user to a problem.

#### Parameters

##### team

`number`

Team of submitter

##### problemId

`string`

ID or problem

#### Returns

`boolean`

#### Defined in

[grader.ts:222](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L222)

***

### close()

> **close**(): `void`

Cancels all submissions and stops accepting submissions to the queue

#### Returns

`void`

#### Defined in

[grader.ts:265](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L265)

***

### queueUngraded()

> **queueUngraded**(`submission`, `cb`): `void`

Add a submission to the ungraded queue of submissions.

#### Parameters

##### submission

[`Submission`](../../database/type-aliases/Submission.md)

New submission

##### cb

(`graded`) => `any`

#### Returns

`void`

#### Defined in

[grader.ts:204](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L204)

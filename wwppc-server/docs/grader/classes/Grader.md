[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [grader](../README.md) / Grader

# Class: `abstract` Grader

## Extended by

- [`WwppcGrader`](../../wwppcGrader/classes/WwppcGrader.md)

## Constructors

### new Grader()

> **new Grader**(): [`Grader`](Grader.md)

#### Returns

[`Grader`](Grader.md)

## Methods

### cancelUngraded()

> `abstract` **cancelUngraded**(`username`, `problemId`): `boolean`

Cancel all ungraded submissions from a user to a problem.

#### Parameters

• **username**: `string`

Username of submitter

• **problemId**: `string`

ID or problem

#### Returns

`boolean`

#### Source

[src/grader.ts:15](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/grader.ts#L15)

***

### close()

> `abstract` **close**(): `any`

Cancels all submissions and stops accepting submissions to the queue

#### Returns

`any`

#### Source

[src/grader.ts:19](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/grader.ts#L19)

***

### queueUngraded()

> `abstract` **queueUngraded**(`submission`, `cb`?): `any`

Add a submission to the ungraded queue of submissions.

#### Parameters

• **submission**: [`Submission`](../../database/interfaces/Submission.md)

New submission

• **cb?**

#### Returns

`any`

#### Source

[src/grader.ts:9](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/grader.ts#L9)

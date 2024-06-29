[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [grader](../README.md) / SubmissionWithCallback

# Interface: SubmissionWithCallback

Internal submission of `Grader` class.

## Properties

### callback()?

> `optional` **callback**: (`graded`) => `any`

Function supplied by queueUngraded to send submission to after grading is finished/cancelled

#### Parameters

• **graded**: `null` \| [`Submission`](../../database/interfaces/Submission.md)

#### Returns

`any`

#### Source

[src/grader.ts:293](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/grader.ts#L293)

***

### cancelled

> **cancelled**: `boolean`

If the submission was cancelled

#### Source

[src/grader.ts:297](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/grader.ts#L297)

***

### returnCount

> **returnCount**: `number`

How many times the grading servers have failed grading this (returned)

#### Source

[src/grader.ts:295](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/grader.ts#L295)

***

### submission

> **submission**: [`Submission`](../../database/interfaces/Submission.md)

The submission itself

#### Source

[src/grader.ts:291](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/grader.ts#L291)

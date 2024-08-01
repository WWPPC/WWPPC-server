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

[src/grader.ts:284](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L284)

***

### cancelled

> **cancelled**: `boolean`

If the submission was cancelled

#### Source

[src/grader.ts:288](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L288)

***

### returnCount

> **returnCount**: `number`

How many times the grading servers have failed grading this (returned)

#### Source

[src/grader.ts:286](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L286)

***

### submission

> **submission**: [`Submission`](../../database/interfaces/Submission.md)

The submission itself

#### Source

[src/grader.ts:282](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L282)

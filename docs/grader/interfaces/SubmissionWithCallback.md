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

#### Defined in

[grader.ts:284](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L284)

***

### cancelled

> **cancelled**: `boolean`

If the submission was cancelled

#### Defined in

[grader.ts:288](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L288)

***

### returnCount

> **returnCount**: `number`

How many times the grading servers have failed grading this (returned)

#### Defined in

[grader.ts:286](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L286)

***

### submission

> **submission**: [`Submission`](../../database/interfaces/Submission.md)

The submission itself

#### Defined in

[grader.ts:282](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L282)

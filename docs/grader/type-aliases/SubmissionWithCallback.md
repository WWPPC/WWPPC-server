[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [grader](../README.md) / SubmissionWithCallback

# Type Alias: SubmissionWithCallback

> **SubmissionWithCallback**: `object`

Internal submission of `Grader` class.

## Type declaration

### callback()?

> `optional` **callback**: (`graded`) => `any`

Function supplied by queueUngraded to send submission to after grading is finished/cancelled

#### Parameters

##### graded

[`Submission`](../../database/type-aliases/Submission.md) | `null`

#### Returns

`any`

### cancelled

> **cancelled**: `boolean`

If the grading was cancelled (due to manual trigger or excessive failed attempts to grade the submission)

### returnCount

> **returnCount**: `number`

How many times the grading servers have failed grading this (returned)

### submission

> **submission**: [`Submission`](../../database/type-aliases/Submission.md)

The submission itself

## Defined in

[grader.ts:280](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/grader.ts#L280)

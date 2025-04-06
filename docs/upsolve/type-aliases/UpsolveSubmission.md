[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [upsolve](../README.md) / UpsolveSubmission

# Type Alias: UpsolveSubmission

> **UpsolveSubmission**: `object`

Slightly modified version of [Submission](../../database/type-aliases/Submission.md)

## Type declaration

### lang

> **lang**: `string`

### problemId

> `readonly` **problemId**: `string`

### scores

> **scores**: [`Score`](../../database/type-aliases/Score.md)[]

### status

> **status**: [`ClientProblemCompletionState`](../../api/enumerations/ClientProblemCompletionState.md)

### time

> **time**: `number`

## Defined in

[upsolve.ts:307](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/upsolve.ts#L307)

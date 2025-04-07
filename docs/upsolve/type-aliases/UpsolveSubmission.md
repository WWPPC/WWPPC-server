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

[upsolve.ts:307](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/upsolve.ts#L307)

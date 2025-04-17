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

[upsolve.ts:309](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/upsolve.ts#L309)

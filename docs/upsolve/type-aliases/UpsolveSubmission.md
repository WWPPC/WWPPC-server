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

[upsolve.ts:309](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/upsolve.ts#L309)

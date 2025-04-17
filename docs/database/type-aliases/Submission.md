[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / Submission

# Type Alias: Submission

> **Submission**: `object`

Descriptor for a single submission

## Type declaration

### analysis

> **analysis**: `boolean`

If the submission was submitted through the upsolve system

### file

> **file**: `string`

Contents of the submission file

### id

> `readonly` **id**: [`UUID`](../../util/type-aliases/UUID.md)

UUID

### language

> **language**: `string`

Submission language

### problemId

> `readonly` **problemId**: [`UUID`](../../util/type-aliases/UUID.md)

UUID of problem submitted to

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

### team

> `readonly` **team**: `number` \| `null`

Team of submitter at the time of submission

### time

> **time**: `number`

Time of submission, UNIX milliseconds

### username

> `readonly` **username**: `string`

Username of submitter

## Defined in

[database.ts:1679](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1679)

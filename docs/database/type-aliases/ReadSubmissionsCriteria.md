[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadSubmissionsCriteria

# Type Alias: ReadSubmissionsCriteria

> **ReadSubmissionsCriteria**: `object`

Criteria to filter by. Leaving a value undefined removes the criteria

## Type declaration

### analysis?

> `optional` **analysis**: `boolean`

If the submission was submitted through the upsolve system

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

### id?

> `optional` **id**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<[`UUID`](../../util/type-aliases/UUID.md)\>

UUID

### problemId?

> `optional` **problemId**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<[`UUID`](../../util/type-aliases/UUID.md)\>

UUID of problem

### team?

> `optional` **team**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number` \| `null`\>

Username of submitter

### time?

> `optional` **time**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

Time of submission

### username?

> `optional` **username**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string`\>

Username of submitter

## Defined in

[database.ts:1770](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1770)

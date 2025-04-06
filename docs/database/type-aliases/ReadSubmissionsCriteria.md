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

> `optional` **team**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string` \| `null`\>

Username of submitter

### time?

> `optional` **time**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

Time of submission

### username?

> `optional` **username**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string`\>

Username of submitter

## Defined in

[database.ts:1724](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L1724)

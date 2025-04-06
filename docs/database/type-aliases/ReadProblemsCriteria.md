[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadProblemsCriteria

# Type Alias: ReadProblemsCriteria

> **ReadProblemsCriteria**: `object`

Criteria to filter by. Leaving a value undefined removes the criteria

## Type declaration

### author?

> `optional` **author**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string`\>

Author username of problem

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

### id?

> `optional` **id**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<[`UUID`](../../util/type-aliases/UUID.md)\>

UUID of problem

### name?

> `optional` **name**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string`\>

Display name of problem

## Defined in

[database.ts:1713](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L1713)

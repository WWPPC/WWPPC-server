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

[database.ts:1759](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1759)

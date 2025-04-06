[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / ProblemRoundCriteria

# Type Alias: ProblemRoundCriteria

> **ProblemRoundCriteria**: `object`

Contest-based filter including contest, round, problem number, and round ID

## Type declaration

### contest?

> `optional` **contest**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string`\>

Contest ID

### number?

> `optional` **number**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

Zero-indexed problem number within the round

### round?

> `optional` **round**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

Zero-indexed round within the contest

### roundId?

> `optional` **roundId**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<[`UUID`](../../util/type-aliases/UUID.md)\>

Round ID (will break filters if used in conjunction with contest/round)

## Defined in

[database.ts:1702](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L1702)

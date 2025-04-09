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

[database.ts:1740](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/database.ts#L1740)

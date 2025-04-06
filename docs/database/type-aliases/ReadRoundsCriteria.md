[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadRoundsCriteria

# Type Alias: ReadRoundsCriteria

> **ReadRoundsCriteria**: `object`

Criteria to filter by. Leaving a value undefined removes the criteria

## Type declaration

### contest?

> `optional` **contest**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string`\>

Contest ID

### endTime?

> `optional` **endTime**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

End of round, UNIX time

### id?

> `optional` **id**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<[`UUID`](../../util/type-aliases/UUID.md)\>

Round ID

### round?

> `optional` **round**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

Zero-indexed round within the contest

### startTime?

> `optional` **startTime**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

Start of round, UNIX time

## Defined in

[database.ts:1689](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1689)

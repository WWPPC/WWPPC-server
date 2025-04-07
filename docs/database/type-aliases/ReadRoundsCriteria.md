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

[database.ts:1690](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1690)

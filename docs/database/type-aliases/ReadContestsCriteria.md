[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadContestsCriteria

# Type Alias: ReadContestsCriteria

> **ReadContestsCriteria**: `object`

Criteria to filter by. Leaving a value undefined removes the criteria

## Type declaration

### endTime?

> `optional` **endTime**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

End of contest, UNIX time

### id?

> `optional` **id**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`string`\>

Contest ID

### public?

> `optional` **public**: `boolean`

If the contest is publicly archived once finished

### startTime?

> `optional` **startTime**: [`FilterComparison`](../../util/type-aliases/FilterComparison.md)\<`number`\>

Start of contest, UNIX time

### type?

> `optional` **type**: `string`

The tournament the contest is part of

## Defined in

[database.ts:1710](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/database.ts#L1710)

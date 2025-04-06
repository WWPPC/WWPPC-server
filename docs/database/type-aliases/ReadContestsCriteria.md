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

[database.ts:1676](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/database.ts#L1676)

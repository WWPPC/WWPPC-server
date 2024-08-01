[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadRoundsCriteria

# Interface: ReadRoundsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### contest?

> `optional` **contest**: `string` \| `string`[] \| `object` \| `object` \| `object`

Contest ID

#### Source

[src/database.ts:1474](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1474)

***

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

End of round, UNIX time

#### Source

[src/database.ts:1482](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1482)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Round ID

#### Source

[src/database.ts:1478](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1478)

***

### round?

> `optional` **round**: `number` \| `number`[] \| `object` \| `object` \| `object`

Zero-indexed round within the contest

#### Source

[src/database.ts:1476](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1476)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of round, UNIX time

#### Source

[src/database.ts:1480](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1480)

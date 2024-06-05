[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadContestsCriteria

# Interface: ReadContestsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

End of contest, UNIX time

#### Source

[src/database.ts:1551](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1551)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Contest ID

#### Source

[src/database.ts:1547](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1547)

***

### public?

> `optional` **public**: `boolean`

If the contest is publicly visible once archived

#### Source

[src/database.ts:1553](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1553)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of contest, UNIX time

#### Source

[src/database.ts:1549](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1549)

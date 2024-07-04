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

[src/database.ts:1496](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1496)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Contest ID

#### Source

[src/database.ts:1492](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1492)

***

### public?

> `optional` **public**: `boolean`

If the contest is publicly archived once finished

#### Source

[src/database.ts:1498](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1498)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of contest, UNIX time

#### Source

[src/database.ts:1494](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1494)

***

### type?

> `optional` **type**: [`ContestType`](../enumerations/ContestType.md)

The tournament the contest is part of

#### Source

[src/database.ts:1500](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1500)

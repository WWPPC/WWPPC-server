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

[src/database.ts:1521](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1521)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Contest ID

#### Source

[src/database.ts:1517](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1517)

***

### public?

> `optional` **public**: `boolean`

If the contest is publicly visible once archived

#### Source

[src/database.ts:1523](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1523)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of contest, UNIX time

#### Source

[src/database.ts:1519](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1519)

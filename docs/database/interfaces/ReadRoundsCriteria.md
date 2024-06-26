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

[src/database.ts:1528](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1528)

***

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

End of round, UNIX time

#### Source

[src/database.ts:1536](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1536)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Round ID

#### Source

[src/database.ts:1532](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1532)

***

### round?

> `optional` **round**: `number` \| `number`[] \| `object` \| `object` \| `object`

Zero-indexed round within the contest

#### Source

[src/database.ts:1530](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1530)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of round, UNIX time

#### Source

[src/database.ts:1534](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1534)

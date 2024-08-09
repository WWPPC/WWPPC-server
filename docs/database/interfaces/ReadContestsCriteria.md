[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadContestsCriteria

# Interface: ReadContestsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object` \| `object`

End of contest, UNIX time

#### Defined in

[database.ts:1579](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1579)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

Contest ID

#### Defined in

[database.ts:1575](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1575)

***

### public?

> `optional` **public**: `boolean`

If the contest is publicly archived once finished

#### Defined in

[database.ts:1581](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1581)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object` \| `object`

Start of contest, UNIX time

#### Defined in

[database.ts:1577](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1577)

***

### type?

> `optional` **type**: `string`

The tournament the contest is part of

#### Defined in

[database.ts:1583](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1583)

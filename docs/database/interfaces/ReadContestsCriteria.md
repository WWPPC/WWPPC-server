[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadContestsCriteria

# Interface: ReadContestsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

End of contest, UNIX time

#### Defined in

[database.ts:1467](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1467)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Contest ID

#### Defined in

[database.ts:1463](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1463)

***

### public?

> `optional` **public**: `boolean`

If the contest is publicly archived once finished

#### Defined in

[database.ts:1469](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1469)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of contest, UNIX time

#### Defined in

[database.ts:1465](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1465)

***

### type?

> `optional` **type**: `string`

The tournament the contest is part of

#### Defined in

[database.ts:1471](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1471)

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

[src/database.ts:1495](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1495)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Contest ID

#### Source

[src/database.ts:1491](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1491)

***

### public?

> `optional` **public**: `boolean`

If the contest is publicly archived once finished

#### Source

[src/database.ts:1497](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1497)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of contest, UNIX time

#### Source

[src/database.ts:1493](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1493)

***

### type?

> `optional` **type**: [`ContestType`](../enumerations/ContestType.md)

The tournament the contest is part of

#### Source

[src/database.ts:1499](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1499)

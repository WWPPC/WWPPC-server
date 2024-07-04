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

[src/database.ts:1504](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1504)

***

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

End of round, UNIX time

#### Source

[src/database.ts:1512](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1512)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Round ID

#### Source

[src/database.ts:1508](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1508)

***

### round?

> `optional` **round**: `number` \| `number`[] \| `object` \| `object` \| `object`

Zero-indexed round within the contest

#### Source

[src/database.ts:1506](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1506)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of round, UNIX time

#### Source

[src/database.ts:1510](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1510)

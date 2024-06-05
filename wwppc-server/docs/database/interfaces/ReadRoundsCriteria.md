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

[src/database.ts:1558](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1558)

***

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

End of round, UNIX time

#### Source

[src/database.ts:1566](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1566)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

Round ID

#### Source

[src/database.ts:1562](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1562)

***

### round?

> `optional` **round**: `number` \| `number`[] \| `object` \| `object` \| `object`

Zero-indexed round within the contest

#### Source

[src/database.ts:1560](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1560)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object`

Start of round, UNIX time

#### Source

[src/database.ts:1564](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1564)

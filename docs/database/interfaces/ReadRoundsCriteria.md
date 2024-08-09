[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadRoundsCriteria

# Interface: ReadRoundsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### contest?

> `optional` **contest**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

Contest ID

#### Defined in

[database.ts:1588](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1588)

***

### endTime?

> `optional` **endTime**: `number` \| `number`[] \| `object` \| `object` \| `object` \| `object`

End of round, UNIX time

#### Defined in

[database.ts:1596](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1596)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

Round ID

#### Defined in

[database.ts:1592](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1592)

***

### round?

> `optional` **round**: `number` \| `number`[] \| `object` \| `object` \| `object` \| `object`

Zero-indexed round within the contest

#### Defined in

[database.ts:1590](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1590)

***

### startTime?

> `optional` **startTime**: `number` \| `number`[] \| `object` \| `object` \| `object` \| `object`

Start of round, UNIX time

#### Defined in

[database.ts:1594](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1594)

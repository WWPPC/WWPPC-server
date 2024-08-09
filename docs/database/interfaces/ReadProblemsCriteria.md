[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadProblemsCriteria

# Interface: ReadProblemsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### author?

> `optional` **author**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

Author username of problem

#### Defined in

[database.ts:1616](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1616)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Defined in

[database.ts:1618](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1618)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

UUID of problem

#### Defined in

[database.ts:1612](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1612)

***

### name?

> `optional` **name**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

Display name of problem

#### Defined in

[database.ts:1614](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1614)

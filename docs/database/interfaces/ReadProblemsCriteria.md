[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadProblemsCriteria

# Interface: ReadProblemsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### author?

> `optional` **author**: `string` \| `string`[] \| `object` \| `object` \| `object`

Author username of problem

#### Source

[src/database.ts:1533](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1533)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Source

[src/database.ts:1535](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1535)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Source

[src/database.ts:1529](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1529)

***

### name?

> `optional` **name**: `string` \| `string`[] \| `object` \| `object` \| `object`

Display name of problem

#### Source

[src/database.ts:1531](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1531)

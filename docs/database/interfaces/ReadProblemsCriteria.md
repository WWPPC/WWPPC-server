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

[src/database.ts:1566](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1566)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Source

[src/database.ts:1568](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1568)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Source

[src/database.ts:1562](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1562)

***

### name?

> `optional` **name**: `string` \| `string`[] \| `object` \| `object` \| `object`

Display name of problem

#### Source

[src/database.ts:1564](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1564)

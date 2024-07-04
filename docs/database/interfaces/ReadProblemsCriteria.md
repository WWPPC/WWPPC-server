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

[src/database.ts:1532](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1532)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Source

[src/database.ts:1534](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1534)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Source

[src/database.ts:1528](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1528)

***

### name?

> `optional` **name**: `string` \| `string`[] \| `object` \| `object` \| `object`

Display name of problem

#### Source

[src/database.ts:1530](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1530)

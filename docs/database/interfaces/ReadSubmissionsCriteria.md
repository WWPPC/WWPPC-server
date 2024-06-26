[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadSubmissionsCriteria

# Interface: ReadSubmissionsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### analysis?

> `optional` **analysis**: `boolean`

If the submission was submitted through the upsolve system

#### Source

[src/database.ts:1568](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L1568)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Source

[src/database.ts:1564](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L1564)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Source

[src/database.ts:1560](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L1560)

***

### time?

> `optional` **time**: `number` \| `number`[] \| `object` \| `object` \| `object`

Time of submission

#### Source

[src/database.ts:1566](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L1566)

***

### username?

> `optional` **username**: `string` \| `string`[] \| `object` \| `object` \| `object`

Username of submitter

#### Source

[src/database.ts:1562](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/database.ts#L1562)

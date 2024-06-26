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

[src/database.ts:1571](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1571)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Round-based filter for problems

#### Source

[src/database.ts:1567](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1567)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Source

[src/database.ts:1563](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1563)

***

### time?

> `optional` **time**: `number` \| `number`[] \| `object` \| `object` \| `object`

Time of submission

#### Source

[src/database.ts:1569](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1569)

***

### username?

> `optional` **username**: `string` \| `string`[] \| `object` \| `object` \| `object`

Username of submitter

#### Source

[src/database.ts:1565](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1565)

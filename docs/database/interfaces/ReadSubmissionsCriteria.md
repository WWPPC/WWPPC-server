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

[src/database.ts:1548](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1548)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Source

[src/database.ts:1544](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1544)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Source

[src/database.ts:1540](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1540)

***

### time?

> `optional` **time**: `number` \| `number`[] \| `object` \| `object` \| `object`

Time of submission

#### Source

[src/database.ts:1546](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1546)

***

### username?

> `optional` **username**: `string` \| `string`[] \| `object` \| `object` \| `object`

Username of submitter

#### Source

[src/database.ts:1542](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1542)

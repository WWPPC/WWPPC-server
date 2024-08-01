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

[src/database.ts:1517](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1517)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Source

[src/database.ts:1513](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1513)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Source

[src/database.ts:1509](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1509)

***

### time?

> `optional` **time**: `number` \| `number`[] \| `object` \| `object` \| `object`

Time of submission

#### Source

[src/database.ts:1515](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1515)

***

### username?

> `optional` **username**: `string` \| `string`[] \| `object` \| `object` \| `object`

Username of submitter

#### Source

[src/database.ts:1511](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1511)

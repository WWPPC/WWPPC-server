[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadSubmissionsCriteria

# Interface: ReadSubmissionsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### analysis?

> `optional` **analysis**: `boolean`

If the submission was submitted through the upsolve system

#### Defined in

[database.ts:1519](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1519)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Defined in

[database.ts:1515](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1515)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Defined in

[database.ts:1511](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1511)

***

### time?

> `optional` **time**: `number` \| `number`[] \| `object` \| `object` \| `object`

Time of submission

#### Defined in

[database.ts:1517](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1517)

***

### username?

> `optional` **username**: `string` \| `string`[] \| `object` \| `object` \| `object`

Username of submitter

#### Defined in

[database.ts:1513](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1513)

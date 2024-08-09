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

[database.ts:1631](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1631)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Defined in

[database.ts:1627](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1627)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

UUID of problem

#### Defined in

[database.ts:1623](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1623)

***

### time?

> `optional` **time**: `number` \| `number`[] \| `object` \| `object` \| `object` \| `object`

Time of submission

#### Defined in

[database.ts:1629](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1629)

***

### username?

> `optional` **username**: `string` \| `string`[] \| `object` \| `object` \| `object` \| `object`

Username of submitter

#### Defined in

[database.ts:1625](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1625)

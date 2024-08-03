[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / ReadProblemsCriteria

# Interface: ReadProblemsCriteria

Criteria to filter by. Leaving a value undefined removes the criteria

## Properties

### author?

> `optional` **author**: `string` \| `string`[] \| `object` \| `object` \| `object`

Author username of problem

#### Defined in

[database.ts:1504](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1504)

***

### contest?

> `optional` **contest**: [`ProblemRoundCriteria`](ProblemRoundCriteria.md)

Contest-based filter including contest, round, problem number, and round ID

#### Defined in

[database.ts:1506](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1506)

***

### id?

> `optional` **id**: `string` \| `string`[] \| `object` \| `object` \| `object`

UUID of problem

#### Defined in

[database.ts:1500](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1500)

***

### name?

> `optional` **name**: `string` \| `string`[] \| `object` \| `object` \| `object`

Display name of problem

#### Defined in

[database.ts:1502](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1502)

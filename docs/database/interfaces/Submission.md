[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Submission

# Interface: Submission

Descriptor for a single submission

## Properties

### analysis

> **analysis**: `boolean`

If the submission was submitted through the upsolve system

#### Defined in

[database.ts:1438](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1438)

***

### file

> **file**: `string`

Contents of the submission file

#### Defined in

[database.ts:1423](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1423)

***

### history

> **history**: `object`[]

Shortened list of previous submissions and their results, without content (increasing chronologically)

#### Defined in

[database.ts:1429](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1429)

***

### lang

> **lang**: `string`

Submission language

#### Defined in

[database.ts:1425](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1425)

***

### problemId

> `readonly` **problemId**: `string`

UUID of problem submitted to

#### Defined in

[database.ts:1419](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1419)

***

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

#### Defined in

[database.ts:1427](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1427)

***

### time

> **time**: `number`

Time of submission, UNIX milliseconds

#### Defined in

[database.ts:1421](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1421)

***

### username

> `readonly` **username**: `string`

Username of submitter

#### Defined in

[database.ts:1417](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1417)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Submission

# Interface: Submission

Descriptor for a single submission

## Properties

### analysis

> **analysis**: `boolean`

If the submission was submitted through the upsolve system

#### Source

[src/database.ts:1436](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1436)

***

### file

> **file**: `string`

Contents of the submission file

#### Source

[src/database.ts:1421](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1421)

***

### history

> **history**: `object`[]

Shortened list of previous submissions and their results, without content (increasing chronologically)

#### Source

[src/database.ts:1427](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1427)

***

### lang

> **lang**: `string`

Submission language

#### Source

[src/database.ts:1423](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1423)

***

### problemId

> `readonly` **problemId**: `string`

UUID of problem submitted to

#### Source

[src/database.ts:1417](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1417)

***

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

#### Source

[src/database.ts:1425](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1425)

***

### time

> **time**: `number`

Time of submission, UNIX milliseconds

#### Source

[src/database.ts:1419](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1419)

***

### username

> `readonly` **username**: `string`

Username of submitter

#### Source

[src/database.ts:1415](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1415)

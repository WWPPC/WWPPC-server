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

[src/database.ts:1522](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1522)

***

### file

> **file**: `string`

Contents of the submission file

#### Source

[src/database.ts:1507](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1507)

***

### history

> **history**: `object`[]

Shortened list of previous submissions and their results, without content (increasing chronologically)

#### Source

[src/database.ts:1513](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1513)

***

### lang

> **lang**: `string`

Submission language

#### Source

[src/database.ts:1509](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1509)

***

### problemId

> `readonly` **problemId**: `string`

UUID of problem submitted to

#### Source

[src/database.ts:1503](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1503)

***

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

#### Source

[src/database.ts:1511](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1511)

***

### time

> **time**: `number`

Time of submission, UNIX milliseconds

#### Source

[src/database.ts:1505](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1505)

***

### username

> `readonly` **username**: `string`

Username of submitter

#### Source

[src/database.ts:1501](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1501)

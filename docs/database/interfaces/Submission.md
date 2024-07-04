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

[src/database.ts:1466](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1466)

***

### file

> **file**: `string`

Contents of the submission file

#### Source

[src/database.ts:1451](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1451)

***

### history

> **history**: `object`[]

Shortened list of previous submissions and their results, without content (increasing chronologically)

#### Source

[src/database.ts:1457](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1457)

***

### lang

> **lang**: `string`

Submission language

#### Source

[src/database.ts:1453](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1453)

***

### problemId

> `readonly` **problemId**: `string`

UUID of problem submitted to

#### Source

[src/database.ts:1447](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1447)

***

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

#### Source

[src/database.ts:1455](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1455)

***

### time

> **time**: `number`

Time of submission, UNIX milliseconds

#### Source

[src/database.ts:1449](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1449)

***

### username

> `readonly` **username**: `string`

Username of submitter

#### Source

[src/database.ts:1445](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1445)

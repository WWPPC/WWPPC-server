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

[database.ts:1550](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1550)

***

### file

> **file**: `string`

Contents of the submission file

#### Defined in

[database.ts:1535](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1535)

***

### history

> **history**: `object`[]

Shortened list of previous submissions and their results, without content (increasing chronologically)

#### Defined in

[database.ts:1541](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1541)

***

### lang

> **lang**: `string`

Submission language

#### Defined in

[database.ts:1537](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1537)

***

### problemId

> `readonly` **problemId**: `string`

UUID of problem submitted to

#### Defined in

[database.ts:1531](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1531)

***

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

#### Defined in

[database.ts:1539](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1539)

***

### time

> **time**: `number`

Time of submission, UNIX milliseconds

#### Defined in

[database.ts:1533](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1533)

***

### username

> `readonly` **username**: `string`

Username of submitter

#### Defined in

[database.ts:1529](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1529)

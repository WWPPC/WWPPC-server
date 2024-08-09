[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Problem

# Interface: Problem

Descriptor for a single problem

## Properties

### author

> **author**: `string`

Author username

#### Defined in

[database.ts:1513](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1513)

***

### constraints

> **constraints**: `object`

Runtime constraints

#### memory

> **memory**: `number`

Memory limit per test case in megabytes

#### time

> **time**: `number`

Time limit per test case in millseconds

#### Defined in

[database.ts:1517](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1517)

***

### content

> **content**: `string`

HTML/KaTeX content of problem statement

#### Defined in

[database.ts:1515](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1515)

***

### id

> `readonly` **id**: `string`

UUID

#### Defined in

[database.ts:1509](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1509)

***

### name

> **name**: `string`

Display name

#### Defined in

[database.ts:1511](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1511)

***

### solution

> **solution**: `null` \| `string`

"Correct" answer used in contests with answer grading ([config.ContestConfiguration.submitSolver](../../config/interfaces/ContestConfiguration.md#submitsolver) is false)

#### Defined in

[database.ts:1524](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/database.ts#L1524)

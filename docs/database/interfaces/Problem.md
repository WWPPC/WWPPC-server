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

[database.ts:1401](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1401)

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

[database.ts:1405](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1405)

***

### content

> **content**: `string`

HTML/KaTeX content of problem statement

#### Defined in

[database.ts:1403](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1403)

***

### id

> `readonly` **id**: `string`

UUID

#### Defined in

[database.ts:1397](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1397)

***

### name

> **name**: `string`

Display name

#### Defined in

[database.ts:1399](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1399)

***

### solution

> **solution**: `null` \| `string`

"Correct" answer used in contests with answer grading ([config.ContestConfiguration.submitSolver](../../config/interfaces/ContestConfiguration.md#submitsolver) is false)

#### Defined in

[database.ts:1412](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1412)

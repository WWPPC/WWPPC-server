[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / Problem

# Type Alias: Problem

> **Problem**: `object`

Descriptor for a single problem

## Type declaration

### author

> **author**: `string`

Author username

### constraints

> **constraints**: `object`

Runtime constraints

#### constraints.memory

> **memory**: `number`

Memory limit per test case in megabytes

#### constraints.time

> **time**: `number`

Time limit per test case in millseconds

### content

> **content**: `string`

HTML/KaTeX content of problem statement

### id

> `readonly` **id**: [`UUID`](../../util/type-aliases/UUID.md)

UUID

### name

> **name**: `string`

Display name

### solution

> **solution**: `string` \| `null`

"Correct" answer used in contests with answer grading ([config.ContestConfiguration.submitSolver](../../config/interfaces/ContestConfiguration.md#submitsolver) is false)

## Defined in

[database.ts:1653](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/database.ts#L1653)

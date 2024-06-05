[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Problem

# Interface: Problem

Descriptor for a single problem

## Properties

### author

> **author**: `string`

Author username

#### Source

[src/database.ts:1487](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1487)

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

#### Source

[src/database.ts:1491](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1491)

***

### content

> **content**: `string`

HTML/KaTeX content of problem statement

#### Source

[src/database.ts:1489](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1489)

***

### id

> `readonly` **id**: `string`

UUID

#### Source

[src/database.ts:1483](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1483)

***

### name

> **name**: `string`

Display name

#### Source

[src/database.ts:1485](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1485)

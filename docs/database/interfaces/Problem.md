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

[src/database.ts:1465](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1465)

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

[src/database.ts:1469](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1469)

***

### content

> **content**: `string`

HTML/KaTeX content of problem statement

#### Source

[src/database.ts:1467](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1467)

***

### id

> `readonly` **id**: `string`

UUID

#### Source

[src/database.ts:1461](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1461)

***

### name

> **name**: `string`

Display name

#### Source

[src/database.ts:1463](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1463)

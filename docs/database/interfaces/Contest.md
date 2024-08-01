[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Contest

# Interface: Contest

Descriptor for a single contest

## Properties

### endTime

> **endTime**: `number`

Time of contest end, UNIX

#### Source

[src/database.ts:1377](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1377)

***

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

#### Source

[src/database.ts:1371](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1371)

***

### id

> `readonly` **id**: `string`

Contest ID, also used as name

#### Source

[src/database.ts:1367](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1367)

***

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

#### Source

[src/database.ts:1373](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1373)

***

### public

> **public**: `boolean`

If the contest is publicly archived once finished

#### Source

[src/database.ts:1379](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1379)

***

### rounds

> **rounds**: `string`[]

List of round UUIDs within the contest

#### Source

[src/database.ts:1369](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1369)

***

### startTime

> **startTime**: `number`

Time of contest start, UNIX

#### Source

[src/database.ts:1375](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1375)

***

### type

> **type**: `string`

The tournament the contest is part of

#### Source

[src/database.ts:1381](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1381)

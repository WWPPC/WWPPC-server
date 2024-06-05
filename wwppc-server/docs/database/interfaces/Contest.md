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

[src/database.ts:1465](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1465)

***

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

#### Source

[src/database.ts:1459](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1459)

***

### id

> `readonly` **id**: `string`

Contest ID, also used as name

#### Source

[src/database.ts:1455](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1455)

***

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

#### Source

[src/database.ts:1461](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1461)

***

### public

> **public**: `boolean`

If the contest is publicly visible once archived

#### Source

[src/database.ts:1467](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1467)

***

### rounds

> **rounds**: `string`[]

List of round UUIDs within the contest

#### Source

[src/database.ts:1457](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1457)

***

### startTime

> **startTime**: `number`

Time of contest start, UNIX

#### Source

[src/database.ts:1463](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1463)

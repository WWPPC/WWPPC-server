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

[src/database.ts:1434](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1434)

***

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

#### Source

[src/database.ts:1428](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1428)

***

### id

> `readonly` **id**: `string`

Contest ID, also used as name

#### Source

[src/database.ts:1424](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1424)

***

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

#### Source

[src/database.ts:1430](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1430)

***

### public

> **public**: `boolean`

If the contest is publicly archived once finished

#### Source

[src/database.ts:1436](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1436)

***

### rounds

> **rounds**: `string`[]

List of round UUIDs within the contest

#### Source

[src/database.ts:1426](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1426)

***

### startTime

> **startTime**: `number`

Time of contest start, UNIX

#### Source

[src/database.ts:1432](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1432)

***

### type

> **type**: [`ContestType`](../enumerations/ContestType.md)

The tournament the contest is part of

#### Source

[src/database.ts:1438](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1438)

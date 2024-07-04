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

[src/database.ts:1401](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1401)

***

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

#### Source

[src/database.ts:1395](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1395)

***

### id

> `readonly` **id**: `string`

Contest ID, also used as name

#### Source

[src/database.ts:1391](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1391)

***

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

#### Source

[src/database.ts:1397](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1397)

***

### public

> **public**: `boolean`

If the contest is publicly archived once finished

#### Source

[src/database.ts:1403](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1403)

***

### rounds

> **rounds**: `string`[]

List of round UUIDs within the contest

#### Source

[src/database.ts:1393](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1393)

***

### startTime

> **startTime**: `number`

Time of contest start, UNIX

#### Source

[src/database.ts:1399](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1399)

***

### type

> **type**: [`ContestType`](../enumerations/ContestType.md)

The tournament the contest is part of

#### Source

[src/database.ts:1405](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1405)

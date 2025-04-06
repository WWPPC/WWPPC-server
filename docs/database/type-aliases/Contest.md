[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / Contest

# Type Alias: Contest

> **Contest**: `object`

Descriptor for a single contest

## Type declaration

### endTime

> **endTime**: `number`

Time of contest end, UNIX

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

### id

> `readonly` **id**: `string`

Contest ID, also used as name

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

### public

> **public**: `boolean`

If the contest is publicly archived once finished (problems remain accessible through upsolve)

### rounds

> **rounds**: [`UUID`](../../util/type-aliases/UUID.md)[]

List of round UUIDs within the contest

### startTime

> **startTime**: `number`

Time of contest start, UNIX

### type

> **type**: `string`

The tournament the contest is part of

## Defined in

[database.ts:1585](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1585)

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

[src/database.ts:1400](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1400)

***

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

#### Source

[src/database.ts:1394](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1394)

***

### id

> `readonly` **id**: `string`

Contest ID, also used as name

#### Source

[src/database.ts:1390](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1390)

***

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

#### Source

[src/database.ts:1396](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1396)

***

### public

> **public**: `boolean`

If the contest is publicly archived once finished

#### Source

[src/database.ts:1402](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1402)

***

### rounds

> **rounds**: `string`[]

List of round UUIDs within the contest

#### Source

[src/database.ts:1392](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1392)

***

### startTime

> **startTime**: `number`

Time of contest start, UNIX

#### Source

[src/database.ts:1398](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1398)

***

### type

> **type**: [`ContestType`](../enumerations/ContestType.md)

The tournament the contest is part of

#### Source

[src/database.ts:1404](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1404)

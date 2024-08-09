[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Contest

# Interface: Contest

Descriptor for a single contest

## Properties

### endTime

> **endTime**: `number`

Time of contest end, UNIX

#### Defined in

[database.ts:1489](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1489)

***

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

#### Defined in

[database.ts:1483](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1483)

***

### id

> `readonly` **id**: `string`

Contest ID, also used as name

#### Defined in

[database.ts:1479](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1479)

***

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

#### Defined in

[database.ts:1485](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1485)

***

### public

> **public**: `boolean`

If the contest is publicly archived once finished

#### Defined in

[database.ts:1491](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1491)

***

### rounds

> **rounds**: `string`[]

List of round UUIDs within the contest

#### Defined in

[database.ts:1481](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1481)

***

### startTime

> **startTime**: `number`

Time of contest start, UNIX

#### Defined in

[database.ts:1487](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1487)

***

### type

> **type**: `string`

The tournament the contest is part of

#### Defined in

[database.ts:1493](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1493)

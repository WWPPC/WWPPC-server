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

[src/database.ts:1435](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1435)

***

### exclusions

> **exclusions**: `string`[]

List of other contest ids that cannot be registered simultaneously

#### Source

[src/database.ts:1429](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1429)

***

### id

> `readonly` **id**: `string`

Contest ID, also used as name

#### Source

[src/database.ts:1425](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1425)

***

### maxTeamSize

> **maxTeamSize**: `number`

Maximum team size allowed to register

#### Source

[src/database.ts:1431](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1431)

***

### public

> **public**: `boolean`

If the contest is publicly visible once archived

#### Source

[src/database.ts:1437](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1437)

***

### rounds

> **rounds**: `string`[]

List of round UUIDs within the contest

#### Source

[src/database.ts:1427](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1427)

***

### startTime

> **startTime**: `number`

Time of contest start, UNIX

#### Source

[src/database.ts:1433](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1433)

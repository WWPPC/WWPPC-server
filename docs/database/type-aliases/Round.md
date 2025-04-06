[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / Round

# Type Alias: Round

> **Round**: `object`

Descriptor for a single round

## Type declaration

### endTime

> **endTime**: `number`

Time of round end, UNIX

### id

> `readonly` **id**: [`UUID`](../../util/type-aliases/UUID.md)

UUID

### problems

> **problems**: [`UUID`](../../util/type-aliases/UUID.md)[]

List of problem UUIDs within the round

### startTime

> **startTime**: `number`

Time of round start, UNIX

## Defined in

[database.ts:1604](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/database.ts#L1604)

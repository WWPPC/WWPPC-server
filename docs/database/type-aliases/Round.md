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

[database.ts:1638](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/database.ts#L1638)

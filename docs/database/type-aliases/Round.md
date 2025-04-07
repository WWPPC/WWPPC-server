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

[database.ts:1605](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1605)

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

[database.ts:1604](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/database.ts#L1604)

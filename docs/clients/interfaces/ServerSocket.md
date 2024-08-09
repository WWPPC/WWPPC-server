[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [clients](../README.md) / ServerSocket

# Interface: ServerSocket

Socket.IO connection with username, IP, logging, and kick function.

## Extends

- `Socket`

## Extended by

- [`ContestSocket`](../../contest/interfaces/ContestSocket.md)

## Properties

### ip

> **ip**: `string`

#### Defined in

[clients.ts:502](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/clients.ts#L502)

***

### username

> **username**: `string`

#### Defined in

[clients.ts:503](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/clients.ts#L503)

## Methods

### kick()

> **kick**(`reason`): `void`

#### Parameters

• **reason**: `string`

#### Returns

`void`

#### Defined in

[clients.ts:500](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/clients.ts#L500)

***

### logWithId()

> **logWithId**(`logMethod`, `message`, `logOnly`?): `void`

#### Parameters

• **logMethod**

• **message**: `string`

• **logOnly?**: `boolean`

#### Returns

`void`

#### Defined in

[clients.ts:501](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/clients.ts#L501)

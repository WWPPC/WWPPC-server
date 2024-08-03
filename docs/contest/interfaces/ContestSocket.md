[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestSocket

# Interface: ContestSocket

Socket.IO connection with a reference to the original "spawning" connection, similar to ServerSocket but within contest namespace.

## Extends

- [`ServerSocket`](../../clients/interfaces/ServerSocket.md)

## Properties

### ip

> **ip**: `string`

#### Inherited from

[`ServerSocket`](../../clients/interfaces/ServerSocket.md).[`ip`](../../clients/interfaces/ServerSocket.md#ip)

#### Defined in

[clients.ts:502](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L502)

***

### linkedSocket

> **linkedSocket**: [`ServerSocket`](../../clients/interfaces/ServerSocket.md)

#### Defined in

[contest.ts:232](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L232)

***

### username

> **username**: `string`

#### Inherited from

[`ServerSocket`](../../clients/interfaces/ServerSocket.md).[`username`](../../clients/interfaces/ServerSocket.md#username)

#### Defined in

[clients.ts:503](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L503)

## Methods

### kick()

> **kick**(`reason`): `void`

#### Parameters

• **reason**: `string`

#### Returns

`void`

#### Inherited from

[`ServerSocket`](../../clients/interfaces/ServerSocket.md).[`kick`](../../clients/interfaces/ServerSocket.md#kick)

#### Defined in

[clients.ts:500](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L500)

***

### logWithId()

> **logWithId**(`logMethod`, `message`, `logOnly`?): `void`

#### Parameters

• **logMethod**

• **message**: `string`

• **logOnly?**: `boolean`

#### Returns

`void`

#### Inherited from

[`ServerSocket`](../../clients/interfaces/ServerSocket.md).[`logWithId`](../../clients/interfaces/ServerSocket.md#logwithid)

#### Defined in

[clients.ts:501](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L501)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [netUtil](../README.md) / NamespacedLongPollEventEmitter

# Class: NamespacedLongPollEventEmitter\<TEvents\>

Namespace-separated long-polling HTTP event-based emitter for Express applications.

## Type Parameters

• **TEvents** *extends* `Record`\<`string`, `any`\>

## Constructors

### new NamespacedLongPollEventEmitter()

> **new NamespacedLongPollEventEmitter**\<`TEvents`\>(`timeoutMs`?): [`NamespacedLongPollEventEmitter`](NamespacedLongPollEventEmitter.md)\<`TEvents`\>

#### Parameters

##### timeoutMs?

`number`

Time in milliseconds before a request will resolve with status code 204

#### Returns

[`NamespacedLongPollEventEmitter`](NamespacedLongPollEventEmitter.md)\<`TEvents`\>

#### Defined in

[netUtil.ts:73](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/netUtil.ts#L73)

## Properties

### timeoutMs

> `readonly` **timeoutMs**: `number`

#### Defined in

[netUtil.ts:65](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/netUtil.ts#L65)

## Methods

### addWaiter()

> **addWaiter**(`nsp`, `ev`, `res`): `void`

Add an Express `Response` to wait for an event.

#### Parameters

##### nsp

`string`

##### ev

keyof `TEvents` & `string`

Event name

##### res

`Response`\<`any`, `Record`\<`string`, `any`\>\>

Express `Response` object

#### Returns

`void`

#### Defined in

[netUtil.ts:86](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/netUtil.ts#L86)

***

### close()

> **close**(): `void`

Timeout all waiters and stop accepting new ones.

#### Returns

`void`

#### Defined in

[netUtil.ts:106](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/netUtil.ts#L106)

***

### emit()

> **emit**\<`TEvent`\>(`nsp`, `ev`, `data`): `void`

Emit new data to all Express `Response` waiters added through [addWaiter](NamespacedLongPollEventEmitter.md#addwaiter).

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### nsp

`string`

##### ev

`TEvent`

Event name

##### data

`TEvents`\[`TEvent`\]

Data to update with

#### Returns

`void`

#### Defined in

[netUtil.ts:97](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/netUtil.ts#L97)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [netUtil](../README.md) / NamespacedLongPollEventEmitter

# Class: NamespacedLongPollEventEmitter\<TEvents\>

Namespace-separated HTTP long-polling event-based emitter for Express applications.

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

[netUtil.ts:87](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L87)

## Properties

### timeoutMs

> `readonly` **timeoutMs**: `number`

#### Defined in

[netUtil.ts:79](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L79)

## Methods

### addImmediate()

> **addImmediate**(`nsp`, `ev`, `res`): `void`

Add an Express `Response` to immediately respond to with the most recent data for an event.
If no previously emitted data is available, it is added as a waiter instead.

#### Parameters

##### nsp

`string`

Namespace to hold response in

##### ev

keyof `TEvents` & `string`

Event name

##### res

`Response`\<`any`, `Record`\<`string`, `any`\>\>

Express `Response` object

#### Returns

`void`

#### Defined in

[netUtil.ts:114](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L114)

***

### addWaiter()

> **addWaiter**(`nsp`, `ev`, `res`): `void`

Add an Express `Response` to wait for an event.

#### Parameters

##### nsp

`string`

Namespace to hold response in

##### ev

keyof `TEvents` & `string`

Event name

##### res

`Response`\<`any`, `Record`\<`string`, `any`\>\>

Express `Response` object

#### Returns

`void`

#### Defined in

[netUtil.ts:101](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L101)

***

### close()

> **close**(): `void`

Timeout all waiters and stop accepting new ones.

#### Returns

`void`

#### Defined in

[netUtil.ts:135](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L135)

***

### emit()

> **emit**\<`TEvent`\>(`nsp`, `ev`, `data`): `void`

Emit new data to all Express `Response` waiters added through [addWaiter](NamespacedLongPollEventEmitter.md#addwaiter).

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### nsp

`string`

Namespace to hold response in

##### ev

`TEvent`

Event name

##### data

`TEvents`\[`TEvent`\]

Data to update with

#### Returns

`void`

#### Defined in

[netUtil.ts:126](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L126)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [netUtil](../README.md) / NamespacedLongPollEventEmitter

# Class: NamespacedLongPollEventEmitter\<TEvents\>

Namespace-separated HTTP long-polling event-based emitter for Express applications.

## Type Parameters

• **TEvents** *extends* `Record`\<`string`, `any`\>

## Constructors

### new NamespacedLongPollEventEmitter()

> **new NamespacedLongPollEventEmitter**\<`TEvents`\>(`logger`, `timeoutMs`?): [`NamespacedLongPollEventEmitter`](NamespacedLongPollEventEmitter.md)\<`TEvents`\>

#### Parameters

##### logger

[`Logger`](../../log/classes/Logger.md)

Logging instance

##### timeoutMs?

`number`

Time in milliseconds before a request will resolve with status code 204

#### Returns

[`NamespacedLongPollEventEmitter`](NamespacedLongPollEventEmitter.md)\<`TEvents`\>

#### Defined in

[netUtil.ts:100](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L100)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[netUtil.ts:91](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L91)

***

### timeoutMs

> `readonly` **timeoutMs**: `number`

#### Defined in

[netUtil.ts:92](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L92)

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

[netUtil.ts:128](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L128)

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

[netUtil.ts:115](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L115)

***

### close()

> **close**(): `void`

Timeout all waiters and stop accepting new ones.

#### Returns

`void`

#### Defined in

[netUtil.ts:149](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L149)

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

[netUtil.ts:140](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L140)

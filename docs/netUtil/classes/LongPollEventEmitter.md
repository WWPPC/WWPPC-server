[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [netUtil](../README.md) / LongPollEventEmitter

# Class: LongPollEventEmitter\<TEvents\>

Simple HTTP long-polling event-based emitter for Express applications.

## Type Parameters

• **TEvents** *extends* `Record`\<`string`, `any`\>

## Constructors

### new LongPollEventEmitter()

> **new LongPollEventEmitter**\<`TEvents`\>(`logger`, `timeoutMs`?): [`LongPollEventEmitter`](LongPollEventEmitter.md)\<`TEvents`\>

#### Parameters

##### logger

[`Logger`](../../log/classes/Logger.md)

Logging instance

##### timeoutMs?

`number`

Time in milliseconds before a request will resolve with status code 204

#### Returns

[`LongPollEventEmitter`](LongPollEventEmitter.md)\<`TEvents`\>

#### Defined in

[netUtil.ts:21](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L21)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[netUtil.ts:11](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L11)

***

### timeoutMs

> `readonly` **timeoutMs**: `number`

#### Defined in

[netUtil.ts:14](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L14)

## Accessors

### currentWaiterCount

#### Get Signature

> **get** **currentWaiterCount**(): `number`

##### Returns

`number`

#### Defined in

[netUtil.ts:71](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L71)

## Methods

### addImmediate()

> **addImmediate**(`ev`, `res`): `void`

Add an Express `Response` to immediately respond to with the most recent data for an event.
If no previously emitted data is available, it is added as a waiter instead.

#### Parameters

##### ev

keyof `TEvents` & `string`

Event name

##### res

`Response`\<`any`, `Record`\<`string`, `any`\>\>

Express `Response` object

#### Returns

`void`

#### Defined in

[netUtil.ts:49](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L49)

***

### addWaiter()

> **addWaiter**(`ev`, `res`): `void`

Add an Express `Response` to wait for an event.

#### Parameters

##### ev

keyof `TEvents` & `string`

Event name

##### res

`Response`\<`any`, `Record`\<`string`, `any`\>\>

Express `Response` object

#### Returns

`void`

#### Defined in

[netUtil.ts:31](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L31)

***

### close()

> **close**(): `void`

Timeout all waiters and stop accepting new ones.

#### Returns

`void`

#### Defined in

[netUtil.ts:78](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L78)

***

### emit()

> **emit**\<`TEvent`\>(`ev`, `data`): `void`

Emit new data to all Express `Response` waiters added through [addWaiter](LongPollEventEmitter.md#addwaiter).

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### ev

`TEvent`

Event name

##### data

`TEvents`\[`TEvent`\]

Data to update with

#### Returns

`void`

#### Defined in

[netUtil.ts:61](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/netUtil.ts#L61)

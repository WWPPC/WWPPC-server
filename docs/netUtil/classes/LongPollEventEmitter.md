[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [netUtil](../README.md) / LongPollEventEmitter

# Class: LongPollEventEmitter\<TEvents\>

Simple HTTP long-polling event-based emitter for Express applications.

## Type Parameters

• **TEvents** *extends* `Record`\<`string`, `any`\>

## Constructors

### new LongPollEventEmitter()

> **new LongPollEventEmitter**\<`TEvents`\>(`timeoutMs`?): [`LongPollEventEmitter`](LongPollEventEmitter.md)\<`TEvents`\>

#### Parameters

##### timeoutMs?

`number`

Time in milliseconds before a request will resolve with status code 204

#### Returns

[`LongPollEventEmitter`](LongPollEventEmitter.md)\<`TEvents`\>

#### Defined in

[netUtil.ts:15](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L15)

## Properties

### timeoutMs

> `readonly` **timeoutMs**: `number`

#### Defined in

[netUtil.ts:9](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L9)

## Accessors

### currentWaiterCount

#### Get Signature

> **get** **currentWaiterCount**(): `number`

##### Returns

`number`

#### Defined in

[netUtil.ts:61](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L61)

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

[netUtil.ts:41](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L41)

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

[netUtil.ts:24](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L24)

***

### close()

> **close**(): `void`

Timeout all waiters and stop accepting new ones.

#### Returns

`void`

#### Defined in

[netUtil.ts:68](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L68)

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

[netUtil.ts:52](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/netUtil.ts#L52)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [netUtil](../README.md) / LongPollEventEmitter

# Class: LongPollEventEmitter\<TEvents\>

Simple long-polling HTTP event-based emitter for Express applications.

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

[netUtil.ts:14](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/netUtil.ts#L14)

## Properties

### timeoutMs

> `readonly` **timeoutMs**: `number`

#### Defined in

[netUtil.ts:8](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/netUtil.ts#L8)

## Accessors

### currentWaiterCount

#### Get Signature

> **get** **currentWaiterCount**(): `number`

##### Returns

`number`

#### Defined in

[netUtil.ts:47](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/netUtil.ts#L47)

## Methods

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

[netUtil.ts:23](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/netUtil.ts#L23)

***

### close()

> **close**(): `void`

Timeout all waiters and stop accepting new ones.

#### Returns

`void`

#### Defined in

[netUtil.ts:54](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/netUtil.ts#L54)

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

[netUtil.ts:39](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/netUtil.ts#L39)

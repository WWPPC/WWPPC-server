[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [util](../README.md) / TypedEventEmitter

# Class: TypedEventEmitter\<TEvents\>

Extension of the built-in Node.js `EventEmitter` module, with added type safety.

## Type Parameters

• **TEvents** *extends* `Record`\<`string`, `any`[]\>

## Constructors

### new TypedEventEmitter()

> **new TypedEventEmitter**\<`TEvents`\>(): [`TypedEventEmitter`](TypedEventEmitter.md)\<`TEvents`\>

#### Returns

[`TypedEventEmitter`](TypedEventEmitter.md)\<`TEvents`\>

## Methods

### addListener()

> **addListener**\<`TEvent`\>(`ev`, `cb`): `void`

Add a listener for an event.

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### ev

`TEvent`

Event name

##### cb

(...`args`) => `any`

Callback function

#### Returns

`void`

#### Defined in

[util.ts:175](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/util.ts#L175)

***

### emit()

> **emit**\<`TEvent`\>(`ev`, ...`args`): `void`

Emit an event.

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### ev

`TEvent`

Event name

##### args

...`TEvents`\[`TEvent`\]

Event data, passed to each listener

#### Returns

`void`

#### Defined in

[util.ts:167](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/util.ts#L167)

***

### off()

> **off**\<`TEvent`\>(`ev`, `cb`): `void`

Remove an existing listener for an event. (Alias of `removeListener`)

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### ev

`TEvent`

Event name

##### cb

(...`args`) => `any`

Callback function

#### Returns

`void`

#### Defined in

[util.ts:199](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/util.ts#L199)

***

### on()

> **on**\<`TEvent`\>(`ev`, `cb`): `void`

Add a listener for an event. (Alias of `addListener`)

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### ev

`TEvent`

Event name

##### cb

(...`args`) => `any`

Callback function

#### Returns

`void`

#### Defined in

[util.ts:191](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/util.ts#L191)

***

### removeListener()

> **removeListener**\<`TEvent`\>(`ev`, `cb`): `void`

Remove an existing listener for an event.

#### Type Parameters

• **TEvent** *extends* `string`

#### Parameters

##### ev

`TEvent`

Event name

##### cb

(...`args`) => `any`

Callback function

#### Returns

`void`

#### Defined in

[util.ts:183](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/util.ts#L183)

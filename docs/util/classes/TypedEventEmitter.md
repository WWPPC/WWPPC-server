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

[util.ts:176](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/util.ts#L176)

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

[util.ts:168](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/util.ts#L168)

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

[util.ts:200](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/util.ts#L200)

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

[util.ts:192](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/util.ts#L192)

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

[util.ts:184](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/util.ts#L184)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [log](../README.md) / NamedLogger

# Class: NamedLogger

An extension of any other Logger that adds a name prefix to all messages.

## Implements

- [`Logger`](../interfaces/Logger.md)

## Constructors

### new NamedLogger()

> **new NamedLogger**(`logger`, `name`): [`NamedLogger`](NamedLogger.md)

Create a new `NamedLogger` around an existing `Logger`.

#### Parameters

• **logger**: [`Logger`](../interfaces/Logger.md)

Logger instance to wrap around

• **name**: `string`

Name prefix, without brackets

#### Returns

[`NamedLogger`](NamedLogger.md)

#### Defined in

[log.ts:180](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L180)

## Properties

### logger

> `readonly` **logger**: [`Logger`](../interfaces/Logger.md)

#### Defined in

[log.ts:172](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L172)

***

### name

> `readonly` **name**: `string`

#### Defined in

[log.ts:173](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L173)

## Methods

### debug()

> **debug**(`text`, `logOnly`): `void`

Append a debug-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`debug`](../interfaces/Logger.md#debug)

#### Defined in

[log.ts:188](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L188)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`destroy`](../interfaces/Logger.md#destroy)

#### Defined in

[log.ts:222](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L222)

***

### error()

> **error**(`text`, `logOnly`): `void`

Append an error-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`error`](../interfaces/Logger.md#error)

#### Defined in

[log.ts:197](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L197)

***

### fatal()

> **fatal**(`text`, `logOnly`): `void`

Append a fatal-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`fatal`](../interfaces/Logger.md#fatal)

#### Defined in

[log.ts:200](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L200)

***

### handleError()

> **handleError**(`message`, `error`): `void`

Shorthand for appending `Error` objects as error-level logs.

#### Parameters

• **message**: `string`

Accompanying message

• **error**: `any`

`Error` object

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`handleError`](../interfaces/Logger.md#handleerror)

#### Defined in

[log.ts:203](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L203)

***

### handleFatal()

> **handleFatal**(`message`, `error`): `void`

Shorthand for appending `Error` objects as fatal-level logs.

#### Parameters

• **message**: `string`

Accompanying message

• **error**: `any`

`Error` object

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`handleFatal`](../interfaces/Logger.md#handlefatal)

#### Defined in

[log.ts:212](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L212)

***

### info()

> **info**(`text`, `logOnly`): `void`

Append an information-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`info`](../interfaces/Logger.md#info)

#### Defined in

[log.ts:191](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L191)

***

### timestamp()

> **timestamp**(): `string`

Get a timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Returns

`string`

Timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`timestamp`](../interfaces/Logger.md#timestamp)

#### Defined in

[log.ts:185](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L185)

***

### warn()

> **warn**(`text`, `logOnly`): `void`

Append a warning-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`warn`](../interfaces/Logger.md#warn)

#### Defined in

[log.ts:194](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L194)

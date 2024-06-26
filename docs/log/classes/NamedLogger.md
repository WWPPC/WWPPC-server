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

#### Source

[src/log.ts:166](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L166)

## Properties

### logger

> `readonly` **logger**: [`Logger`](../interfaces/Logger.md)

#### Source

[src/log.ts:158](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L158)

***

### name

> `readonly` **name**: `string`

#### Source

[src/log.ts:159](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L159)

## Methods

### debug()

> **debug**(`text`, `logOnly`): `void`

Append a debug-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean`= `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`debug`](../interfaces/Logger.md#debug)

#### Source

[src/log.ts:174](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L174)

***

### destroy()

> **destroy**(): `void`

Safely closes the logging session.

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`destroy`](../interfaces/Logger.md#destroy)

#### Source

[src/log.ts:207](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L207)

***

### error()

> **error**(`text`, `logOnly`): `void`

Append an error-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean`= `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`error`](../interfaces/Logger.md#error)

#### Source

[src/log.ts:183](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L183)

***

### fatal()

> **fatal**(`text`, `logOnly`): `void`

Append a fatal-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean`= `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`fatal`](../interfaces/Logger.md#fatal)

#### Source

[src/log.ts:186](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L186)

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

#### Source

[src/log.ts:189](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L189)

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

#### Source

[src/log.ts:198](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L198)

***

### info()

> **info**(`text`, `logOnly`): `void`

Append an information-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean`= `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`info`](../interfaces/Logger.md#info)

#### Source

[src/log.ts:177](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L177)

***

### timestamp()

> **timestamp**(): `string`

Get a timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Returns

`string`

Timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`timestamp`](../interfaces/Logger.md#timestamp)

#### Source

[src/log.ts:171](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L171)

***

### warn()

> **warn**(`text`, `logOnly`): `void`

Append a warning-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly**: `boolean`= `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`warn`](../interfaces/Logger.md#warn)

#### Source

[src/log.ts:180](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/log.ts#L180)

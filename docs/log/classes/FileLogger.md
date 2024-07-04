[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [log](../README.md) / FileLogger

# Class: FileLogger

A simple logging class with timestamps and logging levels that writes to file and stdout.

## Implements

- [`Logger`](../interfaces/Logger.md)

## Constructors

### new FileLogger()

> **new FileLogger**(`path`): [`FileLogger`](FileLogger.md)

Create a new `FileLogger` in a specified directory. Creating a `FileLogger` will also create a
`logs/` directory. If there already exists a log.log in the directory, moving it in. This means
creating multiple `Loggers` in the same directory will break them.

#### Parameters

• **path**: `string`

Path to the log directory

#### Returns

[`FileLogger`](FileLogger.md)

#### Source

[src/log.ts:70](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L70)

## Properties

### #file

> `private` **#file**: `any`

#### Source

[src/log.ts:62](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L62)

## Methods

### #append()

> `private` **#append**(`level`, `text`, `color`, `logOnly`): `void`

#### Parameters

• **level**: `string`

• **text**: `string`

• **color**: `number`

• **logOnly**: `boolean`= `false`

#### Returns

`void`

#### Source

[src/log.ts:136](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L136)

***

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

[src/log.ts:102](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L102)

***

### destroy()

> **destroy**(): `void`

Safely closes the logging session.

#### Returns

`void`

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`destroy`](../interfaces/Logger.md#destroy)

#### Source

[src/log.ts:146](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L146)

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

[src/log.ts:111](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L111)

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

[src/log.ts:114](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L114)

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

[src/log.ts:117](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L117)

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

[src/log.ts:126](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L126)

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

[src/log.ts:105](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L105)

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

[src/log.ts:88](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L88)

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

[src/log.ts:108](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/log.ts#L108)

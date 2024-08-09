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

#### Defined in

[log.ts:71](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L71)

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

[log.ts:103](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L103)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Logger`](../interfaces/Logger.md).[`destroy`](../interfaces/Logger.md#destroy)

#### Defined in

[log.ts:159](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L159)

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

[log.ts:112](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L112)

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

[log.ts:115](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L115)

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

[log.ts:118](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L118)

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

[log.ts:131](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L131)

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

[log.ts:106](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L106)

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

[log.ts:89](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L89)

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

[log.ts:109](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/log.ts#L109)

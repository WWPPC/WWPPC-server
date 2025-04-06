[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [log](../README.md) / FileLogger

# Class: FileLogger

A simple logger with timestamps, logging levels, tail tracking, and formatting that writes to file and stdout.

## Extends

- [`Logger`](Logger.md)

## Constructors

### new FileLogger()

> **new FileLogger**(`path`, `autoName`, `allowStdOut`, `tailLength`?): [`FileLogger`](FileLogger.md)

Create a new `FileLogger` in a specified directory. Creating a `FileLogger` will also create a
`logs/` directory. If there already exists a log.log in the directory, moving it in. This means
creating multiple `Loggers` in the same directory will break them.

#### Parameters

##### path

`string`

Path to the log file, or log directory if `autoName` is `true`. Will overwrite existing files if `autoName` is `false`

##### autoName

`boolean` = `true`

Automatically name the log file based on the current date and time (default true)

##### allowStdOut

`boolean` = `true`

Allow mirroring of logs in stdout (does not override `logOnly` on calls, default true)

##### tailLength?

`number`

Maximum length of buffer for most recent log entries (default 100)

#### Returns

[`FileLogger`](FileLogger.md)

#### Overrides

[`Logger`](Logger.md).[`constructor`](Logger.md#constructors)

#### Defined in

[log.ts:160](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L160)

## Properties

### filePath

> `readonly` **filePath**: `string`

#### Defined in

[log.ts:143](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L143)

***

### tailLength

> `readonly` **tailLength**: `number`

#### Defined in

[log.ts:144](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L144)

## Methods

### debug()

> **debug**(`text`, `logOnly`): `void`

Append a debug-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly

`boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`debug`](Logger.md#debug)

#### Defined in

[log.ts:184](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L184)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`Logger`](Logger.md).[`destroy`](Logger.md#destroy)

#### Defined in

[log.ts:232](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L232)

***

### error()

> **error**(`text`, `logOnly`): `void`

Append an error-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly

`boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`error`](Logger.md#error)

#### Defined in

[log.ts:193](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L193)

***

### fatal()

> **fatal**(`text`, `logOnly`): `void`

Append a fatal-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly

`boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`fatal`](Logger.md#fatal)

#### Defined in

[log.ts:196](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L196)

***

### handleError()

> **handleError**(`message`, `error`): `void`

Shorthand for appending `Error` objects as error-level logs.

#### Parameters

##### message

`string`

Accompanying message

##### error

`any`

Error data

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`handleError`](Logger.md#handleerror)

#### Defined in

[log.ts:199](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L199)

***

### handleFatal()

> **handleFatal**(`message`, `error`): `void`

Shorthand for appending `Error` objects as fatal-level logs.

#### Parameters

##### message

`string`

Accompanying message

##### error

`any`

Error data

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`handleFatal`](Logger.md#handlefatal)

#### Defined in

[log.ts:202](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L202)

***

### info()

> **info**(`text`, `logOnly`): `void`

Append an information-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly

`boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`info`](Logger.md#info)

#### Defined in

[log.ts:187](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L187)

***

### tail()

> **tail**(): `string`

Fetch the most recent log entries, a maximum of [tailLength](FileLogger.md#taillength) entries.

#### Returns

`string`

#### Defined in

[log.ts:209](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L209)

***

### timestamp()

> **timestamp**(): `string`

Get a timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Returns

`string`

Timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Inherited from

[`Logger`](Logger.md).[`timestamp`](Logger.md#timestamp)

#### Defined in

[log.ts:14](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L14)

***

### warn()

> **warn**(`text`, `logOnly`): `void`

Append a warning-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly

`boolean` = `false`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`warn`](Logger.md#warn)

#### Defined in

[log.ts:190](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L190)

***

### appendErrorLog()

> `static` **appendErrorLog**(`this`, `appendFunc`, `message`, `error`): `void`

Convert an error log with message and stack trace to a log entry fed to the append function.

#### Parameters

##### this

[`Logger`](Logger.md)

##### appendFunc

(`text`, `logOnly`?) => `void`

Callback function for appending to log

##### message

`string`

Accompanying message

##### error

`any`

Error data

#### Returns

`void`

#### Inherited from

[`Logger`](Logger.md).[`appendErrorLog`](Logger.md#appenderrorlog)

#### Defined in

[log.ts:83](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/log.ts#L83)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [log](../README.md) / MultiLogger

# Class: MultiLogger

A wrapper to append to multiple `Logger` instances at the same time.

## Extends

- [`Logger`](Logger.md)

## Constructors

### new MultiLogger()

> **new MultiLogger**(`loggers`): [`MultiLogger`](MultiLogger.md)

Create a new `MultiLogger` encapsulating a list of other `Logger`s.

#### Parameters

##### loggers

[`Logger`](Logger.md)[]

Array of loggers

#### Returns

[`MultiLogger`](MultiLogger.md)

#### Overrides

[`Logger`](Logger.md).[`constructor`](Logger.md#constructors)

#### Defined in

[log.ts:108](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L108)

## Methods

### debug()

> **debug**(`text`, `logOnly`?): `void`

Append a debug-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly?

`boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`debug`](Logger.md#debug)

#### Defined in

[log.ts:113](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L113)

***

### destroy()

> **destroy**(): `void`

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`destroy`](Logger.md#destroy)

#### Defined in

[log.ts:134](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L134)

***

### error()

> **error**(`text`, `logOnly`?): `void`

Append an error-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly?

`boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`error`](Logger.md#error)

#### Defined in

[log.ts:122](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L122)

***

### fatal()

> **fatal**(`text`, `logOnly`?): `void`

Append a fatal-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly?

`boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`fatal`](Logger.md#fatal)

#### Defined in

[log.ts:125](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L125)

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

[log.ts:128](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L128)

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

[log.ts:131](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L131)

***

### info()

> **info**(`text`, `logOnly`?): `void`

Append an information-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly?

`boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`info`](Logger.md#info)

#### Defined in

[log.ts:116](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L116)

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

[log.ts:14](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L14)

***

### warn()

> **warn**(`text`, `logOnly`?): `void`

Append a warning-level entry to the log.

#### Parameters

##### text

`string`

Text

##### logOnly?

`boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`warn`](Logger.md#warn)

#### Defined in

[log.ts:119](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L119)

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

[log.ts:83](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L83)

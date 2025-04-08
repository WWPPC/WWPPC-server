[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [log](../README.md) / NullLogger

# Class: NullLogger

Drops all log entries into nowhere.

## Extends

- [`Logger`](Logger.md)

## Constructors

### new NullLogger()

> **new NullLogger**(): [`NullLogger`](NullLogger.md)

#### Returns

[`NullLogger`](NullLogger.md)

#### Overrides

[`Logger`](Logger.md).[`constructor`](Logger.md#constructors)

#### Defined in

[log.ts:290](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L290)

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

[log.ts:293](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L293)

***

### destroy()

> **destroy**(): `void`

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`destroy`](Logger.md#destroy)

#### Defined in

[log.ts:307](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L307)

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

[log.ts:299](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L299)

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

[log.ts:301](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L301)

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

[log.ts:303](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L303)

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

[log.ts:305](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L305)

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

[log.ts:295](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L295)

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

[log.ts:297](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L297)

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

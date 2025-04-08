[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [log](../README.md) / NamedLogger

# Class: NamedLogger

An extension of any other `Logger` instance that adds a name prefix to all messages.

## Extends

- [`Logger`](Logger.md)

## Constructors

### new NamedLogger()

> **new NamedLogger**(`logger`, `name`): [`NamedLogger`](NamedLogger.md)

Create a new `NamedLogger` around an existing `Logger`.

#### Parameters

##### logger

[`Logger`](Logger.md)

Logger instance to wrap around

##### name

`string`

Name prefix, without brackets

#### Returns

[`NamedLogger`](NamedLogger.md)

#### Overrides

[`Logger`](Logger.md).[`constructor`](Logger.md#constructors)

#### Defined in

[log.ts:253](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L253)

## Properties

### logger

> `readonly` **logger**: [`Logger`](Logger.md)

#### Defined in

[log.ts:245](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L245)

***

### name

> `readonly` **name**: `string`

#### Defined in

[log.ts:246](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L246)

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

[log.ts:259](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L259)

***

### destroy()

> **destroy**(): `Promise`\<`void`\>

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`Logger`](Logger.md).[`destroy`](Logger.md#destroy)

#### Defined in

[log.ts:281](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L281)

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

[log.ts:268](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L268)

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

[log.ts:271](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L271)

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

[log.ts:274](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L274)

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

[log.ts:277](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L277)

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

[log.ts:262](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L262)

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

[log.ts:265](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/log.ts#L265)

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

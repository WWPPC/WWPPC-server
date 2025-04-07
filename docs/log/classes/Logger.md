[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [log](../README.md) / Logger

# Class: `abstract` Logger

A simple logging class with log levels.

## Extended by

- [`MultiLogger`](MultiLogger.md)
- [`FileLogger`](FileLogger.md)
- [`NamedLogger`](NamedLogger.md)
- [`NullLogger`](NullLogger.md)

## Constructors

### new Logger()

> **new Logger**(): [`Logger`](Logger.md)

#### Returns

[`Logger`](Logger.md)

## Methods

### debug()

> `abstract` **debug**(`text`, `logOnly`?): `void`

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

#### Defined in

[log.ts:34](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L34)

***

### destroy()

> `abstract` **destroy**(): `void`

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`void`

#### Defined in

[log.ts:75](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L75)

***

### error()

> `abstract` **error**(`text`, `logOnly`?): `void`

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

#### Defined in

[log.ts:52](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L52)

***

### fatal()

> `abstract` **fatal**(`text`, `logOnly`?): `void`

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

#### Defined in

[log.ts:58](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L58)

***

### handleError()

> `abstract` **handleError**(`message`, `error`): `void`

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

#### Defined in

[log.ts:64](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L64)

***

### handleFatal()

> `abstract` **handleFatal**(`message`, `error`): `void`

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

#### Defined in

[log.ts:70](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L70)

***

### info()

> `abstract` **info**(`text`, `logOnly`?): `void`

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

#### Defined in

[log.ts:40](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L40)

***

### timestamp()

> **timestamp**(): `string`

Get a timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Returns

`string`

Timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Defined in

[log.ts:14](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L14)

***

### warn()

> `abstract` **warn**(`text`, `logOnly`?): `void`

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

#### Defined in

[log.ts:46](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L46)

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

#### Defined in

[log.ts:83](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/log.ts#L83)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [log](../README.md) / Logger

# Interface: Logger

## Methods

### debug()

> **debug**(`text`, `logOnly`?): `void`

Append a debug-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly?**: `boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Defined in

[log.ts:15](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L15)

***

### destroy()

> **destroy**(): `void`

Safely closes the logging session. May be asynchronous to allow pending operations to finish.

#### Returns

`void`

#### Defined in

[log.ts:55](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L55)

***

### error()

> **error**(`text`, `logOnly`?): `void`

Append an error-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly?**: `boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Defined in

[log.ts:33](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L33)

***

### fatal()

> **fatal**(`text`, `logOnly`?): `void`

Append a fatal-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly?**: `boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Defined in

[log.ts:39](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L39)

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

#### Defined in

[log.ts:45](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L45)

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

#### Defined in

[log.ts:51](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L51)

***

### info()

> **info**(`text`, `logOnly`?): `void`

Append an information-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly?**: `boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Defined in

[log.ts:21](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L21)

***

### timestamp()

> **timestamp**(): `string`

Get a timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Returns

`string`

Timestamp in YYYY-MM-DD [HH:MM:SS] format.

#### Defined in

[log.ts:9](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L9)

***

### warn()

> **warn**(`text`, `logOnly`?): `void`

Append a warning-level entry to the log.

#### Parameters

• **text**: `string`

Text

• **logOnly?**: `boolean`

Only put in logfile, not stdout

#### Returns

`void`

#### Defined in

[log.ts:27](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/log.ts#L27)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [util](../README.md) / sendDatabaseResponse

# Function: sendDatabaseResponse()

> **sendDatabaseResponse**(`req`, `res`, `code`, `messages`, `logger`, `username`?, `messagePrefix`?): `void`

Send a response code and message based on a `DatabaseOpCode`, with logging of responses.

## Parameters

### req

`Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

Express request

### res

`Response`\<`any`, `Record`\<`string`, `any`\>\>

Express response

### code

[`DatabaseOpCode`](../../database/enumerations/DatabaseOpCode.md)

Response code

### messages

`Partial`\<`Record`\<[`DatabaseOpCode`](../../database/enumerations/DatabaseOpCode.md), `string`\>\>

Optional override messages for each code

### logger

[`Logger`](../../log/classes/Logger.md)

Logging instance

### username?

`string`

Username of request sender (optional)

### messagePrefix?

`string`

Optional prefix for response messages

## Returns

`void`

## Defined in

[util.ts:271](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/util.ts#L271)

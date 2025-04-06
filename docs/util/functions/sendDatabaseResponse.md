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

[util.ts:270](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/util.ts#L270)

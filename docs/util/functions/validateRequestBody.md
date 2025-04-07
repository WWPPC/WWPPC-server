[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [util](../README.md) / validateRequestBody

# Function: validateRequestBody()

> **validateRequestBody**(`rules`, `logger`?, `responseCode`?): (`req`, `res`, `next`) => `Promise`\<`void`\>

Returns middleware that validates the request body using the node-input-validator package.

## Parameters

### rules

`object`

Input validation rules

### logger?

[`Logger`](../../log/classes/Logger.md)

Logging instance

### responseCode?

`number` = `400`

## Returns

`Function`

### Parameters

#### req

`Request`

#### res

`Response`

#### next

`NextFunction`

### Returns

`Promise`\<`void`\>

## Defined in

[util.ts:241](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/util.ts#L241)

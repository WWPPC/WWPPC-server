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

[util.ts:240](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/util.ts#L240)

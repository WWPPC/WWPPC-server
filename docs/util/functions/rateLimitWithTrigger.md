[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [util](../README.md) / rateLimitWithTrigger

# Function: rateLimitWithTrigger()

> **rateLimitWithTrigger**(`options`, `cb`): `RateLimitRequestHandler`

Create an instance of `express-rate-limit` IP rate limiter, with a handler
for the first trigger of the rate limiter per window.

## Parameters

### options

`Partial`\<`Omit`\<`Options`, `"handler"`\>\>

Options to configure the rate limiter.

### cb

(`req`, `res`) => `any`

Callback handler for the first trigger

## Returns

`RateLimitRequestHandler`

## Defined in

[util.ts:224](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/util.ts#L224)

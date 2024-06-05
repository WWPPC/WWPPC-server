[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [recaptcha](../README.md) / validateRecaptcha

# Function: validateRecaptcha()

> **validateRecaptcha**(`token`, `ip`): `Promise`\<`Error` \| [`RecaptchaResponse`](../interfaces/RecaptchaResponse.md)\>

Verify a reCAPTCHA token using Google's servers.

## Parameters

• **token**: `string`

User-supplied token to validate

• **ip**: `string`

User (remote) ip

## Returns

`Promise`\<`Error` \| [`RecaptchaResponse`](../interfaces/RecaptchaResponse.md)\>

Server response or error (if one occured during request)

## Source

[src/recaptcha.ts:17](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/recaptcha.ts#L17)

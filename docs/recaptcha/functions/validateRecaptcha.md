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

## Defined in

[recaptcha.ts:17](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/recaptcha.ts#L17)

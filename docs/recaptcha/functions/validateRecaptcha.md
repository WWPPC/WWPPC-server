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

[src/recaptcha.ts:17](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/recaptcha.ts#L17)

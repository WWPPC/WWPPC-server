[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [email](../README.md) / Mailer

# Class: Mailer

Nodemailer wrapper with templates. Connects to an SMTP server.

## Constructors

### new Mailer()

> **new Mailer**(`params`): [`Mailer`](Mailer.md)

#### Parameters

• **params**: [`MailerConstructorParams`](../interfaces/MailerConstructorParams.md)

Parameters

#### Returns

[`Mailer`](Mailer.md)

#### Source

[src/email.ts:39](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L39)

## Properties

### #logger

> `private` `readonly` **#logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/email.ts:32](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L32)

***

### #templatePathURL

> `private` `readonly` **#templatePathURL**: `string`

#### Source

[src/email.ts:33](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L33)

***

### #templates

> `private` `readonly` **#templates**: `Map`\<`string`, `string`\>

#### Source

[src/email.ts:34](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L34)

***

### #transporter

> `private` `readonly` **#transporter**: `Transporter`

#### Source

[src/email.ts:31](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L31)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Source

[src/email.ts:30](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L30)

## Methods

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the SMTP server.

#### Returns

`Promise`\<`void`\>

#### Source

[src/email.ts:179](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L179)

***

### send()

> **send**(`recipients`, `subject`, `content`, `plaintext`?): `Promise`\<`undefined` \| `Error`\>

Send and email from no-reply@wwppc.tech.

#### Parameters

• **recipients**: `string`[]

List of recipient emails

• **subject**: `string`

Subject line of email

• **content**: `string`

HTML content of email

• **plaintext?**: `string`

Plaintext version of email

#### Returns

`Promise`\<`undefined` \| `Error`\>

`undefined` if email was sent succesfully. Otherwise, an Error

#### Source

[src/email.ts:103](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L103)

***

### sendFromTemplate()

> **sendFromTemplate**(`template`, `recipients`, `subject`, `params`, `plaintext`?): `Promise`\<`undefined` \| `Error`\>

Send an email using a template from no-reply@wwppc.tech.

#### Parameters

• **template**: `string`

Name of template (matches file name, without extension)

• **recipients**: `string`[]

List of recipient emails

• **subject**: `string`

Subject line of email

• **params**: [`string`, `string`][]

Replacements for parameters in email, in key-value pairs

• **plaintext?**: `string`

Plaintext version (does not use template)

#### Returns

`Promise`\<`undefined` \| `Error`\>

`undefined` if email was sent succesfully. Otherwise, an Error

#### Source

[src/email.ts:139](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/email.ts#L139)

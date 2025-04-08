[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [email](../README.md) / Mailer

# Class: Mailer

Nodemailer wrapper with templates. Connects to an SMTP server.

## Constructors

### new Mailer()

> **new Mailer**(`params`): [`Mailer`](Mailer.md)

#### Parameters

##### params

[`MailerConstructorParams`](../type-aliases/MailerConstructorParams.md)

Parameters

#### Returns

[`Mailer`](Mailer.md)

#### Defined in

[email.ts:39](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/email.ts#L39)

## Properties

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Defined in

[email.ts:30](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/email.ts#L30)

## Methods

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the SMTP server.

#### Returns

`Promise`\<`void`\>

#### Defined in

[email.ts:180](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/email.ts#L180)

***

### send()

> **send**(`recipients`, `subject`, `content`, `plaintext`?): `Promise`\<`undefined` \| `Error`\>

Send and email from no-reply@wwppc.tech.

#### Parameters

##### recipients

`string`[]

List of recipient emails

##### subject

`string`

Subject line of email

##### content

`string`

HTML content of email

##### plaintext?

`string`

Plaintext version of email

#### Returns

`Promise`\<`undefined` \| `Error`\>

`undefined` if email was sent succesfully. Otherwise, an Error

#### Defined in

[email.ts:111](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/email.ts#L111)

***

### sendFromTemplate()

> **sendFromTemplate**(`template`, `recipients`, `subject`, `params`, `plaintext`?): `Promise`\<`undefined` \| `Error`\>

Send an email using a template from no-reply@wwppc.tech.

#### Parameters

##### template

`string`

Name of template (matches file name, without extension)

##### recipients

`string`[]

List of recipient emails

##### subject

`string`

Subject line of email

##### params

[`string`, `string`][]

Replacements for parameters in email, in key-value pairs

##### plaintext?

`string`

Plaintext version (does not use template)

#### Returns

`Promise`\<`undefined` \| `Error`\>

`undefined` if email was sent succesfully. Otherwise, an Error

#### Defined in

[email.ts:147](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/email.ts#L147)

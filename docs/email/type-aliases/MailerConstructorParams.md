[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [email](../README.md) / MailerConstructorParams

# Type Alias: MailerConstructorParams

> **MailerConstructorParams**: `object`

## Type declaration

### host

> **host**: `string`

Hostname of SMTP server

### logger

> **logger**: [`Logger`](../../log/classes/Logger.md)

Logging instance

### password

> **password**: `string`

SMTP password

### port?

> `optional` **port**: `number`

Port number of SMTP server (default 587)

### secure?

> `optional` **secure**: `boolean`

Use secure connection

### templatePath

> **templatePath**: `string`

Path to email templates

### username

> **username**: `string`

SMTP username

## Defined in

[email.ts:10](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/email.ts#L10)

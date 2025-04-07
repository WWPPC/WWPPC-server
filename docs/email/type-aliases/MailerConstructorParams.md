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

[email.ts:10](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/email.ts#L10)

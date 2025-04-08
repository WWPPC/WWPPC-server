[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / AccountData

# Type Alias: AccountData

> **AccountData**: `object`

Descriptor for an account

## Type declaration

### bio

> **bio**: `string`

User-written short biography

### displayName

> **displayName**: `string`

Alternate name used in front-end

### email

> **email**: `string`

Email

### email2

> **email2**: `string`

Parent and/or guardian email (or student's email again)

### experience

> **experience**: `number`

Experience level, 0 to 4, with 4 being the highest

### firstName

> **firstName**: `string`

First name

### grade

> **grade**: `number`

Grade level (8 = below HS, 13 = above HS)

### languages

> **languages**: `string`[]

Known languages, in file extension form

### lastName

> **lastName**: `string`

Last name

### pastRegistrations

> **pastRegistrations**: `string`[]

List of contests that have ended that were registered for

### profileImage

> **profileImage**: `string`

Encoded image

### school

> **school**: `string`

School name

### team

> **team**: `string` \| `null`

ID of team, or null if not on any team

### username

> `readonly` **username**: `string`

Username

## Defined in

[database.ts:1576](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1576)

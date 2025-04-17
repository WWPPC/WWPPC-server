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

### organization

> **organization**: `string`

School name

### pastRegistrations

> **pastRegistrations**: `string`[]

List of contests that have ended that were registered for

### profileImage

> **profileImage**: `string`

Encoded image

### team

> **team**: `number` \| `null`

ID of team, or null if not on any team

### username

> `readonly` **username**: `string`

Username

## Defined in

[database.ts:1580](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1580)

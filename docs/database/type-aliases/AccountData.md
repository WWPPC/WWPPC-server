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

[database.ts:1574](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/database.ts#L1574)

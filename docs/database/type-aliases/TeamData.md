[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / TeamData

# Type Alias: TeamData

> **TeamData**: `object`

Descriptor for a team

## Type declaration

### bio

> **bio**: `string`

Team's biography

### id

> `readonly` **id**: `number`

Unique team id, postfixing base 36 representation with `joinKey` creates the join code

### joinKey

> **joinKey**: `string`

A random 6-character alphanumeric string, prefixing with base 36 representation of `id` creates the join code

### members

> **members**: `string`[]

List of usernames of team members

### name

> **name**: `string`

The name of the team

### registrations

> **registrations**: `string`[]

List of registered contests

## Defined in

[database.ts:1611](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1611)

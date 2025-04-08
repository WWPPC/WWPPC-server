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

> `readonly` **id**: `string`

Unique team id, a base36 integer, postfixing with `joinKey` creates the join code

### joinKey

> **joinKey**: `string`

A random 6-character alphanumeric string, prefixing with `id` creates the join code

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

[database.ts:1607](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1607)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [cryptoUtil](../README.md) / SessionTokenHandler

# Class: SessionTokenHandler\<PType, DType\>

Basic access token system with permissions checking and linked data.

## Type Parameters

• **PType**

• **DType**

## Constructors

### new SessionTokenHandler()

> **new SessionTokenHandler**\<`PType`, `DType`\>(): [`SessionTokenHandler`](SessionTokenHandler.md)\<`PType`, `DType`\>

#### Returns

[`SessionTokenHandler`](SessionTokenHandler.md)\<`PType`, `DType`\>

#### Defined in

[cryptoUtil.ts:136](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L136)

## Methods

### createToken()

> **createToken**(`perms`, `linkedData`, `expiration`?): `string`

Create and register a new token with specified permissions list that optionally expires after some time.

#### Parameters

• **perms**: `PType`[]

Permissions list

• **linkedData**: `DType`

Data to associate with the new token

• **expiration?**: `number`

Seconds until expiration removes the token

#### Returns

`string`

Access token

#### Defined in

[cryptoUtil.ts:154](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L154)

***

### getTokens()

> **getTokens**(): `Map`\<`string`, `object`\>

Get a map of all tokens and corresponding permissions lists.

#### Returns

`Map`\<`string`, `object`\>

Copy of token map

#### Defined in

[cryptoUtil.ts:165](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L165)

***

### removeToken()

> **removeToken**(`token`): `boolean`

Unregister a token for all permissions.

#### Parameters

• **token**: `string`

Token to unregister

#### Returns

`boolean`

If a token was previously registered and is now unregistered

#### Defined in

[cryptoUtil.ts:218](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L218)

***

### tokenData()

> **tokenData**(`token`): `null` \| `DType`

Get the linked data for a token if it exists.

#### Parameters

• **token**: `string`

Token to check

#### Returns

`null` \| `DType`

Token linked data or null if not exists

#### Defined in

[cryptoUtil.ts:195](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L195)

***

### tokenExists()

> **tokenExists**(`token`): `boolean`

Check if a token is registered.

#### Parameters

• **token**: `string`

Token to check

#### Returns

`boolean`

If the token is registered

#### Defined in

[cryptoUtil.ts:176](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L176)

***

### tokenHasPermissions()

> **tokenHasPermissions**(`token`, `perms`): `boolean`

Check if a token has a permission or all permissions in a list of permissions.

#### Parameters

• **token**: `string`

Token to check

• **perms**: `PType` \| `PType`[]

Permission or list of permissions

#### Returns

`boolean`

If the token contains the permission or all permissions from the list

#### Defined in

[cryptoUtil.ts:206](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L206)

***

### tokenPermissions()

> **tokenPermissions**(`token`): `null` \| `PType`[]

Get the permissions list for a token if it exists.

#### Parameters

• **token**: `string`

Token to check

#### Returns

`null` \| `PType`[]

Token permissions list or null if not exists

#### Defined in

[cryptoUtil.ts:185](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/cryptoUtil.ts#L185)

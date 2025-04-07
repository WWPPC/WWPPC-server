[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [cryptoUtil](../README.md) / TokenHandler

# Class: TokenHandler\<DType\>

Basic access token system with linked data.

## Type Parameters

• **DType**

## Constructors

### new TokenHandler()

> **new TokenHandler**\<`DType`\>(): [`TokenHandler`](TokenHandler.md)\<`DType`\>

#### Returns

[`TokenHandler`](TokenHandler.md)\<`DType`\>

#### Defined in

[cryptoUtil.ts:132](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L132)

## Methods

### createToken()

> **createToken**(`linkedData`, `expiration`?): `string`

Create and register a new token that optionally expires after some time.

#### Parameters

##### linkedData

`DType`

Data to associate with the new token

##### expiration?

`number`

Seconds until expiration removes the token

#### Returns

`string`

Access token

#### Defined in

[cryptoUtil.ts:151](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L151)

***

### dataExists()

> **dataExists**(`linkedData`): `boolean`

Check if any token has the linked data requested.

#### Parameters

##### linkedData

`DType`

Data to search for

#### Returns

`boolean`

If any token with equal linked data is found

#### Defined in

[cryptoUtil.ts:230](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L230)

***

### extendTokenExpiration()

> **extendTokenExpiration**(`token`, `expiration`): `boolean`

Update token expiration time.

#### Parameters

##### token

`string`

Token to update

##### expiration

`number`

New expiration duration in seconds, added onto the current time

#### Returns

`boolean`

If a token was found and the expiration time updated

#### Defined in

[cryptoUtil.ts:192](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L192)

***

### getTokenData()

> **getTokenData**(`token`): `null` \| `DType`

Get the linked data for a token if it exists.

#### Parameters

##### token

`string`

Token to check

#### Returns

`null` \| `DType`

Token linked data or null if not exists

#### Defined in

[cryptoUtil.ts:203](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L203)

***

### getTokens()

> **getTokens**(): `Record`\<`string`, `DType`\>

Get a map of all tokens and corresponding data.

#### Returns

`Record`\<`string`, `DType`\>

Copy of token map

#### Defined in

[cryptoUtil.ts:162](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L162)

***

### removeToken()

> **removeToken**(`token`): `boolean`

Unregister a token for all permissions.

#### Parameters

##### token

`string`

Token to unregister

#### Returns

`boolean`

If a token was previously registered and is now unregistered

#### Defined in

[cryptoUtil.ts:239](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L239)

***

### setTokenData()

> **setTokenData**(`token`, `linkedData`): `boolean`

Set the linked data for a token if it exists.

#### Parameters

##### token

`string`

Token to check

##### linkedData

`DType`

New data

#### Returns

`boolean`

If a token was found and the data updated

#### Defined in

[cryptoUtil.ts:214](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L214)

***

### tokenExists()

> **tokenExists**(`token`): `boolean`

Check if a token is registered.

#### Parameters

##### token

`string`

Token to check

#### Returns

`boolean`

If the token is registered

#### Defined in

[cryptoUtil.ts:173](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L173)

***

### tokenExpiration()

> **tokenExpiration**(`token`): `undefined` \| `number`

Check token expiration time.

#### Parameters

##### token

`string`

Token to check

#### Returns

`undefined` \| `number`

Expiration time, if the token exists and has an expiration

#### Defined in

[cryptoUtil.ts:182](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/cryptoUtil.ts#L182)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [config](../README.md) / GlobalConfiguration

# Interface: GlobalConfiguration

Global server configuration, loaded from `config/config.json`.
Includes contest configurations, loaded from `config/contests.json`.

## Properties

### contests

> `readonly` **contests**: `object`

Contest types and options (no defaults)

#### Index Signature

 \[`key`: `string`\]: `undefined` \| [`ContestConfiguration`](ContestConfiguration.md)

#### Defined in

[config.ts:58](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L58)

***

### dbCacheTime

> `readonly` **dbCacheTime**: `number`

Time in milliseconds before database cache entries expire (default: 60000)

#### Defined in

[config.ts:52](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L52)

***

### dbProblemCacheTime

> `readonly` **dbProblemCacheTime**: `number`

Time in milliseconds before database cache entries for problems expire (default: 600000)

#### Defined in

[config.ts:54](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L54)

***

### debugMode

> `readonly` **debugMode**: `boolean`

Enable debug logging (default: false)

#### Defined in

[config.ts:66](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L66)

***

### defaultProfileImg

> `readonly` **defaultProfileImg**: `string`

A `data:` URI representing the profile image given to every account on creation

#### Defined in

[config.ts:48](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L48)

***

### emailAddress

> `readonly` **emailAddress**: `string`

Sending email address (default: "no-reply@wwppc.tech")

#### Defined in

[config.ts:36](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L36)

***

### emailTemplatePath

> `readonly` **emailTemplatePath**: `string`

Directory to load email templates from (default: `../email-templates/`)

#### Defined in

[config.ts:72](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L72)

***

### graderTimeout

> `readonly` **graderTimeout**: `number`

Time in milliseconds before the grading host defaults a grading server to "disconnected" state (default: 180000)

#### Defined in

[config.ts:56](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L56)

***

### hostname

> `readonly` **hostname**: `string`

Hostname of website to be linked to in emails (default: "wwppc.tech")

#### Defined in

[config.ts:34](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L34)

***

### logEmailActivity

> `readonly` **logEmailActivity**: `boolean`

Log information about sent emails (default: true)

#### Defined in

[config.ts:64](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L64)

***

### logPath

> `readonly` **logPath**: `string`

Directory to write logs to - server will also create a `logs` directory there (default: `../`)

#### Defined in

[config.ts:70](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L70)

***

### maxProfileImgSize

> `readonly` **maxProfileImgSize**: `string`

Maximum file size of uploaded profile images (default: 4kb)

#### Defined in

[config.ts:50](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L50)

***

### maxSignupPerMinute

> `readonly` **maxSignupPerMinute**: `number`

Ratelimiting - how many new accounts can be made from any given IP address in 1 minute before requests are blocked (default: 1)

#### Defined in

[config.ts:44](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L44)

***

### maxSubmissionHistory

> `readonly` **maxSubmissionHistory**: `number`

Maximum amount of previous submissions for a user on a problem kept in the database (default: 24)

#### Defined in

[config.ts:62](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L62)

***

### path

> `readonly` **path**: `string`

Same as the `CONFIG_PATH` environment variable (this cannot be edited in `config.json``)

#### Defined in

[config.ts:68](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L68)

***

### port

> `readonly` **port**: `string`

TCP port for the HTTP/HTTPS server to listen to (default: 8000)

#### Defined in

[config.ts:38](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L38)

***

### recoveryEmailTimeout

> `readonly` **recoveryEmailTimeout**: `number`

Ratelimiting - how much time (in minutes) must pass between recovery emails being sent for any account (default: 10)

#### Defined in

[config.ts:46](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L46)

***

### rsaKeyRotateInterval

> `readonly` **rsaKeyRotateInterval**: `number`

Hours between client RSA keypair rotations (default: 24)

#### Defined in

[config.ts:42](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L42)

***

### sessionExpireTime

> `readonly` **sessionExpireTime**: `number`

Hours until login sessions expire (default 12)

#### Defined in

[config.ts:40](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L40)

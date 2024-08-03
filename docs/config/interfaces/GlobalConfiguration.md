[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [config](../README.md) / GlobalConfiguration

# Interface: GlobalConfiguration

Global server configuration, loaded from config.json.

## Properties

### contests

> `readonly` **contests**: `object`

Contest types and options (no defaults)

#### Index Signature

 \[`key`: `string`\]: [`ContestConfiguration`](ContestConfiguration.md) \| `undefined`

#### Defined in

[config.ts:53](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L53)

***

### dbCacheTime

> `readonly` **dbCacheTime**: `number`

Time in milliseconds before database cache entries expire (default: 60000)

#### Defined in

[config.ts:47](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L47)

***

### dbProblemCacheTime

> `readonly` **dbProblemCacheTime**: `number`

Time in milliseconds before database cache entries for problems expire (default: 600000)

#### Defined in

[config.ts:49](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L49)

***

### debugMode

> `readonly` **debugMode**: `boolean`

Enable debug logging (default: false)

#### Defined in

[config.ts:63](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L63)

***

### defaultProfileImg

> `readonly` **defaultProfileImg**: `string`

A `data:` URI representing the profile image given to every account on creation

#### Defined in

[config.ts:43](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L43)

***

### emailAddress

> `readonly` **emailAddress**: `string`

Sending email address (default: "no-reply@wwppc.tech")

#### Defined in

[config.ts:35](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L35)

***

### emailTemplatePath

> `readonly` **emailTemplatePath**: `string`

Directory to load email templates from (default: `../email-templates/`)

#### Defined in

[config.ts:71](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L71)

***

### graderTimeout

> `readonly` **graderTimeout**: `number`

Time in milliseconds before the grading host defaults a grading server to "disconnected" state (default: 180000)

#### Defined in

[config.ts:51](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L51)

***

### hostname

> `readonly` **hostname**: `string`

Hostname of website to be linked to in emails (default: "wwppc.tech")

#### Defined in

[config.ts:33](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L33)

***

### logEmailActivity

> `readonly` **logEmailActivity**: `boolean`

Log information about sent emails (default: true)

#### Defined in

[config.ts:59](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L59)

***

### logPath

> `readonly` **logPath**: `string`

Directory to write logs to - server will also create a `logs` directory there (default: `../`)

#### Defined in

[config.ts:69](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L69)

***

### maxConnectPerSecond

> `readonly` **maxConnectPerSecond**: `number`

Ratelimiting - how many new Socket.IO connections can be made from any given IP address in 1 second before clients are kicked (default: 5)

#### Defined in

[config.ts:39](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L39)

***

### maxProfileImgSize

> `readonly` **maxProfileImgSize**: `number`

Maximum file size of uploaded profile images (actually counts the length of the base64 encoded `data:` URI, so it is imperfect) (default: 65535)

#### Defined in

[config.ts:45](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L45)

***

### maxSignupPerMinute

> `readonly` **maxSignupPerMinute**: `number`

Ratelimiting - how many new accounts can be made from any given IP address in 1 minute before clients are kicked (default: 1)

#### Defined in

[config.ts:41](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L41)

***

### maxSubmissionHistory

> `readonly` **maxSubmissionHistory**: `number`

Maximum amount of previous submissions for a user on a problem kept in the database (only time, language, and scores are kept) (default: 24)

#### Defined in

[config.ts:57](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L57)

***

### path

> `readonly` **path**: `string`

Same as the `CONFIG_PATH` environment variable (this cannot be edited in `config.json``)

#### Defined in

[config.ts:67](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L67)

***

### port

> `readonly` **port**: `string`

TCP port for the HTTP/HTTPS server to listen to (default: 8000)

#### Defined in

[config.ts:37](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L37)

***

### rsaKeyRotateInterval

> `readonly` **rsaKeyRotateInterval**: `number`

Milliseconds between client RSA keypair rotations (default: 86400000)

#### Defined in

[config.ts:61](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L61)

***

### superSecretSecret

> `readonly` **superSecretSecret**: `boolean`

� (�: �)

#### Defined in

[config.ts:65](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L65)

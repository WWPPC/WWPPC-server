[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [config](../README.md) / default

# Variable: default

> `const` **default**: `object`

Global configuration, loaded from `config.json` in the config folder (config.path).
If any field is empty in `config.json`, it is filled in with the default.

## Type declaration

### acceptedLanguages

> `readonly` **acceptedLanguages**: `string`[]

Programming languages accepted by contest systems (case sensitive) (default: Java8, Java11, Java17, Java21, C11, C++11, C++17, C++20, Python3.12.3)

### adminPortalPath

> `readonly` **adminPortalPath**: `string`

Directory to load admin portal from (default: `../admin-portal/`)

### clientPath?

> `optional` `readonly` **clientPath**: `string`

Directory to serve static hosting from (if config.serveStatic is true) - setting this incorrectly can cause strange problems

### dbCacheTime

> `readonly` **dbCacheTime**: `number`

Time in milliseconds before database cache entries expire (default: 60000)

### dbProblemCacheTime

> `readonly` **dbProblemCacheTime**: `number`

Time in milliseconds before database cache entries for problems expire (default: 600000)

### debugMode

> `readonly` **debugMode**: `boolean`

Enable debug logging (default: false)

### defaultProfileImg

> `readonly` **defaultProfileImg**: `string`

A `data:` URI representing the profile image given to every account on creation

### emailAddress

> `readonly` **emailAddress**: `string`

Sending email address (default: "no-reply@wwppc.tech")

### emailTemplatePath

> `readonly` **emailTemplatePath**: `string`

Directory to load email templates from (default: `../email-templates/`)

### freezeScoresLastRound

> `readonly` **freezeScoresLastRound**: `boolean`

"Freeze" scores - stop updating scores on the client - within the last round of competitions (default: true)

### gradeAtRoundEnd

> `readonly` **gradeAtRoundEnd**: `boolean`

Withhold submission results for each round until the round ends (submissions are still instantly graded) (default: true)

### graderTimeout

> `readonly` **graderTimeout**: `number`

Time in milliseconds before the grading host defaults a grading server to "disconnected" state (default: 180000)

### hostname

> `readonly` **hostname**: `string`

Hostname of website to be linked to in emails (default: "wwppc.tech")

### logEmailActivity

> `readonly` **logEmailActivity**: `boolean`

Log information about sent emails (default: true)

### logPath

> `readonly` **logPath**: `string`

Directory to write logs to - server will also create a `logs` directory there (default: `../`)

### maxConnectPerSecond

> `readonly` **maxConnectPerSecond**: `number`

Ratelimiting - how many new Socket.IO connections can be made from any given IP address in 1 second before clients are kicked (default: 5)

### maxProfileImgSize

> `readonly` **maxProfileImgSize**: `number`

Maximum file size of uploaded profile images (actually counts the length of the base64 encoded `data:` URI, so it is imperfect) (default: 65535)

### maxSignupPerMinute

> `readonly` **maxSignupPerMinute**: `number`

Ratelimiting - how many new accounts can be made from any given IP address in 1 minute before clients are kicked (default: 1)

### maxSubmissionHistory

> `readonly` **maxSubmissionHistory**: `number`

Maximum amount of previous submissions for a user on a problem kept in the database (only time, language, and scores are kept) (default: 24)

### maxSubmissionSize

> `readonly` **maxSubmissionSize**: `number`

Maximum file size of uploaded submission files (actually counts the length of the base64 encoded `data:` URI, so it is imperfect) (default: 10240)

### path

> `readonly` **path**: `string`

Same as the `CONFIG_PATH` environment variable (this cannot be edited in `config.json``)

### port

> `readonly` **port**: `string`

TCP port for the HTTP/HTTPS server to listen to (default: 8000)

### rsaKeyRotateInterval

> `readonly` **rsaKeyRotateInterval**: `number`

Milliseconds between client RSA keypair rotations (default: 86400000)

### serveStatic

> `readonly` **serveStatic**: `boolean`

Enable static hosting (note that this WILL NOT WORK if config.clientPath is not set!)

### superSecretSecret

> `readonly` **superSecretSecret**: `boolean`

� (�: �)

## Source

[src/config.ts:22](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/config.ts#L22)

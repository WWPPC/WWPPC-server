[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Database

# Class: Database

PostgreSQL database connection for handling account operations and storage of contest data, including problems and submissions.
Has a short-term cache to reduce repetitive database calls.

## Constructors

### new Database()

> **new Database**(`params`): [`Database`](Database.md)

#### Parameters

• **params**: [`DatabaseConstructorParams`](../interfaces/DatabaseConstructorParams.md)

Parameters

#### Returns

[`Database`](Database.md)

#### Source

[src/database.ts:51](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L51)

## Properties

### #adminCache

> `private` **#adminCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:844](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L844)

***

### #cacheGarbageCollector

> `private` `readonly` **#cacheGarbageCollector**: `Timeout`

#### Source

[src/database.ts:46](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L46)

***

### #contestCache

> `private` **#contestCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:921](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L921)

***

### #db

> `private` `readonly` **#db**: `Client`

#### Source

[src/database.ts:35](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L35)

***

### #dbKey

> `private` `readonly` **#dbKey**: `Buffer`

#### Source

[src/database.ts:36](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L36)

***

### #problemCache

> `private` **#problemCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:1090](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1090)

***

### #publicKey

> `private` **#publicKey**: `undefined` \| `JsonWebKey`

#### Source

[src/database.ts:43](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L43)

***

### #roundCache

> `private` **#roundCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:1004](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1004)

***

### #rsaKeys

> `private` `readonly` **#rsaKeys**: `Promise`\<`CryptoKeyPair`\>

#### Source

[src/database.ts:37](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L37)

***

### #submissionCache

> `private` **#submissionCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:1185](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1185)

***

### #teamCache

> `private` **#teamCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:236](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L236)

***

### #userCache

> `private` **#userCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:235](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L235)

***

### connectPromise

> `readonly` **connectPromise**: `Promise`\<`any`\>

Resolves when the database is connected.

#### Source

[src/database.ts:34](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L34)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/database.ts:44](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L44)

***

### mailer

> `readonly` **mailer**: [`Mailer`](../../email/classes/Mailer.md)

#### Source

[src/database.ts:45](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L45)

## Accessors

### publicKey

> `get` **publicKey**(): `undefined` \| `JsonWebKey`

#### Returns

`undefined` \| `JsonWebKey`

#### Source

[src/database.ts:103](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L103)

## Methods

### #RSAdecryptSymmetric()

> `private` **#RSAdecryptSymmetric**(`encrypted`): `string`

Symmetrically decrypt using AES-256 GCM and the database key.

#### Parameters

• **encrypted**: `string`

Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag

#### Returns

`string`

Plaintext (the encrypted text if there was an error)

#### Source

[src/database.ts:138](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L138)

***

### #RSAencryptSymmetric()

> `private` **#RSAencryptSymmetric**(`plaintext`): `string`

Symmetrically encrypt using AES-256 GCM and the database key.

#### Parameters

• **plaintext**: `string`

Plaintext

#### Returns

`string`

Colon-concatenated base64-encoded ciphertext, initialization vector, and authentication tag (the plaintext if there was an error)

#### Source

[src/database.ts:123](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L123)

***

### #buildColumnConditions()

> `private` **#buildColumnConditions**(`columns`): `object`

Transform a list of possible conditions into a string with SQL conditions and bindings. Allows for blank inputs to be treated as wildcards (by omitting the condition)

#### Parameters

• **columns**: `object`[]

Array of columns with conditions to check. If any value is undefined the condition is omitted

#### Returns

`object`

String of conditions to append to end of SQL query (after `WHERE` clause) and accompanying bindings array

##### bindings

> **bindings**: [`SqlValue`](../type-aliases/SqlValue.md)[]

##### queryConditions

> **queryConditions**: `string`

#### Source

[src/database.ts:166](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L166)

***

### #rotateRecoveryPassword()

> `private` **#rotateRecoveryPassword**(`username`): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Rotates the recovery password of an account to a new random string.

#### Parameters

• **username**: `string`

Username to rotate

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Rotation status

#### Source

[src/database.ts:573](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L573)

***

### RSAdecrypt()

> **RSAdecrypt**(`buf`): `Promise`\<[`RSAEncrypted`](../type-aliases/RSAEncrypted.md)\>

Decrypt a message using the RSA-OAEP private key.

#### Parameters

• **buf**: [`RSAEncrypted`](../type-aliases/RSAEncrypted.md)

Encrypted ArrayBuffer representing a string or an unencrypted string (pass-through if encryption is not possible)

#### Returns

`Promise`\<[`RSAEncrypted`](../type-aliases/RSAEncrypted.md)\>

Decrypted string

#### Source

[src/database.ts:109](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L109)

***

### changeAccountPassword()

> **changeAccountPassword**(`username`, `password`, `newPassword`): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Change the password of an account. Requires that the existing password is correct. **Does not validate credentials**.
If successful, the `recoverypass` field is rotated to a new random string.

#### Parameters

• **username**: `string`

Valid username

• **password**: `string`

Valid current password

• **newPassword**: `string`

Valid new password

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Update status

#### Source

[src/database.ts:453](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L453)

***

### changeAccountPasswordToken()

> **changeAccountPasswordToken**(`username`, `token`, `newPassword`): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Change the password of an account using the alternative rotating password. Requires that the alternative rotating password is correct. **Does not validate credentials**.
If successful, the `recoverypass` field is rotated to a new random string.

#### Parameters

• **username**: `string`

Valid username

• **token**: `string`

Alternative rotating password

• **newPassword**: `string`

Valid new password

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Update status

#### Source

[src/database.ts:478](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L478)

***

### checkAccount()

> **checkAccount**(`username`, `password`): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Check credentials against an existing account. **Does not validate credentials**.
If successful, the `recoverypass` field is rotated to a new random string.

#### Parameters

• **username**: `string`

Valid username

• **password**: `string`

Valid password

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Check status

#### Source

[src/database.ts:350](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L350)

***

### clearCache()

> **clearCache**(): `void`

Clears all database account, team, admin, contest, round, problem, and submission cache entries.

#### Returns

`void`

#### Source

[src/database.ts:1316](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1316)

***

### createAccount()

> **createAccount**(`username`, `password`, `userData`): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`ALREADY_EXISTS`](../enumerations/AccountOpResult.md#already_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Create an account. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **password**: `string`

Valid password

• **userData**

Initial user data

• **userData.email**: `string`

• **userData.experience**: `number`

• **userData.firstName**: `string`

• **userData.grade**: `number`

• **userData.languages**: `string`[]

• **userData.lastName**: `string`

• **userData.school**: `string`

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`ALREADY_EXISTS`](../enumerations/AccountOpResult.md#already_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Creation status

#### Source

[src/database.ts:300](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L300)

***

### deleteAccount()

> **deleteAccount**(`username`, `password`, `adminUsername`?): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Delete an account. Allows deletion by users and admins with permission level `AdminPerms.MANAGE_ACCOUNTS` if `adminUsername` is given. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **password**: `string`

Valid password of user, or admin password if `adminUsername` is given

• **adminUsername?**: `string`

Valid username of administrator

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Deletion status

#### Source

[src/database.ts:506](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L506)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` representing when the database has disconnected.

#### Source

[src/database.ts:154](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L154)

***

### finishContest()

> **finishContest**(`contest`): `Promise`\<`boolean`\>

Moves all instances of a contest from upcoming registrations to the past registrations of every team.

#### Parameters

• **contest**: `string`

Contest ID to mark as completed

#### Returns

`Promise`\<`boolean`\>

#### Source

[src/database.ts:801](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L801)

***

### getAccountData()

> **getAccountData**(`username`): `Promise`\<[`AccountData`](../interfaces/AccountData.md) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Get user data for an account. Registrations are fetched through team alias. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

#### Returns

`Promise`\<[`AccountData`](../interfaces/AccountData.md) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

AccountData or an error code

#### Source

[src/database.ts:374](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L374)

***

### getAccountList()

> **getAccountList**(): `Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

Read a list of all accounts that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

#### Source

[src/database.ts:250](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L250)

***

### getAccountTeam()

> **getAccountTeam**(`username`): `Promise`\<`string` \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Get the id of a user's team (the team creator's username). **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

#### Returns

`Promise`\<`string` \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Team id or an error code

#### Source

[src/database.ts:593](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L593)

***

### getAdminList()

> **getAdminList**(): `Promise`\<`null` \| `object`[]\>

Get a list of all administrators and their boolean permission flags.

#### Returns

`Promise`\<`null` \| `object`[]\>

Paired usernames and permissions, or null if an error cocured.

#### Source

[src/database.ts:873](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L873)

***

### getAllRegisteredUsers()

> **getAllRegisteredUsers**(`contest`): `Promise`\<`null` \| `string`[]\>

Get a list of all users that are registered for a contest.

#### Parameters

• **contest**: `string`

Contest id

#### Returns

`Promise`\<`null` \| `string`[]\>

#### Source

[src/database.ts:829](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L829)

***

### getRecoveryPassword()

> **getRecoveryPassword**(`username`): `Promise`\<`string` \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Get the alternative rotating password for an account. **Does not validate credentials**

#### Parameters

• **username**: `string`

Valid username

#### Returns

`Promise`\<`string` \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Fetch status

#### Source

[src/database.ts:552](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L552)

***

### getTeamData()

> **getTeamData**(`username`): `Promise`\<[`TeamData`](../interfaces/TeamData.md) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Get the team data associated with a username. Will route to the team returned by `getAccountTeam`. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

#### Returns

`Promise`\<[`TeamData`](../interfaces/TeamData.md) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Team data or an error code

#### Source

[src/database.ts:652](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L652)

***

### hasAdminPerms()

> **hasAdminPerms**(`username`, `flag`): `Promise`\<`boolean`\>

Check if an administrator has a certain permission.

#### Parameters

• **username**: `string`

Valid administrator username

• **flag**: [`AdminPerms`](../enumerations/AdminPerms.md)

Permission flag to check against

#### Returns

`Promise`\<`boolean`\>

If the administrator has the permission. Also false if the user is not an administrator.

#### Source

[src/database.ts:851](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L851)

***

### readContests()

> **readContests**(`c`): `Promise`\<`null` \| [`Contest`](../interfaces/Contest.md)[]\>

Filter and get a list of contest data from the contests table according to a criteria.

#### Parameters

• **c**: [`ReadContestsCriteria`](../interfaces/ReadContestsCriteria.md)= `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Contest`](../interfaces/Contest.md)[]\>

Array of contest data matching the filter criteria

#### Source

[src/database.ts:927](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L927)

***

### readProblems()

> **readProblems**(`c`): `Promise`\<`null` \| [`Problem`](../interfaces/Problem.md)[]\>

Filter and get a list of problems from the problems table according to a criteria.

#### Parameters

• **c**: [`ReadProblemsCriteria`](../interfaces/ReadProblemsCriteria.md)= `{}`

Filter criteria. Leaving one undefined removes the criterion

#### Returns

`Promise`\<`null` \| [`Problem`](../interfaces/Problem.md)[]\>

Array of problems matching the filter criteria. If the query failed the returned value is `null`

#### Source

[src/database.ts:1096](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1096)

***

### readRounds()

> **readRounds**(`c`): `Promise`\<`null` \| [`Round`](../interfaces/Round.md)[]\>

Filter and get a list of round data from the rounds table according to a criteria.

#### Parameters

• **c**: [`ReadRoundsCriteria`](../interfaces/ReadRoundsCriteria.md)= `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Round`](../interfaces/Round.md)[]\>

Array of round data matching the filter criteria. If the query failed the returned value is `null`

#### Source

[src/database.ts:1010](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1010)

***

### readSubmissions()

> **readSubmissions**(`c`): `Promise`\<`null` \| [`Submission`](../interfaces/Submission.md)[]\>

Filter and get a list of submissions from the submissions table according to a criteria.

#### Parameters

• **c**: [`ReadSubmissionsCriteria`](../interfaces/ReadSubmissionsCriteria.md)= `{}`

Filter criteria. Leaving one undefined removes the criterion

#### Returns

`Promise`\<`null` \| [`Submission`](../interfaces/Submission.md)[]\>

Array of submissions matching the filter criteria. If the query failed the returned value is `null`

#### Source

[src/database.ts:1191](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1191)

***

### registerContest()

> **registerContest**(`username`, `contest`): `Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`CONTEST_ALREADY_EXISTS`](../enumerations/TeamOpResult.md#contest_already_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Register an account for a contest, also registering all other accounts on the same team. Prevents duplicate registrations. Does not prevent registering a team that is too large. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **contest**: `string`

Contest id

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`CONTEST_ALREADY_EXISTS`](../enumerations/TeamOpResult.md#contest_already_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Registration status

#### Source

[src/database.ts:721](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L721)

***

### setAccountTeam()

> **setAccountTeam**(`username`, `team`, `useJoinCode`): `Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`NOT_ALLOWED`](../enumerations/TeamOpResult.md#not_allowed) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Set the id of a user's team (the team creator's username). Also clears existing registrations to avoid incorrect registration reporting. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **team**: `string`

Valid username (of team) OR join code

• **useJoinCode**: `boolean`= `false`

If should search by join code instead (default false)

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`NOT_ALLOWED`](../enumerations/TeamOpResult.md#not_allowed) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Update status

#### Source

[src/database.ts:614](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L614)

***

### setAdminPerms()

> **setAdminPerms**(`username`, `permissions`): `Promise`\<`boolean`\>

Set the permission bit flags of an administrator, or add a new administrator. If permissions bit 0 is false (not admin), the administrator is removed.

#### Parameters

• **username**: `string`

Valid username

• **permissions**: `number`

Permission flags, as a number (boolean OR)

#### Returns

`Promise`\<`boolean`\>

If writing was successful.

#### Source

[src/database.ts:897](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L897)

***

### unregisterAllContests()

> **unregisterAllContests**(`username`): `Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Unregister an account for all contests (shortcut method), also unregistering all other accounts on the same team. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Registration status

#### Source

[src/database.ts:784](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L784)

***

### unregisterContest()

> **unregisterContest**(`username`, `contest`): `Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Unregister an account for a contest, also unregistering all other accounts on the same team. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **contest**: `string`

Contest id

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Registration status

#### Source

[src/database.ts:755](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L755)

***

### updateAccountData()

> **updateAccountData**(`username`, `userData`): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Overwrite user data for an existing account. *Only uses part of the data*. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **userData**: [`AccountData`](../interfaces/AccountData.md)

New data (only `firstName`, `lastName`, `displayName`, `profileImage`, `school`, `grade`, `experience`, `languages`, and `bio` fields are updated)

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Update status

#### Source

[src/database.ts:425](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L425)

***

### updateTeamData()

> **updateTeamData**(`username`, `teamData`): `Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Overwrite the team data for an existing team. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **teamData**: [`TeamData`](../interfaces/TeamData.md)

New data

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Update status

#### Source

[src/database.ts:693](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L693)

***

### validate()

> **validate**(`username`, `password`): `boolean`

Validate a pair of credentials. To be valid, a username must be an alphanumeric string of length <= 16, and the password must be a string of length <= 1024.

#### Parameters

• **username**: `string`

Username

• **password**: `string`

Password

#### Returns

`boolean`

Validity

#### Source

[src/database.ts:243](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L243)

***

### writeContest()

> **writeContest**(`contest`): `Promise`\<`boolean`\>

Write a contest to the contests table.

#### Parameters

• **contest**: [`Contest`](../interfaces/Contest.md)

Contest to write

#### Returns

`Promise`\<`boolean`\>

If the write was successful

#### Source

[src/database.ts:985](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L985)

***

### writeProblem()

> **writeProblem**(`problem`): `Promise`\<`boolean`\>

Write a problem to the problems table.

#### Parameters

• **problem**: [`Problem`](../interfaces/Problem.md)

Problem to write

#### Returns

`Promise`\<`boolean`\>

If the write was successful

#### Source

[src/database.ts:1166](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1166)

***

### writeRound()

> **writeRound**(`round`): `Promise`\<`boolean`\>

Write a round to the rounds table.

#### Parameters

• **round**: [`Round`](../interfaces/Round.md)

Round to write

#### Returns

`Promise`\<`boolean`\>

If the write was successful

#### Source

[src/database.ts:1071](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1071)

***

### writeSubmission()

> **writeSubmission**(`submission`, `overwrite`?): `Promise`\<`boolean`\>

Write a submission to the submissions table. The `history` field is ignored.
If the most recent submission has an empty `scores` field, the submission will be overwritten instead of appended to history.

#### Parameters

• **submission**: [`Submission`](../interfaces/Submission.md)

Submission to write

• **overwrite?**: `boolean`

Force overwriting of most recent submission

#### Returns

`Promise`\<`boolean`\>

If the write was successful

#### Source

[src/database.ts:1276](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1276)

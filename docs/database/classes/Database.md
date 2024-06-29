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

[src/database.ts:41](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L41)

## Properties

### #adminCache

> `private` `readonly` **#adminCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:810](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L810)

***

### #cacheGarbageCollector

> `private` `readonly` **#cacheGarbageCollector**: `Timeout`

#### Source

[src/database.ts:36](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L36)

***

### #contestCache

> `private` `readonly` **#contestCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:887](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L887)

***

### #db

> `private` `readonly` **#db**: `Client`

#### Source

[src/database.ts:33](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L33)

***

### #dbKey

> `private` `readonly` **#dbKey**: `Buffer`

#### Source

[src/database.ts:34](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L34)

***

### #problemCache

> `private` `readonly` **#problemCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:1058](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1058)

***

### #roundCache

> `private` `readonly` **#roundCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:972](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L972)

***

### #submissionCache

> `private` `readonly` **#submissionCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:1153](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1153)

***

### #teamCache

> `private` `readonly` **#teamCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:202](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L202)

***

### #userCache

> `private` `readonly` **#userCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:201](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L201)

***

### connectPromise

> `readonly` **connectPromise**: `Promise`\<`any`\>

Resolves when the database is connected.

#### Source

[src/database.ts:32](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L32)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/database.ts:35](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L35)

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

[src/database.ts:104](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L104)

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

[src/database.ts:89](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L89)

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

[src/database.ts:132](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L132)

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

[src/database.ts:539](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L539)

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

[src/database.ts:419](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L419)

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

[src/database.ts:444](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L444)

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

[src/database.ts:316](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L316)

***

### clearCache()

> **clearCache**(): `void`

Clears all database account, team, admin, contest, round, problem, and submission cache entries.

#### Returns

`void`

#### Source

[src/database.ts:1284](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1284)

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

[src/database.ts:266](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L266)

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

[src/database.ts:472](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L472)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` representing when the database has disconnected.

#### Source

[src/database.ts:120](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L120)

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

[src/database.ts:767](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L767)

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

[src/database.ts:340](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L340)

***

### getAccountList()

> **getAccountList**(): `Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

Read a list of all accounts that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

#### Source

[src/database.ts:216](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L216)

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

[src/database.ts:559](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L559)

***

### getAdminList()

> **getAdminList**(): `Promise`\<`null` \| `object`[]\>

Get a list of all administrators and their boolean permission flags.

#### Returns

`Promise`\<`null` \| `object`[]\>

Paired usernames and permissions, or null if an error cocured.

#### Source

[src/database.ts:839](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L839)

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

[src/database.ts:795](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L795)

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

[src/database.ts:518](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L518)

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

[src/database.ts:618](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L618)

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

[src/database.ts:817](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L817)

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

[src/database.ts:893](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L893)

***

### readProblems()

> **readProblems**(`c`): `Promise`\<`null` \| [`Problem`](../interfaces/Problem.md)[]\>

Filter and get a list of problems from the problems table according to a criteria.

#### Parameters

• **c**: [`ReadProblemsCriteria`](../interfaces/ReadProblemsCriteria.md)= `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Problem`](../interfaces/Problem.md)[]\>

Array of problems matching the filter criteria. If the query failed the returned value is `null`

#### Source

[src/database.ts:1064](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1064)

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

[src/database.ts:978](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L978)

***

### readSubmissions()

> **readSubmissions**(`c`): `Promise`\<`null` \| [`Submission`](../interfaces/Submission.md)[]\>

Filter and get a list of submissions from the submissions table according to a criteria.

#### Parameters

• **c**: [`ReadSubmissionsCriteria`](../interfaces/ReadSubmissionsCriteria.md)= `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Submission`](../interfaces/Submission.md)[]\>

Array of submissions matching the filter criteria. If the query failed the returned value is `null`

#### Source

[src/database.ts:1159](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1159)

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

[src/database.ts:687](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L687)

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

[src/database.ts:580](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L580)

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

[src/database.ts:863](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L863)

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

[src/database.ts:750](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L750)

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

[src/database.ts:721](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L721)

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

[src/database.ts:391](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L391)

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

[src/database.ts:659](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L659)

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

[src/database.ts:209](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L209)

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

[src/database.ts:953](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L953)

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

[src/database.ts:1134](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1134)

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

[src/database.ts:1039](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1039)

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

[src/database.ts:1244](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1244)

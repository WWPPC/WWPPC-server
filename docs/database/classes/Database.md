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

[src/database.ts:40](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L40)

## Properties

### #adminCache

> `private` `readonly` **#adminCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:777](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L777)

***

### #cacheGarbageCollector

> `private` `readonly` **#cacheGarbageCollector**: `Timeout`

#### Source

[src/database.ts:35](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L35)

***

### #contestCache

> `private` `readonly` **#contestCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:854](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L854)

***

### #db

> `private` `readonly` **#db**: `Client`

#### Source

[src/database.ts:32](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L32)

***

### #dbEncryptor

> `private` `readonly` **#dbEncryptor**: [`AESEncryptionHandler`](../../cryptoUtil/classes/AESEncryptionHandler.md)

#### Source

[src/database.ts:33](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L33)

***

### #problemCache

> `private` `readonly` **#problemCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:1025](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1025)

***

### #roundCache

> `private` `readonly` **#roundCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:939](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L939)

***

### #submissionCache

> `private` `readonly` **#submissionCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:1120](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1120)

***

### #teamCache

> `private` `readonly` **#teamCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:169](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L169)

***

### #userCache

> `private` `readonly` **#userCache**: `Map`\<`string`, `object`\>

#### Source

[src/database.ts:168](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L168)

***

### connectPromise

> `readonly` **connectPromise**: `Promise`\<`any`\>

Resolves when the database is connected.

#### Source

[src/database.ts:31](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L31)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/database.ts:34](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L34)

## Methods

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

[src/database.ts:99](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L99)

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

[src/database.ts:506](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L506)

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

[src/database.ts:386](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L386)

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

[src/database.ts:411](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L411)

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

[src/database.ts:283](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L283)

***

### clearCache()

> **clearCache**(): `void`

Clears all database account, team, admin, contest, round, problem, and submission cache entries.

#### Returns

`void`

#### Source

[src/database.ts:1251](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1251)

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

[src/database.ts:233](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L233)

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

[src/database.ts:439](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L439)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` representing when the database has disconnected.

#### Source

[src/database.ts:87](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L87)

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

[src/database.ts:734](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L734)

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

[src/database.ts:307](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L307)

***

### getAccountList()

> **getAccountList**(): `Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

Read a list of all accounts that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

#### Source

[src/database.ts:183](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L183)

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

[src/database.ts:526](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L526)

***

### getAdminList()

> **getAdminList**(): `Promise`\<`null` \| `object`[]\>

Get a list of all administrators and their boolean permission flags.

#### Returns

`Promise`\<`null` \| `object`[]\>

Paired usernames and permissions, or null if an error cocured.

#### Source

[src/database.ts:806](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L806)

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

[src/database.ts:762](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L762)

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

[src/database.ts:485](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L485)

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

[src/database.ts:585](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L585)

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

[src/database.ts:784](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L784)

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

[src/database.ts:860](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L860)

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

[src/database.ts:1031](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1031)

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

[src/database.ts:945](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L945)

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

[src/database.ts:1126](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1126)

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

[src/database.ts:654](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L654)

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

[src/database.ts:547](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L547)

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

[src/database.ts:830](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L830)

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

[src/database.ts:717](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L717)

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

[src/database.ts:688](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L688)

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

[src/database.ts:358](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L358)

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

[src/database.ts:626](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L626)

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

[src/database.ts:176](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L176)

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

[src/database.ts:920](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L920)

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

[src/database.ts:1101](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1101)

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

[src/database.ts:1006](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1006)

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

[src/database.ts:1211](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1211)

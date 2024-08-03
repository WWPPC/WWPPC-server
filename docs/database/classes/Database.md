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

#### Defined in

[database.ts:40](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L40)

## Properties

### connectPromise

> `readonly` **connectPromise**: `Promise`\<`any`\>

Resolves when the database is connected.

#### Defined in

[database.ts:31](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L31)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[database.ts:34](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L34)

## Methods

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

#### Defined in

[database.ts:385](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L385)

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

#### Defined in

[database.ts:410](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L410)

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

#### Defined in

[database.ts:283](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L283)

***

### clearCache()

> **clearCache**(): `void`

Clears all database account, team, admin, contest, round, problem, and submission cache entries.

#### Returns

`void`

#### Defined in

[database.ts:1251](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1251)

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

#### Defined in

[database.ts:233](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L233)

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

#### Defined in

[database.ts:438](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L438)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` representing when the database has disconnected.

#### Defined in

[database.ts:87](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L87)

***

### finishContest()

> **finishContest**(`contest`): `Promise`\<`boolean`\>

Moves all instances of a contest from upcoming registrations to the past registrations of every team.

#### Parameters

• **contest**: `string`

Contest ID to mark as completed

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[database.ts:733](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L733)

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

#### Defined in

[database.ts:307](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L307)

***

### getAccountList()

> **getAccountList**(): `Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

Read a list of all accounts that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| [`AccountData`](../interfaces/AccountData.md)[]\>

#### Defined in

[database.ts:183](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L183)

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

#### Defined in

[database.ts:525](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L525)

***

### getAdminList()

> **getAdminList**(): `Promise`\<`null` \| `object`[]\>

Get a list of all administrators and their boolean permission flags.

#### Returns

`Promise`\<`null` \| `object`[]\>

Paired usernames and permissions, or null if an error cocured.

#### Defined in

[database.ts:805](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L805)

***

### getAllRegisteredUsers()

> **getAllRegisteredUsers**(`contest`): `Promise`\<`null` \| `string`[]\>

Get a list of all users that are registered for a contest.

#### Parameters

• **contest**: `string`

Contest id

#### Returns

`Promise`\<`null` \| `string`[]\>

#### Defined in

[database.ts:761](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L761)

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

#### Defined in

[database.ts:484](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L484)

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

#### Defined in

[database.ts:584](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L584)

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

#### Defined in

[database.ts:783](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L783)

***

### readContests()

> **readContests**(`c`): `Promise`\<`null` \| [`Contest`](../interfaces/Contest.md)[]\>

Filter and get a list of contest data from the contests table according to a criteria.

#### Parameters

• **c**: [`ReadContestsCriteria`](../interfaces/ReadContestsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Contest`](../interfaces/Contest.md)[]\>

Array of contest data matching the filter criteria

#### Defined in

[database.ts:859](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L859)

***

### readProblems()

> **readProblems**(`c`): `Promise`\<`null` \| [`Problem`](../interfaces/Problem.md)[]\>

Filter and get a list of problems from the problems table according to a criteria.

#### Parameters

• **c**: [`ReadProblemsCriteria`](../interfaces/ReadProblemsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Problem`](../interfaces/Problem.md)[]\>

Array of problems matching the filter criteria. If the query failed the returned value is `null`

#### Defined in

[database.ts:1030](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1030)

***

### readRounds()

> **readRounds**(`c`): `Promise`\<`null` \| [`Round`](../interfaces/Round.md)[]\>

Filter and get a list of round data from the rounds table according to a criteria.

#### Parameters

• **c**: [`ReadRoundsCriteria`](../interfaces/ReadRoundsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Round`](../interfaces/Round.md)[]\>

Array of round data matching the filter criteria. If the query failed the returned value is `null`

#### Defined in

[database.ts:944](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L944)

***

### readSubmissions()

> **readSubmissions**(`c`): `Promise`\<`null` \| [`Submission`](../interfaces/Submission.md)[]\>

Filter and get a list of submissions from the submissions table according to a criteria.

#### Parameters

• **c**: [`ReadSubmissionsCriteria`](../interfaces/ReadSubmissionsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<`null` \| [`Submission`](../interfaces/Submission.md)[]\>

Array of submissions matching the filter criteria. If the query failed the returned value is `null`

#### Defined in

[database.ts:1126](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1126)

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

#### Defined in

[database.ts:653](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L653)

***

### setAccountTeam()

> **setAccountTeam**(`username`, `team`, `useJoinCode`): `Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`NOT_ALLOWED`](../enumerations/TeamOpResult.md#not_allowed) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Set the id of a user's team (the team creator's username). Also clears existing registrations to avoid incorrect registration reporting. **Does not validate credentials**.

#### Parameters

• **username**: `string`

Valid username

• **team**: `string`

Valid username (of team) OR join code

• **useJoinCode**: `boolean` = `false`

If should search by join code instead (default false)

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/TeamOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/TeamOpResult.md#not_exists) \| [`NOT_ALLOWED`](../enumerations/TeamOpResult.md#not_allowed) \| [`ERROR`](../enumerations/TeamOpResult.md#error)\>

Update status

#### Defined in

[database.ts:546](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L546)

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

#### Defined in

[database.ts:829](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L829)

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

#### Defined in

[database.ts:716](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L716)

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

#### Defined in

[database.ts:687](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L687)

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

#### Defined in

[database.ts:357](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L357)

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

#### Defined in

[database.ts:625](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L625)

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

#### Defined in

[database.ts:176](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L176)

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

#### Defined in

[database.ts:919](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L919)

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

#### Defined in

[database.ts:1101](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1101)

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

#### Defined in

[database.ts:1005](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1005)

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

#### Defined in

[database.ts:1211](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1211)

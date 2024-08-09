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

[database.ts:40](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L40)

## Properties

### connectPromise

> `readonly` **connectPromise**: `Promise`\<`any`\>

Resolves when the database is connected.

#### Defined in

[database.ts:31](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L31)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[database.ts:34](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L34)

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

[database.ts:358](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L358)

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

[database.ts:383](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L383)

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

[database.ts:256](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L256)

***

### clearCache()

> **clearCache**(): `void`

Clears all database account, team, admin, contest, round, problem, and submission cache entries.

#### Returns

`void`

#### Defined in

[database.ts:1363](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1363)

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

[database.ts:206](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L206)

***

### deleteAccount()

> **deleteAccount**(`username`, `password`, `adminUsername`?): `Promise`\<[`SUCCESS`](../enumerations/AccountOpResult.md#success) \| [`NOT_EXISTS`](../enumerations/AccountOpResult.md#not_exists) \| [`INCORRECT_CREDENTIALS`](../enumerations/AccountOpResult.md#incorrect_credentials) \| [`ERROR`](../enumerations/AccountOpResult.md#error)\>

Delete an account. Allows deletion by users and admins with permission level `AdminPerms.MANAGE_ACCOUNTS` if `adminUsername` is given. **Does not validate credentials**.
*Note: Requires password or admin username to delete to avoid accidental deletion of accounts.*

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

[database.ts:412](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L412)

***

### deleteContest()

> **deleteContest**(`id`): `Promise`\<`boolean`\>

Delete a contest from the contests table.

#### Parameters

• **id**: `string`

Contest to delete

#### Returns

`Promise`\<`boolean`\>

If the delete was successful

#### Defined in

[database.ts:932](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L932)

***

### deleteProblem()

> **deleteProblem**(`id`): `Promise`\<`boolean`\>

Delete a problem from the problems table.

#### Parameters

• **id**: `string`

Problem to delete

#### Returns

`Promise`\<`boolean`\>

If the delete was successful

#### Defined in

[database.ts:1182](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1182)

***

### deleteRound()

> **deleteRound**(`id`): `Promise`\<`boolean`\>

Delete a round from the round table.

#### Parameters

• **id**: `string`

Round to delete

#### Returns

`Promise`\<`boolean`\>

If the delete was successful

#### Defined in

[database.ts:1052](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1052)

***

### deleteSubmission()

> **deleteSubmission**(`id`, `username`, `analysis`): `Promise`\<`boolean`\>

Delete a submission from the submission table.

#### Parameters

• **id**: `string`

Problem id linked to submission to delete

• **username**: `string`

Username linked to submission to delete

• **analysis**: `boolean`

#### Returns

`Promise`\<`boolean`\>

If the delete was successful

#### Defined in

[database.ts:1345](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1345)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` representing when the database has disconnected.

#### Defined in

[database.ts:87](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L87)

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

[database.ts:707](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L707)

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

[database.ts:280](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L280)

***

### getAccountList()

> **getAccountList**(): `Promise`\<`null` \| `string`[]\>

Read a list of all account usernames that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| `string`[]\>

List of account usernames, or null if an error occurred

#### Defined in

[database.ts:187](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L187)

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

[database.ts:499](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L499)

***

### getAdminList()

> **getAdminList**(): `Promise`\<`null` \| `object`[]\>

Get a list of all administrators and their boolean permission flags.

#### Returns

`Promise`\<`null` \| `object`[]\>

Paired usernames and permissions, or null if an error cocured.

#### Defined in

[database.ts:779](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L779)

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

[database.ts:735](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L735)

***

### getContestList()

> **getContestList**(): `Promise`\<`null` \| `string`[]\>

Read a list of all contest IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| `string`[]\>

List of contest IDs, or null if an error occurred

#### Defined in

[database.ts:832](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L832)

***

### getProblemList()

> **getProblemList**(): `Promise`\<`null` \| `string`[]\>

Read a list of all problem IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| `string`[]\>

List of problem IDs, or null if an error occurred

#### Defined in

[database.ts:1071](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1071)

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

[database.ts:458](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L458)

***

### getRoundList()

> **getRoundList**(): `Promise`\<`null` \| `string`[]\>

Read a list of all round IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| `string`[]\>

List of round IDs, or null if an error occurred

#### Defined in

[database.ts:951](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L951)

***

### getSubmissionList()

> **getSubmissionList**(): `Promise`\<`null` \| `string`[]\>

Read a list of all submission ID strings, created from problem ID, username, and analysis mode, like `problemId:username:analysis` that exist. Bypasses cache.

#### Returns

`Promise`\<`null` \| `string`[]\>

List of submission ID strings, or null if an error occurred

#### Defined in

[database.ts:1201](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1201)

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

[database.ts:558](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L558)

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

[database.ts:757](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L757)

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

[database.ts:849](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L849)

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

[database.ts:1088](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1088)

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

[database.ts:968](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L968)

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

[database.ts:1218](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1218)

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

[database.ts:627](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L627)

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

[database.ts:520](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L520)

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

[database.ts:803](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L803)

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

[database.ts:690](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L690)

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

[database.ts:661](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L661)

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

[database.ts:330](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L330)

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

[database.ts:599](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L599)

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

[database.ts:180](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L180)

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

[database.ts:909](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L909)

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

[database.ts:1159](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1159)

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

[database.ts:1029](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1029)

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

[database.ts:1303](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1303)

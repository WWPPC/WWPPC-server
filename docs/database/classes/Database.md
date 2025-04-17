[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / Database

# Class: Database

PostgreSQL database connection for handling account operations and storage of contest data, including problems and submissions.
Has a short-term cache to speed up repetitive database queries.

## Constructors

### new Database()

> **new Database**(`params`): [`Database`](Database.md)

#### Parameters

##### params

[`DatabaseConstructorParams`](../type-aliases/DatabaseConstructorParams.md)

Parameters

#### Returns

[`Database`](Database.md)

#### Defined in

[database.ts:41](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L41)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[database.ts:35](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L35)

***

### teamJoinKeyLength

> `readonly` `static` **teamJoinKeyLength**: `6` = `6`

Length of team join keys (changing this will break existing teams!)

#### Defined in

[database.ts:31](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L31)

## Methods

### changeAccountPassword()

> **changeAccountPassword**(`username`, `password`, `newPassword`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Change the password of an account. Requires that the existing password is correct. **Does not validate credentials**.
If successful, the `recoverypass` field is rotated to a new random string.

#### Parameters

##### username

`string`

Valid username

##### password

`string`

Valid current password

##### newPassword

`string`

Valid new password

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:345](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L345)

***

### changeAccountPasswordAdmin()

> **changeAccountPasswordAdmin**(`username`, `adminUsername`, `adminPassword`, `newPassword`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`FORBIDDEN`](../enumerations/DatabaseOpCode.md#forbidden) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Change the password of an account using an administartor account with permissions [AdminPerms.MANAGE_ACCOUNTS](../enumerations/AdminPerms.md#manage_accounts) **Does not validate credentials**.
If successful, the `recoverypass` field is rotated to a new random string.
*Note: Requires password of admin with sufficient permissions to delete to avoid accidental locking of accounts.*

#### Parameters

##### username

`string`

Valid username

##### adminUsername

`string`

Valid admin username

##### adminPassword

`string`

Valid admin password

##### newPassword

`string`

Valid new password

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`FORBIDDEN`](../enumerations/DatabaseOpCode.md#forbidden) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:405](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L405)

***

### changeAccountPasswordToken()

> **changeAccountPasswordToken**(`username`, `token`, `newPassword`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Change the password of an account using the alternative rotating password. Requires that the alternative rotating password is correct. **Does not validate credentials**.
If successful, the `recoverypass` field is rotated to a new random string.

#### Parameters

##### username

`string`

Valid username

##### token

`string`

Alternative rotating password

##### newPassword

`string`

Valid new password

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:372](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L372)

***

### checkAccount()

> **checkAccount**(`username`, `password`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Check credentials against an existing account. **Does not validate credentials**.
If successful, the `recoverypass` field is rotated to a new random string.

#### Parameters

##### username

`string`

Valid username

##### password

`string`

Valid password

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Check status

#### Defined in

[database.ts:241](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L241)

***

### clearCache()

> **clearCache**(): `void`

Clears all database account, team, admin, contest, round, problem, and submission cache entries.

#### Returns

`void`

#### Defined in

[database.ts:1530](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1530)

***

### connect()

> **connect**(): `Promise`\<`void`\>

Connect to the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` resolving when the database has connected

#### Defined in

[database.ts:73](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L73)

***

### createAccount()

> **createAccount**(`username`, `password`, `userData`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`CONFLICT`](../enumerations/DatabaseOpCode.md#conflict) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Create an account. **Does not validate credentials**.

#### Parameters

##### username

`string`

Valid username

##### password

`string`

Valid password

##### userData

`Omit`\<[`AccountData`](../type-aliases/AccountData.md), `"username"` \| `"displayName"` \| `"profileImage"` \| `"bio"` \| `"pastRegistrations"` \| `"team"`\>

Initial user data

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`CONFLICT`](../enumerations/DatabaseOpCode.md#conflict) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Creation status

#### Defined in

[database.ts:201](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L201)

***

### createTeam()

> **createTeam**(`name`?): `Promise`\<`number`\>

Create a team.

#### Parameters

##### name?

`string`

Name of team (optional, default 'Team')

#### Returns

`Promise`\<`number`\>

Newly created team's ID, or an error code

#### Defined in

[database.ts:523](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L523)

***

### deleteAccount()

> **deleteAccount**(`username`, `password`, `adminUsername`?): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`FORBIDDEN`](../enumerations/DatabaseOpCode.md#forbidden) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete an account. Allows deletion by users and admins with permission level [AdminPerms.MANAGE_ACCOUNTS](../enumerations/AdminPerms.md#manage_accounts) if `adminUsername` is given. **Does not validate credentials**.
*Note: Requires password or admin username and password with sufficient permissions to delete to avoid accidental deletion of accounts.*

#### Parameters

##### username

`string`

Valid username

##### password

`string`

Valid user password, or admin password if `adminUsername` is given

##### adminUsername?

`string`

Valid username of administrator

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`UNAUTHORIZED`](../enumerations/DatabaseOpCode.md#unauthorized) \| [`FORBIDDEN`](../enumerations/DatabaseOpCode.md#forbidden) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status ([DatabaseOpCode.FORBIDDEN](../enumerations/DatabaseOpCode.md#forbidden) is returned when an admin has insufficient permissions)

#### Defined in

[database.ts:480](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L480)

***

### deleteContest()

> **deleteContest**(`id`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete a contest from the contests table.

#### Parameters

##### id

`string`

Contest to delete

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status

#### Defined in

[database.ts:1059](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1059)

***

### deleteProblem()

> **deleteProblem**(`id`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete a problem from the problems table.

#### Parameters

##### id

`string`

Problem to delete

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status

#### Defined in

[database.ts:1325](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1325)

***

### deleteRound()

> **deleteRound**(`id`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete a round from the round table.

#### Parameters

##### id

`string`

Round to delete

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status

#### Defined in

[database.ts:1187](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1187)

***

### deleteSubmission()

> **deleteSubmission**(`id`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete a submission from the submission table.

#### Parameters

##### id

`string`

ID of submission to delete

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status

#### Defined in

[database.ts:1512](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1512)

***

### deleteTeam()

> **deleteTeam**(`team`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete a team and remove all members from it.

#### Parameters

##### team

`number`

Team ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status

#### Defined in

[database.ts:778](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L778)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` resolving when the database has disconnected

#### Defined in

[database.ts:92](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L92)

***

### finishContest()

> **finishContest**(`contest`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Moves all instances of a contest from upcoming registrations of every team to the past registrations of every member.

#### Parameters

##### contest

`string`

Contest ID to mark as completed

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

status

#### Defined in

[database.ts:800](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L800)

***

### getAccountData()

> **getAccountData**(`username`): `Promise`\<[`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`AccountData`](../type-aliases/AccountData.md)\>

Get user data for an account. Registrations are fetched through team alias. **Does not validate credentials**.

#### Parameters

##### username

`string`

Valid username

#### Returns

`Promise`\<[`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`AccountData`](../type-aliases/AccountData.md)\>

AccountData or an error code

#### Defined in

[database.ts:265](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L265)

***

### getAccountList()

> **getAccountList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all account usernames that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of account usernames, or DatabaseOpCode.ERROR if an error occurred

#### Defined in

[database.ts:182](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L182)

***

### getAccountTeam()

> **getAccountTeam**(`username`): `Promise`\<`null` \| `number`\>

Get the id of a user's team (the team creator's username). **Does not validate credentials**.

#### Parameters

##### username

`string`

Valid username

#### Returns

`Promise`\<`null` \| `number`\>

Team ID, null if not on a team, or an error code

#### Defined in

[database.ts:562](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L562)

***

### getAdminList()

> **getAdminList**(): `Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| `object`[]\>

Get a list of all administrators and their boolean permission flags.

#### Returns

`Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| `object`[]\>

Paired usernames and permissions, or an error code

#### Defined in

[database.ts:898](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L898)

***

### getAllRegisteredTeams()

> **getAllRegisteredTeams**(`contest`): `Promise`\<`number`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Get a list of all teams that are registered for a contest.

#### Parameters

##### contest

`string`

Contest ID

#### Returns

`Promise`\<`number`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Array of team IDs with registrations for the contest, or an error code

#### Defined in

[database.ts:853](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L853)

***

### getAllRegisteredUsers()

> **getAllRegisteredUsers**(`contest`): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Get a list of all users that are registered for a contest.

#### Parameters

##### contest

`string`

Contest ID

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Array of usernames with registrations for the contest, or an error code

#### Defined in

[database.ts:834](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L834)

***

### getContestList()

> **getContestList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all contest IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of contest IDs, or an error code

#### Defined in

[database.ts:951](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L951)

***

### getProblemList()

> **getProblemList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all problem IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of problem IDs, or an error code

#### Defined in

[database.ts:1207](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1207)

***

### getRecoveryPassword()

> **getRecoveryPassword**(`username`): `Promise`\<`string` \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Get the alternative rotating password for an account. **Does not validate credentials**

#### Parameters

##### username

`string`

Valid username

#### Returns

`Promise`\<`string` \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Fetch status

#### Defined in

[database.ts:433](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L433)

***

### getRoundList()

> **getRoundList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all round IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of round IDs, or an error code

#### Defined in

[database.ts:1079](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1079)

***

### getSubmissionList()

> **getSubmissionList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all submission UUIDs. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of submission UUIDs, or an error code

#### Defined in

[database.ts:1345](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1345)

***

### getTeamData()

> **getTeamData**(`team`): `Promise`\<[`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`TeamData`](../type-aliases/TeamData.md)\>

Get the team data for a team.

#### Parameters

##### team

`number`

Team ID

#### Returns

`Promise`\<[`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`TeamData`](../type-aliases/TeamData.md)\>

Team data or an error code

#### Defined in

[database.ts:627](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L627)

***

### hasAdminPerms()

> **hasAdminPerms**(`username`, `flag`): `Promise`\<`boolean` \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Check if an administrator has a certain permission.

#### Parameters

##### username

`string`

Valid administrator username

##### flag

[`AdminPerms`](../enumerations/AdminPerms.md)

Permission flag to check against

#### Returns

`Promise`\<`boolean` \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

If the administrator has the permission, or an error code

#### Defined in

[database.ts:875](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L875)

***

### purgeOldSubmissions()

> **purgeOldSubmissions**(`username`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete all but the newest [config.maxSubmissionHistory](../../config/interfaces/GlobalConfiguration.md#maxsubmissionhistory) submissions for a user. Does not check user exists.

#### Parameters

##### username

`string`

Username to remove submissions from

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status

#### Defined in

[database.ts:1493](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1493)

***

### readContests()

> **readContests**(`c`): `Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Contest`](../type-aliases/Contest.md)[]\>

Filter and get a list of contest data from the contests table according to a criteria.

#### Parameters

##### c

[`ReadContestsCriteria`](../type-aliases/ReadContestsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Contest`](../type-aliases/Contest.md)[]\>

Array of contest data matching the filter criteria, or an error code

#### Defined in

[database.ts:968](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L968)

***

### readProblems()

> **readProblems**(`c`): `Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Problem`](../type-aliases/Problem.md)[]\>

Filter and get a list of problems from the problems table according to a criteria.

#### Parameters

##### c

[`ReadProblemsCriteria`](../type-aliases/ReadProblemsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Problem`](../type-aliases/Problem.md)[]\>

Array of problems matching the filter criteria, or an error code

#### Defined in

[database.ts:1224](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1224)

***

### readRounds()

> **readRounds**(`c`): `Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Round`](../type-aliases/Round.md)[]\>

Filter and get a list of round data from the rounds table according to a criteria.

#### Parameters

##### c

[`ReadRoundsCriteria`](../type-aliases/ReadRoundsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Round`](../type-aliases/Round.md)[]\>

Array of round data matching the filter criteria, or an error code

#### Defined in

[database.ts:1096](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1096)

***

### readSubmissions()

> **readSubmissions**(`c`): `Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Submission`](../type-aliases/Submission.md)[]\>

Filter and get a list of submissions from the submissions table according to a criteria.

#### Parameters

##### c

[`ReadSubmissionsCriteria`](../type-aliases/ReadSubmissionsCriteria.md) = `{}`

Filter criteria. Leaving one undefined removes the criteria

#### Returns

`Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`Submission`](../type-aliases/Submission.md)[]\>

Array of submissions matching the filter criteria, or an error code

#### Defined in

[database.ts:1362](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1362)

***

### registerContest()

> **registerContest**(`team`, `contest`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`CONFLICT`](../enumerations/DatabaseOpCode.md#conflict) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Register a team for a contest, registering all users on that team as well. Prevents duplicate registrations.
**Does not prevent registering a team that is too large or registering in conflict with existing registrations.**

#### Parameters

##### team

`number`

Team ID

##### contest

`string`

Contest ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`CONFLICT`](../enumerations/DatabaseOpCode.md#conflict) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Registration status

#### Defined in

[database.ts:696](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L696)

***

### rotateRecoveryPassword()

> **rotateRecoveryPassword**(`username`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Rotates the recovery password of an account to a new random string.

#### Parameters

##### username

`string`

Username to rotate

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Rotation status

#### Defined in

[database.ts:456](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L456)

***

### setAccountTeam()

> **setAccountTeam**(`username`, `team`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Change the team of a user. Since registrations are stored by team, this will change the user's registrations. **Does not validate credentials**.

#### Parameters

##### username

`string`

Valid username

##### team

`null` | `number`

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:582](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L582)

***

### setAdminPerms()

> **setAdminPerms**(`username`, `permissions`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Set the permission bit flags of an administrator, or add a new administrator. If permissions bit 0 is false (not admin), the administrator is removed.

#### Parameters

##### username

`string`

Valid username

##### permissions

`number`

Permission flags, as a number (boolean OR)

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write status

#### Defined in

[database.ts:922](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L922)

***

### unregisterAllContests()

> **unregisterAllContests**(`team`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Unregister an entire team for all contests.

#### Parameters

##### team

`number`

Team ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Registration status

#### Defined in

[database.ts:758](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L758)

***

### unregisterContest()

> **unregisterContest**(`team`, `contest`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Unregister a team for a contest.

#### Parameters

##### team

`number`

Team ID

##### contest

`string`

Contest ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Registration status

#### Defined in

[database.ts:727](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L727)

***

### updateAccountData()

> **updateAccountData**(`username`, `userData`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Overwrite user data for an existing account. Cannot be used to update "email", "pastRegistrations", or "team". **Does not validate credentials**.

#### Parameters

##### username

`string`

Valid username

##### userData

`Omit`\<[`AccountData`](../type-aliases/AccountData.md), `"username"` \| `"pastRegistrations"` \| `"team"` \| `"email"`\>

New data

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:312](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L312)

***

### updateTeamData()

> **updateTeamData**(`team`, `teamData`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update the team data for an existing team. Cannot be used to update "members", "registrations", or "joinKey".

#### Parameters

##### team

`number`

Team ID

##### teamData

`Omit`\<[`TeamData`](../type-aliases/TeamData.md), `"id"` \| `"members"` \| `"registrations"` \| `"joinKey"`\>

New data

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:667](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L667)

***

### writeContest()

> **writeContest**(`contest`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write a contest to the contests table.

#### Parameters

##### contest

[`Contest`](../type-aliases/Contest.md)

Contest to write

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write status

#### Defined in

[database.ts:1036](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1036)

***

### writeProblem()

> **writeProblem**(`problem`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write a problem to the problems table.

#### Parameters

##### problem

[`Problem`](../type-aliases/Problem.md)

Problem to write

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write status

#### Defined in

[database.ts:1302](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1302)

***

### writeRound()

> **writeRound**(`round`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write a round to the rounds table.

#### Parameters

##### round

[`Round`](../type-aliases/Round.md)

Round to write

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write status

#### Defined in

[database.ts:1164](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1164)

***

### writeSubmission()

> **writeSubmission**(`submission`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write a submission to the submissions table. Will only overwrite scores for existing submissions.

#### Parameters

##### submission

[`Submission`](../type-aliases/Submission.md)

Submission to write

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Write status

#### Defined in

[database.ts:1459](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1459)

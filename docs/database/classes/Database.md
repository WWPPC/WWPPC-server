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

[database.ts:39](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L39)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[database.ts:33](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L33)

***

### teamJoinKeyLength

> `readonly` `static` **teamJoinKeyLength**: `6` = `6`

Length of team join keys (changing this will break existing teams!)

#### Defined in

[database.ts:29](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L29)

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

[database.ts:343](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L343)

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

[database.ts:403](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L403)

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

[database.ts:370](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L370)

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

[database.ts:239](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L239)

***

### clearCache()

> **clearCache**(): `void`

Clears all database account, team, admin, contest, round, problem, and submission cache entries.

#### Returns

`void`

#### Defined in

[database.ts:1526](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1526)

***

### connect()

> **connect**(): `Promise`\<`void`\>

Connect to the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` resolving when the database has connected

#### Defined in

[database.ts:71](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L71)

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

[database.ts:199](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L199)

***

### createTeam()

> **createTeam**(`name`?): `Promise`\<`string` \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Create a team.

#### Parameters

##### name?

`string`

Name of team (optional, default 'Team')

#### Returns

`Promise`\<`string` \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Newly created team's ID, or an error code

#### Defined in

[database.ts:521](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L521)

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

[database.ts:478](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L478)

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

[database.ts:1055](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1055)

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

[database.ts:1321](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1321)

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

[database.ts:1183](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1183)

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

[database.ts:1508](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1508)

***

### deleteTeam()

> **deleteTeam**(`team`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Delete a team and remove all members from it.

#### Parameters

##### team

`string`

Team ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Deletion status

#### Defined in

[database.ts:774](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L774)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Disconnect from the PostgreSQL database.

#### Returns

`Promise`\<`void`\>

A `Promise` resolving when the database has disconnected

#### Defined in

[database.ts:90](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L90)

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

[database.ts:798](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L798)

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

[database.ts:263](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L263)

***

### getAccountList()

> **getAccountList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all account usernames that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of account usernames, or DatabaseOpCode.ERROR if an error occurred

#### Defined in

[database.ts:180](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L180)

***

### getAccountTeam()

> **getAccountTeam**(`username`): `Promise`\<`null` \| `string` \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Get the id of a user's team (the team creator's username). **Does not validate credentials**.

#### Parameters

##### username

`string`

Valid username

#### Returns

`Promise`\<`null` \| `string` \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Team ID, null if not on a team, or an error code

#### Defined in

[database.ts:560](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L560)

***

### getAdminList()

> **getAdminList**(): `Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| `object`[]\>

Get a list of all administrators and their boolean permission flags.

#### Returns

`Promise`\<[`ERROR`](../enumerations/DatabaseOpCode.md#error) \| `object`[]\>

Paired usernames and permissions, or an error code

#### Defined in

[database.ts:896](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L896)

***

### getAllRegisteredTeams()

> **getAllRegisteredTeams**(`contest`): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Get a list of all teams that are registered for a contest.

#### Parameters

##### contest

`string`

Contest ID

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Array of team IDs with registrations for the contest, or an error code

#### Defined in

[database.ts:851](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L851)

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

[database.ts:832](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L832)

***

### getContestList()

> **getContestList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all contest IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of contest IDs, or an error code

#### Defined in

[database.ts:949](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L949)

***

### getProblemList()

> **getProblemList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all problem IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of problem IDs, or an error code

#### Defined in

[database.ts:1203](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1203)

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

[database.ts:431](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L431)

***

### getRoundList()

> **getRoundList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all round IDs that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of round IDs, or an error code

#### Defined in

[database.ts:1075](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1075)

***

### getSubmissionList()

> **getSubmissionList**(): `Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Read a list of all submission ID strings, created from problem ID, username, and analysis mode, like `problemId:username:analysis` that exist. Bypasses cache.

#### Returns

`Promise`\<`string`[] \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

List of submission ID strings, or an error code

#### Defined in

[database.ts:1341](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1341)

***

### getTeamData()

> **getTeamData**(`team`): `Promise`\<[`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`TeamData`](../type-aliases/TeamData.md)\>

Get the team data for a team.

#### Parameters

##### team

`string`

Team ID

#### Returns

`Promise`\<[`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error) \| [`TeamData`](../type-aliases/TeamData.md)\>

Team data or an error code

#### Defined in

[database.ts:613](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L613)

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

[database.ts:873](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L873)

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

[database.ts:1489](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1489)

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

[database.ts:966](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L966)

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

[database.ts:1220](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1220)

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

[database.ts:1092](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1092)

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

[database.ts:1358](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1358)

***

### registerContest()

> **registerContest**(`team`, `contest`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`CONFLICT`](../enumerations/DatabaseOpCode.md#conflict) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Register a team for a contest, registering all users on that team as well. Prevents duplicate registrations.
**Does not prevent registering a team that is too large or registering in conflict with existing registrations.**

#### Parameters

##### team

`string`

Team ID

##### contest

`string`

Contest ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`CONFLICT`](../enumerations/DatabaseOpCode.md#conflict) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Registration status

#### Defined in

[database.ts:686](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L686)

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

[database.ts:454](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L454)

***

### setAccountTeam()

> **setAccountTeam**(`username`, `team`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Change the team of a user. Since registrations are stored by team, this will change the user's registrations. **Does not validate credentials**.

#### Parameters

##### username

`string`

Valid username

##### team

`null` | `string`

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:580](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L580)

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

[database.ts:920](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L920)

***

### unregisterAllContests()

> **unregisterAllContests**(`team`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Unregister an entire team for all contests.

#### Parameters

##### team

`string`

Team ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Registration status

#### Defined in

[database.ts:752](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L752)

***

### unregisterContest()

> **unregisterContest**(`team`, `contest`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Unregister a team for a contest.

#### Parameters

##### team

`string`

Team ID

##### contest

`string`

Contest ID

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Registration status

#### Defined in

[database.ts:719](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L719)

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

[database.ts:310](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L310)

***

### updateTeamData()

> **updateTeamData**(`team`, `teamData`): `Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update the team data for an existing team. Cannot be used to update "members", "registrations", or "joinKey".

#### Parameters

##### team

`string`

Team ID

##### teamData

`Omit`\<[`TeamData`](../type-aliases/TeamData.md), `"id"` \| `"members"` \| `"registrations"` \| `"joinKey"`\>

New data

#### Returns

`Promise`\<[`SUCCESS`](../enumerations/DatabaseOpCode.md#success) \| [`NOT_FOUND`](../enumerations/DatabaseOpCode.md#not_found) \| [`ERROR`](../enumerations/DatabaseOpCode.md#error)\>

Update status

#### Defined in

[database.ts:655](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L655)

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

[database.ts:1032](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1032)

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

[database.ts:1298](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1298)

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

[database.ts:1160](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1160)

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

[database.ts:1455](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/database.ts#L1455)

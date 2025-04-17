[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestHost

# Class: ContestHost

Module of [ContestManager](ContestManager.md) containing hosting for individual contests, including handling submissions.
Communication with clients is handled through ContestManager.

## Constructors

### new ContestHost()

> **new ContestHost**(`type`, `id`, `db`, `grader`, `logger`): [`ContestHost`](ContestHost.md)

#### Parameters

##### type

`string`

Contest type ID

##### id

`string`

Contest ID of contest

##### db

[`Database`](../../database/classes/Database.md)

Database connection

##### grader

[`Grader`](../../grader/classes/Grader.md)

Grader management instance to use for grading

##### logger

[`Logger`](../../log/classes/Logger.md)

Logger instance

#### Returns

[`ContestHost`](ContestHost.md)

#### Defined in

[contest.ts:500](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L500)

## Properties

### contestConfig

> `readonly` **contestConfig**: [`ContestConfiguration`](../../config/interfaces/ContestConfiguration.md)

#### Defined in

[contest.ts:467](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L467)

***

### contestType

> `readonly` **contestType**: `string`

#### Defined in

[contest.ts:466](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L466)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[contest.ts:469](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L469)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[contest.ts:470](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L470)

***

### id

> `readonly` **id**: `string`

#### Defined in

[contest.ts:468](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L468)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[contest.ts:472](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L472)

***

### off()

> **off**: \<`TEvent`\>(`ev`, `cb`) => `void`

Remove an event listener.

Remove an existing listener for an event. (Alias of `removeListener`)

#### Type Parameters

• **TEvent** *extends* `"data"` \| `"end"` \| `"scoreboards"` \| `"submissionUpdate"`

#### Parameters

##### ev

`TEvent`

Event name

##### cb

(...`args`) => `any`

Callback function

#### Returns

`void`

#### Param

Event name

#### Param

Callback function

#### Defined in

[contest.ts:854](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L854)

***

### on()

> **on**: \<`TEvent`\>(`ev`, `cb`) => `void`

Add an event listener.

Add a listener for an event. (Alias of `addListener`)

#### Type Parameters

• **TEvent** *extends* `"data"` \| `"end"` \| `"scoreboards"` \| `"submissionUpdate"`

#### Parameters

##### ev

`TEvent`

Event name

##### cb

(...`args`) => `any`

Callback function

#### Returns

`void`

#### Param

Event name

#### Param

Callback function

#### Defined in

[contest.ts:848](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L848)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Defined in

[contest.ts:471](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L471)

## Accessors

### clientScoreboards

#### Get Signature

> **get** **clientScoreboards**(): `Map`\<`number`, [`TeamScore`](../../scorer/type-aliases/TeamScore.md)\>

Get current scoreboard for clients, which could be "frozen"

##### Returns

`Map`\<`number`, [`TeamScore`](../../scorer/type-aliases/TeamScore.md)\>

#### Defined in

[contest.ts:686](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L686)

***

### contestData

#### Get Signature

> **get** **contestData**(): [`ClientContest`](../../api/type-aliases/ClientContest.md)

The current contest data, in client format.

##### Returns

[`ClientContest`](../../api/type-aliases/ClientContest.md)

#### Defined in

[contest.ts:692](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L692)

***

### round

#### Get Signature

> **get** **round**(): `number`

Index of the current round (zero-indexed).

##### Returns

`number`

#### Defined in

[contest.ts:698](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L698)

***

### scoreboards

#### Get Signature

> **get** **scoreboards**(): `Map`\<`number`, [`TeamScore`](../../scorer/type-aliases/TeamScore.md)\>

Get current scoreboard

##### Returns

`Map`\<`number`, [`TeamScore`](../../scorer/type-aliases/TeamScore.md)\>

#### Defined in

[contest.ts:680](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L680)

## Methods

### calculateCompletionState()

> **calculateCompletionState**(`submission`?): [`ClientProblemCompletionState`](../../api/enumerations/ClientProblemCompletionState.md)

Get the completion state to be displayed by the client for a given submission.

#### Parameters

##### submission?

[`Submission`](../../database/type-aliases/Submission.md)

Submission to assign completion state to

#### Returns

[`ClientProblemCompletionState`](../../api/enumerations/ClientProblemCompletionState.md)

Completion state of submission

#### Defined in

[contest.ts:861](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L861)

***

### containsProblem()

> **containsProblem**(`id`): `boolean`

Check if a given problem is within this contest.

#### Parameters

##### id

`string`

Problem ID

#### Returns

`boolean`

If the problem is in the contest

#### Defined in

[contest.ts:748](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L748)

***

### end()

> **end**(`complete`): `void`

Stop the running contest and remove all users.

#### Parameters

##### complete

`boolean` = `false`

Mark the contest as ended in database (contest cannot be restarted)

#### Returns

`void`

#### Defined in

[contest.ts:882](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L882)

***

### getProblemId()

> **getProblemId**(`round`, `problem`): `undefined` \| `string`

Get the problem UUID by the round and number.

#### Parameters

##### round

`number`

Round number

##### problem

`number`

Problem number

#### Returns

`undefined` \| `string`

Problem UUID, or undefined if the round/problem does not exist

#### Defined in

[contest.ts:728](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L728)

***

### getProblemRoundAndNumber()

> **getProblemRoundAndNumber**(`id`): [`number`, `number`] \| [`undefined`, `undefined`]

Get the problem round and problem number by the problem UUID.

#### Parameters

##### id

`string`

Problem ID

#### Returns

[`number`, `number`] \| [`undefined`, `undefined`]

Problem [round, number], or undefined if the problem is not in the contest

#### Defined in

[contest.ts:736](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L736)

***

### getTimeRange()

> **getTimeRange**(`round`?): `number` \| `number`[] \| \{`op`: `">"` \| `"<"` \| `">="` \| `"<="`;`v`: `number`; \} \| \{`op`: `"><"` \| `"<>"` \| `"=><"` \| `"><="` \| `"=><="` \| `"=<>"` \| `"<>="` \| `"=<>="`;`v1`: `number`;`v2`: `number`; \} \| \{`op`: `"="` \| `"!"`;`v`: `number` \| `number`[]; \}

Get a [FilterComparison](../../util/type-aliases/FilterComparison.md) for the time range of the entire contest or a specific round.

#### Parameters

##### round?

`number`

Round number, if `undefined` entire contest

#### Returns

`number` \| `number`[] \| \{`op`: `">"` \| `"<"` \| `">="` \| `"<="`;`v`: `number`; \} \| \{`op`: `"><"` \| `"<>"` \| `"=><"` \| `"><="` \| `"=><="` \| `"=<>"` \| `"<>="` \| `"=<>="`;`v1`: `number`;`v2`: `number`; \} \| \{`op`: `"="` \| `"!"`;`v`: `number` \| `number`[]; \}

`FilterComparison` for time range, or `-1` if an invalid round number supplied

#### Defined in

[contest.ts:706](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L706)

***

### problemSubmittable()

> **problemSubmittable**(`id`): `boolean`

Get if a particular problem ID is submittable.
Submissions for all rounds close in between rounds, regardless of [ContestConfiguration.restrictiveRounds](../../config/interfaces/ContestConfiguration.md#restrictiverounds).

#### Parameters

##### id

`string`

Problem ID

#### Returns

`boolean`

If the problem is in the contest and submittable

#### Defined in

[contest.ts:757](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L757)

***

### processSubmission()

> **processSubmission**(`submission`): `Promise`\<[`DatabaseOpCode`](../../database/enumerations/DatabaseOpCode.md)\>

Submit a solution to the contest. Will automatically grade and associate the submission with the correct team.

#### Parameters

##### submission

[`Submission`](../../database/type-aliases/Submission.md)

Submission

#### Returns

`Promise`\<[`DatabaseOpCode`](../../database/enumerations/DatabaseOpCode.md)\>

Status code

#### Defined in

[contest.ts:770](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L770)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:529](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/contest.ts#L529)

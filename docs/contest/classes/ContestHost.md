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

[contest.ts:463](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L463)

## Properties

### contestConfig

> `readonly` **contestConfig**: [`ContestConfiguration`](../../config/interfaces/ContestConfiguration.md)

#### Defined in

[contest.ts:430](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L430)

***

### contestType

> `readonly` **contestType**: `string`

#### Defined in

[contest.ts:429](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L429)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[contest.ts:432](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L432)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[contest.ts:433](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L433)

***

### id

> `readonly` **id**: `string`

#### Defined in

[contest.ts:431](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L431)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[contest.ts:435](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L435)

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

[contest.ts:794](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L794)

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

[contest.ts:788](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L788)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Defined in

[contest.ts:434](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L434)

## Accessors

### clientScoreboards

#### Get Signature

> **get** **clientScoreboards**(): `Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

Get current scoreboard for clients, which could be "frozen"

##### Returns

`Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

#### Defined in

[contest.ts:626](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L626)

***

### contestData

#### Get Signature

> **get** **contestData**(): [`ClientContest`](../../api/type-aliases/ClientContest.md)

The current contest data, in client format.

##### Returns

[`ClientContest`](../../api/type-aliases/ClientContest.md)

#### Defined in

[contest.ts:632](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L632)

***

### round

#### Get Signature

> **get** **round**(): `number`

Index of the current round (zero-indexed).

##### Returns

`number`

#### Defined in

[contest.ts:638](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L638)

***

### scoreboards

#### Get Signature

> **get** **scoreboards**(): `Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

Get current scoreboard

##### Returns

`Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

#### Defined in

[contest.ts:620](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L620)

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

[contest.ts:801](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L801)

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

[contest.ts:688](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L688)

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

[contest.ts:822](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L822)

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

[contest.ts:668](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L668)

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

[contest.ts:676](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L676)

***

### getTimeRange()

> **getTimeRange**(`round`?): `number` \| `number`[] \| \{`op`: `"="` \| `"!"`;`v`: `number` \| `number`[]; \} \| \{`op`: `">"` \| `"<"` \| `">="` \| `"<="`;`v`: `number`; \} \| \{`op`: `"><"` \| `"<>"` \| `"=><"` \| `"><="` \| `"=><="` \| `"=<>"` \| `"<>="` \| `"=<>="`;`v1`: `number`;`v2`: `number`; \} \| \{`op`: `"~"`;`v`: `never`; \}

Get a [FilterComparison](../../util/type-aliases/FilterComparison.md) for the time range of the entire contest or a specific round.

#### Parameters

##### round?

`number`

Round number, if `undefined` entire contest

#### Returns

`number` \| `number`[] \| \{`op`: `"="` \| `"!"`;`v`: `number` \| `number`[]; \} \| \{`op`: `">"` \| `"<"` \| `">="` \| `"<="`;`v`: `number`; \} \| \{`op`: `"><"` \| `"<>"` \| `"=><"` \| `"><="` \| `"=><="` \| `"=<>"` \| `"<>="` \| `"=<>="`;`v1`: `number`;`v2`: `number`; \} \| \{`op`: `"~"`;`v`: `never`; \}

`FilterComparison` for time range, or `-1` if an invalid round number supplied

#### Defined in

[contest.ts:646](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L646)

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

[contest.ts:697](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L697)

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

[contest.ts:710](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L710)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:492](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/contest.ts#L492)

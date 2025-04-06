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

[contest.ts:476](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L476)

## Properties

### contestConfig

> `readonly` **contestConfig**: [`ContestConfiguration`](../../config/interfaces/ContestConfiguration.md)

#### Defined in

[contest.ts:443](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L443)

***

### contestType

> `readonly` **contestType**: `string`

#### Defined in

[contest.ts:442](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L442)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[contest.ts:445](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L445)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[contest.ts:446](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L446)

***

### id

> `readonly` **id**: `string`

#### Defined in

[contest.ts:444](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L444)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[contest.ts:448](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L448)

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

[contest.ts:806](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L806)

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

[contest.ts:798](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L798)

***

### pendingDirectSubmissions

> `readonly` **pendingDirectSubmissions**: `Map`\<`string`, `Timeout`\>

#### Defined in

[contest.ts:713](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L713)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Defined in

[contest.ts:447](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L447)

## Accessors

### clientScoreboards

#### Get Signature

> **get** **clientScoreboards**(): `Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

Get (never frozen) scoreboards

##### Returns

`Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

#### Defined in

[contest.ts:639](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L639)

***

### contestData

#### Get Signature

> **get** **contestData**(): [`ClientContest`](../../api/type-aliases/ClientContest.md)

The current contest data, in client format.

##### Returns

[`ClientContest`](../../api/type-aliases/ClientContest.md)

#### Defined in

[contest.ts:645](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L645)

***

### round

#### Get Signature

> **get** **round**(): `number`

Index of the current round (zero-indexed).

##### Returns

`number`

#### Defined in

[contest.ts:651](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L651)

***

### scoreboards

#### Get Signature

> **get** **scoreboards**(): `Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

Get (possibly frozen) scoreboards

##### Returns

`Map`\<`string`, [`UserScore`](../../scorer/type-aliases/UserScore.md)\>

#### Defined in

[contest.ts:633](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L633)

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

[contest.ts:815](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L815)

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

[contest.ts:701](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L701)

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

[contest.ts:836](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L836)

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

[contest.ts:681](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L681)

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

[contest.ts:689](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L689)

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

[contest.ts:659](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L659)

***

### problemSubmittable()

> **problemSubmittable**(`id`): `boolean`

Get if a particular problem ID is submittable.

#### Parameters

##### id

`string`

Problem ID

#### Returns

`boolean`

If the problem is in the contest and submittable

#### Defined in

[contest.ts:709](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L709)

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

[contest.ts:720](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L720)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:505](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/contest.ts#L505)

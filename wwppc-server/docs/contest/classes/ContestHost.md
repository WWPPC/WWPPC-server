[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestHost

# Class: ContestHost

Module of `ContestManager` containing hosting for individual contests, including handling submissions.

## Constructors

### new ContestHost()

> **new ContestHost**(`id`, `io`, `db`, `grader`, `logger`): [`ContestHost`](ContestHost.md)

#### Parameters

• **id**: `string`

Contest id of contest

• **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

Socket.IO server to use for client broadcasting

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **grader**: [`Grader`](../../grader/classes/Grader.md)

Grader management instance to use for grading

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`ContestHost`](ContestHost.md)

#### Source

[src/contest.ts:290](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L290)

## Properties

### #active

> `private` **#active**: `boolean` = `false`

#### Source

[src/contest.ts:276](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L276)

***

### #data

> `private` **#data**: [`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:274](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L274)

***

### #endListeners

> `private` **#endListeners**: `Set`\<() => `any`\>

#### Source

[src/contest.ts:628](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L628)

***

### #ended

> `private` **#ended**: `boolean` = `false`

#### Source

[src/contest.ts:277](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L277)

***

### #index

> `private` **#index**: `number` = `0`

#### Source

[src/contest.ts:275](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L275)

***

### #sid

> `private` `readonly` **#sid**: `string`

#### Source

[src/contest.ts:278](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L278)

***

### #updateLoop

> `private` **#updateLoop**: `undefined` \| `Timeout` = `undefined`

#### Source

[src/contest.ts:279](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L279)

***

### #users

> `private` `readonly` **#users**: `Map`\<`string`, `Set`\<`ServerSocket`\>\>

#### Source

[src/contest.ts:281](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L281)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/contest.ts:270](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L270)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/contest.ts:271](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L271)

***

### id

> `readonly` **id**: `string`

#### Source

[src/contest.ts:268](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L268)

***

### io

> `readonly` **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Source

[src/contest.ts:269](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L269)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/contest.ts:273](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L273)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Source

[src/contest.ts:272](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L272)

## Accessors

### data

> `get` **data**(): [`ContestContest`](../interfaces/ContestContest.md)

Get a copy of the internal data.

#### Returns

[`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:310](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L310)

***

### round

> `get` **round**(): `number`

Index of the current round (zero-indexed).

#### Returns

`number`

#### Source

[src/contest.ts:431](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L431)

## Methods

### #getCompletionState()

> `private` **#getCompletionState**(`round`, `scores`): [`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Parameters

• **round**: `number`

• **scores**: `undefined` \| [`Score`](../../database/interfaces/Score.md)[]

#### Returns

[`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Source

[src/contest.ts:522](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L522)

***

### addSocket()

> **addSocket**(`s`): `void`

Add a username-linked SocketIO connection to the user list.

#### Parameters

• **s**: `ServerSocket`

SocketIO connection (with modifications)

#### Returns

`void`

#### Source

[src/contest.ts:538](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L538)

***

### end()

> **end**(`complete`?): `void`

#### Parameters

• **complete?**: `boolean`

#### Returns

`void`

#### Source

[src/contest.ts:629](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L629)

***

### onended()

> **onended**(`cb`): `void`

#### Parameters

• **cb**

#### Returns

`void`

#### Source

[src/contest.ts:639](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L639)

***

### problemSubmittable()

> **problemSubmittable**(`id`): `boolean`

Get if a particular problem ID is submittable.

#### Parameters

• **id**: `string`

Problem ID

#### Returns

`boolean`

#### Source

[src/contest.ts:439](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L439)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:317](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L317)

***

### removeSocket()

> **removeSocket**(`socket`): `boolean`

#### Parameters

• **socket**: `ServerSocket`

#### Returns

`boolean`

#### Source

[src/contest.ts:617](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L617)

***

### updateAllUsers()

> **updateAllUsers**(): `Promise`\<`void`\>

Update all users in contest with latest contest data.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:445](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L445)

***

### updateUser()

> **updateUser**(`username`): `Promise`\<`void`\>

Only update users under a team with the latest contest data.

#### Parameters

• **username**: `string`

Username

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:452](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/contest.ts#L452)

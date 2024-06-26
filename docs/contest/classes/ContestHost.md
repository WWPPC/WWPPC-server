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

[src/contest.ts:297](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L297)

## Properties

### #active

> `private` **#active**: `boolean` = `false`

#### Source

[src/contest.ts:283](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L283)

***

### #data

> `private` **#data**: [`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:281](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L281)

***

### #endListeners

> `private` **#endListeners**: `Set`\<() => `any`\>

#### Source

[src/contest.ts:655](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L655)

***

### #ended

> `private` **#ended**: `boolean` = `false`

#### Source

[src/contest.ts:284](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L284)

***

### #index

> `private` **#index**: `number` = `0`

#### Source

[src/contest.ts:282](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L282)

***

### #sid

> `private` `readonly` **#sid**: `string`

#### Source

[src/contest.ts:285](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L285)

***

### #updateLoop

> `private` **#updateLoop**: `undefined` \| `Timeout` = `undefined`

#### Source

[src/contest.ts:286](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L286)

***

### #users

> `private` `readonly` **#users**: `Map`\<`string`, `Set`\<`ServerSocket`\>\>

#### Source

[src/contest.ts:288](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L288)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/contest.ts:277](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L277)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/contest.ts:278](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L278)

***

### id

> `readonly` **id**: `string`

#### Source

[src/contest.ts:275](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L275)

***

### io

> `readonly` **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Source

[src/contest.ts:276](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L276)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/contest.ts:280](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L280)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Source

[src/contest.ts:279](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L279)

## Accessors

### data

> `get` **data**(): [`ContestContest`](../interfaces/ContestContest.md)

Get a copy of the internal data.

#### Returns

[`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:317](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L317)

***

### round

> `get` **round**(): `number`

Index of the current round (zero-indexed).

#### Returns

`number`

#### Source

[src/contest.ts:438](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L438)

## Methods

### #getCompletionState()

> `private` **#getCompletionState**(`round`, `scores`): [`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Parameters

• **round**: `number`

• **scores**: `undefined` \| [`Score`](../../database/interfaces/Score.md)[]

#### Returns

[`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Source

[src/contest.ts:529](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L529)

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

[src/contest.ts:545](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L545)

***

### end()

> **end**(`complete`?): `void`

Stop the running contest and remove all users.

#### Parameters

• **complete?**: `boolean`

Mark the contest as ended in database (contest cannot be restarted)

#### Returns

`void`

#### Source

[src/contest.ts:660](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L660)

***

### onended()

> **onended**(`cb`): `void`

Add a listener for when the contest ends.

#### Parameters

• **cb**

Callback listener

#### Returns

`void`

#### Source

[src/contest.ts:674](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L674)

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

[src/contest.ts:446](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L446)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:324](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L324)

***

### removeSocket()

> **removeSocket**(`socket`): `boolean`

Remove a previously-added username-linked SocketIO connection from the user list.

#### Parameters

• **socket**: `ServerSocket`

SocketIO connection (with modifications)

#### Returns

`boolean`

If the socket was previously within the list of connections

#### Source

[src/contest.ts:644](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L644)

***

### updateAllUsers()

> **updateAllUsers**(): `Promise`\<`void`\>

Update all users in contest with latest contest data.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:452](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L452)

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

[src/contest.ts:459](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L459)

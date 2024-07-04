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

[src/contest.ts:304](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L304)

## Properties

### #active

> `private` **#active**: `boolean` = `false`

#### Source

[src/contest.ts:290](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L290)

***

### #data

> `private` **#data**: [`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:288](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L288)

***

### #endListeners

> `private` **#endListeners**: `Set`\<() => `any`\>

#### Source

[src/contest.ts:668](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L668)

***

### #ended

> `private` **#ended**: `boolean` = `false`

#### Source

[src/contest.ts:291](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L291)

***

### #index

> `private` **#index**: `number` = `0`

#### Source

[src/contest.ts:289](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L289)

***

### #sid

> `private` `readonly` **#sid**: `string`

#### Source

[src/contest.ts:292](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L292)

***

### #updateLoop

> `private` **#updateLoop**: `undefined` \| `Timeout` = `undefined`

#### Source

[src/contest.ts:293](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L293)

***

### #users

> `private` `readonly` **#users**: `Map`\<`string`, `Set`\<`ServerSocket`\>\>

#### Source

[src/contest.ts:295](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L295)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/contest.ts:284](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L284)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/contest.ts:285](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L285)

***

### id

> `readonly` **id**: `string`

#### Source

[src/contest.ts:282](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L282)

***

### io

> `readonly` **io**: `Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Source

[src/contest.ts:283](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L283)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/contest.ts:287](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L287)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Source

[src/contest.ts:286](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L286)

## Accessors

### data

> `get` **data**(): [`ContestContest`](../interfaces/ContestContest.md)

Get a copy of the internal data.

#### Returns

[`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:324](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L324)

***

### round

> `get` **round**(): `number`

Index of the current round (zero-indexed).

#### Returns

`number`

#### Source

[src/contest.ts:445](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L445)

## Methods

### #getCompletionState()

> `private` **#getCompletionState**(`round`, `scores`): [`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Parameters

• **round**: `number`

• **scores**: `undefined` \| [`Score`](../../database/interfaces/Score.md)[]

#### Returns

[`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Source

[src/contest.ts:536](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L536)

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

[src/contest.ts:558](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L558)

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

[src/contest.ts:673](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L673)

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

[src/contest.ts:687](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L687)

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

[src/contest.ts:453](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L453)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:331](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L331)

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

[src/contest.ts:657](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L657)

***

### updateAllUsers()

> **updateAllUsers**(): `Promise`\<`void`\>

Update all users in contest with latest contest data.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:459](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L459)

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

[src/contest.ts:466](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/contest.ts#L466)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestHost

# Class: ContestHost

Module of `ContestManager` containing hosting for individual contests, including handling submissions.
Creates a SocketIO namespace for client contest managers to connect to on top of the default namespace connection.

## Constructors

### new ContestHost()

> **new ContestHost**(`type`, `id`, `io`, `db`, `grader`, `logger`): [`ContestHost`](ContestHost.md)

#### Parameters

• **type**: `string`

Contest type Id

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

[src/contest.ts:316](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L316)

## Properties

### #active

> `private` **#active**: `boolean` = `false`

#### Source

[src/contest.ts:302](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L302)

***

### #contest

> `private` **#contest**: [`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:300](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L300)

***

### #endListeners

> `private` **#endListeners**: `Set`\<() => `any`\>

#### Source

[src/contest.ts:702](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L702)

***

### #ended

> `private` **#ended**: `boolean` = `false`

#### Source

[src/contest.ts:303](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L303)

***

### #index

> `private` **#index**: `number` = `0`

#### Source

[src/contest.ts:301](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L301)

***

### #updateLoop

> `private` **#updateLoop**: `undefined` \| `Timeout` = `undefined`

#### Source

[src/contest.ts:304](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L304)

***

### #users

> `private` `readonly` **#users**: `Map`\<`string`, `object`\>

#### Source

[src/contest.ts:306](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L306)

***

### contestType

> `readonly` **contestType**: `string`

#### Source

[src/contest.ts:293](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L293)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/contest.ts:296](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L296)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/contest.ts:297](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L297)

***

### id

> `readonly` **id**: `string`

#### Source

[src/contest.ts:294](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L294)

***

### io

> `readonly` **io**: `Namespace`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Source

[src/contest.ts:295](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L295)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/contest.ts:299](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L299)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Source

[src/contest.ts:298](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L298)

***

### sid

> `readonly` **sid**: `string`

#### Source

[src/contest.ts:292](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L292)

## Accessors

### data

> `get` **data**(): [`ContestContest`](../interfaces/ContestContest.md)

Get a copy of the internal data.

#### Returns

[`ContestContest`](../interfaces/ContestContest.md)

#### Source

[src/contest.ts:341](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L341)

***

### round

> `get` **round**(): `number`

Index of the current round (zero-indexed).

#### Returns

`number`

#### Source

[src/contest.ts:450](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L450)

## Methods

### #addInternalSocket()

> `private` **#addInternalSocket**(`username`, `s`): `void`

Add a previously-added internal SocketIO connection to the user list.

#### Parameters

• **username**: `string`

Username linked to socket

• **s**: `Socket`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

SocketIO connection

#### Returns

`void`

#### Source

[src/contest.ts:662](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L662)

***

### #getCompletionState()

> `private` **#getCompletionState**(`round`, `scores`): [`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Parameters

• **round**: `number`

• **scores**: `undefined` \| [`Score`](../../database/interfaces/Score.md)[]

#### Returns

[`ClientProblemCompletionState`](../enumerations/ClientProblemCompletionState.md)

#### Source

[src/contest.ts:541](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L541)

***

### #removeInternalSocket()

> `private` **#removeInternalSocket**(`username`, `socket`): `boolean`

Remove a previously-added internal SocketIO connection from the user list.

#### Parameters

• **username**: `string`

Username linked to socket

• **socket**: `Socket`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

SocketIO connection

#### Returns

`boolean`

If the socket was previously within the list of connections

#### Source

[src/contest.ts:691](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L691)

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

[src/contest.ts:563](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L563)

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

[src/contest.ts:707](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L707)

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

[src/contest.ts:721](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L721)

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

[src/contest.ts:458](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L458)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:348](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L348)

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

[src/contest.ts:670](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L670)

***

### updateAllUsers()

> **updateAllUsers**(): `Promise`\<`void`\>

Update all users in contest with latest contest data.

#### Returns

`Promise`\<`void`\>

#### Source

[src/contest.ts:464](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L464)

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

[src/contest.ts:471](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L471)

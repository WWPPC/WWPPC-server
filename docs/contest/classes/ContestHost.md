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

#### Defined in

[contest.ts:279](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L279)

## Properties

### contestType

> `readonly` **contestType**: `string`

#### Defined in

[contest.ts:254](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L254)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[contest.ts:257](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L257)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[contest.ts:258](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L258)

***

### id

> `readonly` **id**: `string`

#### Defined in

[contest.ts:255](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L255)

***

### io

> `readonly` **io**: `Namespace`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Defined in

[contest.ts:256](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L256)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[contest.ts:260](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L260)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Defined in

[contest.ts:259](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L259)

***

### sid

> `readonly` **sid**: `string`

#### Defined in

[contest.ts:253](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L253)

## Accessors

### data

> `get` **data**(): [`ContestContest`](../interfaces/ContestContest.md)

Get a copy of the internal data.

#### Returns

[`ContestContest`](../interfaces/ContestContest.md)

#### Defined in

[contest.ts:321](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L321)

***

### round

> `get` **round**(): `number`

Index of the current round (zero-indexed).

#### Returns

`number`

#### Defined in

[contest.ts:430](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L430)

## Methods

### addSocket()

> **addSocket**(`s`): `void`

Add a username-linked SocketIO connection to the user list.

#### Parameters

• **s**: [`ServerSocket`](../../clients/interfaces/ServerSocket.md)

SocketIO connection (with modifications)

#### Returns

`void`

#### Defined in

[contest.ts:543](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L543)

***

### end()

> **end**(`complete`?): `void`

Stop the running contest and remove all users.

#### Parameters

• **complete?**: `boolean`

Mark the contest as ended in database (contest cannot be restarted)

#### Returns

`void`

#### Defined in

[contest.ts:730](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L730)

***

### onended()

> **onended**(`cb`): `void`

Add a listener for when the contest ends.

#### Parameters

• **cb**

Callback listener

#### Returns

`void`

#### Defined in

[contest.ts:744](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L744)

***

### problemSubmittable()

> **problemSubmittable**(`id`): `boolean`

Get if a particular problem ID is submittable.

#### Parameters

• **id**: `string`

Problem ID

#### Returns

`boolean`

#### Defined in

[contest.ts:438](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L438)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:328](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L328)

***

### removeSocket()

> **removeSocket**(`socket`): `boolean`

Remove a previously-added username-linked SocketIO connection from the user list.

#### Parameters

• **socket**: [`ServerSocket`](../../clients/interfaces/ServerSocket.md)

SocketIO connection (with modifications)

#### Returns

`boolean`

If the socket was previously within the list of connections

#### Defined in

[contest.ts:688](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L688)

***

### updateAllUsers()

> **updateAllUsers**(): `Promise`\<`void`\>

Update all users in contest with latest contest data.

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:444](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L444)

***

### updateUser()

> **updateUser**(`username`): `Promise`\<`void`\>

Only update users under a team with the latest contest data.

#### Parameters

• **username**: `string`

Username

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:451](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/contest.ts#L451)

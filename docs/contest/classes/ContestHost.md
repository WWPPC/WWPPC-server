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

[contest.ts:291](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L291)

## Properties

### contestType

> `readonly` **contestType**: `string`

#### Defined in

[contest.ts:264](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L264)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Defined in

[contest.ts:267](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L267)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Defined in

[contest.ts:268](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L268)

***

### id

> `readonly` **id**: `string`

#### Defined in

[contest.ts:265](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L265)

***

### io

> `readonly` **io**: `Namespace`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>

#### Defined in

[contest.ts:266](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L266)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[contest.ts:270](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L270)

***

### scorer

> `readonly` **scorer**: [`Scorer`](../../scorer/classes/Scorer.md)

#### Defined in

[contest.ts:269](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L269)

***

### sid

> `readonly` **sid**: `string`

#### Defined in

[contest.ts:263](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L263)

## Accessors

### data

> `get` **data**(): [`ContestContest`](../interfaces/ContestContest.md)

Get a copy of the internal data.

#### Returns

[`ContestContest`](../interfaces/ContestContest.md)

#### Defined in

[contest.ts:334](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L334)

***

### round

> `get` **round**(): `number`

Index of the current round (zero-indexed).

#### Returns

`number`

#### Defined in

[contest.ts:458](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L458)

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

[contest.ts:571](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L571)

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

[contest.ts:771](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L771)

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

[contest.ts:785](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L785)

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

[contest.ts:466](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L466)

***

### reload()

> **reload**(): `Promise`\<`void`\>

Reload the contest data from the database, also updating clients.
Will re-calculate the current round as well.

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:341](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L341)

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

[contest.ts:729](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L729)

***

### updateAllUsers()

> **updateAllUsers**(): `Promise`\<`void`\>

Update all users in contest with latest contest data.

#### Returns

`Promise`\<`void`\>

#### Defined in

[contest.ts:472](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L472)

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

[contest.ts:479](https://github.com/WWPPC/WWPPC-server/blob/96bcc74e00ec496e35202c4bddfc3a060fa4a556/src/contest.ts#L479)

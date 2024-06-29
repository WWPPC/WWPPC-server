[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [upsolve](../README.md) / UpsolveManager

# Class: UpsolveManager

`UpsolveManager` allows viewing and submitting to problems of past contests.

## Constructors

### new UpsolveManager()

> **new UpsolveManager**(`db`, `app`, `logger`): [`UpsolveManager`](UpsolveManager.md)

#### Parameters

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **app**: `Express`

Express app (HTTP server) to attach API to

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`UpsolveManager`](UpsolveManager.md)

#### Source

[src/upsolve.ts:29](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L29)

## Properties

### #open

> `private` **#open**: `boolean` = `true`

#### Source

[src/upsolve.ts:22](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L22)

***

### #sockets

> `private` `readonly` **#sockets**: `Set`\<`ServerSocket`\>

#### Source

[src/upsolve.ts:15](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L15)

***

### app

> `readonly` **app**: `Express`

#### Source

[src/upsolve.ts:18](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L18)

***

### db

> `readonly` **db**: [`Database`](../../database/classes/Database.md)

#### Source

[src/upsolve.ts:17](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L17)

***

### grader

> `readonly` **grader**: [`Grader`](../../grader/classes/Grader.md)

#### Source

[src/upsolve.ts:20](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L20)

***

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/upsolve.ts:19](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L19)

## Methods

### #getCompletionState()

> `private` **#getCompletionState**(`scores`): [`ClientProblemCompletionState`](../../contest/enumerations/ClientProblemCompletionState.md)

#### Parameters

• **scores**: `undefined` \| [`Score`](../../database/interfaces/Score.md)[]

#### Returns

[`ClientProblemCompletionState`](../../contest/enumerations/ClientProblemCompletionState.md)

#### Source

[src/upsolve.ts:214](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L214)

***

### #mapSubmissions()

> `private` **#mapSubmissions**(`submission`): [`UpsolveSubmission`](../interfaces/UpsolveSubmission.md)[]

#### Parameters

• **submission**: [`Submission`](../../database/interfaces/Submission.md)

#### Returns

[`UpsolveSubmission`](../interfaces/UpsolveSubmission.md)[]

#### Source

[src/upsolve.ts:224](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L224)

***

### addUser()

> **addUser**(`s`): `Promise`\<`void`\>

Add a username-linked SocketIO connection to the user list.

#### Parameters

• **s**: `ServerSocket`

SocketIO connection (with modifications)

#### Returns

`Promise`\<`void`\>

#### Source

[src/upsolve.ts:123](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L123)

***

### close()

> **close**(): `void`

Closes the upsolve manager

#### Returns

`void`

#### Source

[src/upsolve.ts:246](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/upsolve.ts#L246)

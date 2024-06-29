[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [scorer](../README.md) / Scorer

# Class: Scorer

Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
Using the function score = Math.log(cnt+1)/cnt where cnt is number of people who solved the problem (if cnt=0, then 1).

## Constructors

### new Scorer()

> **new Scorer**(`rounds`, `logger`): [`Scorer`](Scorer.md)

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md)[]

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

#### Returns

[`Scorer`](Scorer.md)

#### Source

[src/scorer.ts:23](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L23)

## Properties

### #round

> `private` **#round**: `number`

#### Source

[src/scorer.ts:14](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L14)

***

### #rounds

> `private` **#rounds**: [`Round`](../../database/interfaces/Round.md)[]

#### Source

[src/scorer.ts:13](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L13)

***

### #scores

> `private` `readonly` **#scores**: `Map`\<`number`, `Map`\<`string`, `number`\>\>

#### Source

[src/scorer.ts:17](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L17)

***

### #subtasks

> `private` `readonly` **#subtasks**: `Set`\<[`Subtask`](../interfaces/Subtask.md)\>

#### Source

[src/scorer.ts:12](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L12)

***

### #users

> `private` **#users**: `Map`\<`string`, `Map`\<[`Subtask`](../interfaces/Subtask.md), `number`\>\>

#### Source

[src/scorer.ts:21](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L21)

***

### logger

> **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/scorer.ts:10](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L10)

## Methods

### getRoundScores()

> **getRoundScores**(): `Map`\<`string`, `number`\>

Get the current standings, only calculating current round scores.
Writes current scores to scores map.

#### Returns

`Map`\<`string`, `number`\>

Mapping of username to score

#### Source

[src/scorer.ts:87](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L87)

***

### getScores()

> **getScores**(): `Map`\<`string`, `number`\>

Get the current standings, adding scores from all rounds together.

#### Returns

`Map`\<`string`, `number`\>

mapping of username to score

#### Source

[src/scorer.ts:156](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L156)

***

### setContest()

> **setContest**(`rounds`): `void`

Reset the rounds data (MAY CAUSE ISSUES!)

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md)[]

Contest round data

#### Returns

`void`

#### Source

[src/scorer.ts:33](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L33)

***

### setRound()

> **setRound**(`round`): `void`

Set the round. Updates current round scores and resets submissions.

#### Parameters

• **round**: `number`

Round number

#### Returns

`void`

#### Source

[src/scorer.ts:41](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L41)

***

### updateUser()

> **updateUser**(`submission`): `Boolean`

Add or edit user (or team the scorer doesnt care) to leaderboard
Note that we only care about submission.scores so you can change the params to make it more convenient

#### Parameters

• **submission**: [`Submission`](../../database/interfaces/Submission.md)

the submission (with COMPLETE SCORES)

#### Returns

`Boolean`

whether it was successful

#### Source

[src/scorer.ts:53](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/scorer.ts#L53)

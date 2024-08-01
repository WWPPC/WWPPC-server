[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [scorer](../README.md) / Scorer

# Class: Scorer

Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.
Using the function score = 1/cnt where cnt is number of people who solved the problem

## Constructors

### new Scorer()

> **new Scorer**(`rounds`, `logger`): [`Scorer`](Scorer.md)

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md)[]

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

#### Returns

[`Scorer`](Scorer.md)

#### Source

[src/scorer.ts:28](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L28)

## Properties

### #rounds

> `private` **#rounds**: [`Round`](../../database/interfaces/Round.md)[]

list of all rounds

#### Source

[src/scorer.ts:15](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L15)

***

### #subtasks

> `private` `readonly` **#subtasks**: `Set`\<[`Subtask`](../interfaces/Subtask.md)\>

List of all subtasks. One is inserted anytime a submission contains a subtask we don't know about yet

#### Source

[src/scorer.ts:20](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L20)

***

### #userSolvedStatus

> `private` **#userSolvedStatus**: `Map`\<`string`, `Map`\<[`Subtask`](../interfaces/Subtask.md), `number`\>\>

key: username
value: map of subtask to solve time (if a subtask is unsolved, it is not in the map)

#### Source

[src/scorer.ts:26](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L26)

***

### logger

> **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Source

[src/scorer.ts:10](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L10)

## Methods

### addRounds()

> **addRounds**(`rounds`): `void`

Add rounds

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md) \| [`Round`](../../database/interfaces/Round.md)[]

Contest round data

#### Returns

`void`

#### Source

[src/scorer.ts:45](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L45)

***

### getRoundScores()

> **getRoundScores**(`round`): `Map`\<`string`, `number`\>

Get standings for a specified round.

#### Parameters

• **round**: `string`

Round ID

#### Returns

`Map`\<`string`, `number`\>

Mapping of username to score

#### Source

[src/scorer.ts:94](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L94)

***

### getScores()

> **getScores**(): `Map`\<`string`, `number`\>

Get the current standings, adding scores from all rounds together.

#### Returns

`Map`\<`string`, `number`\>

mapping of username to score

#### Source

[src/scorer.ts:147](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L147)

***

### setRounds()

> **setRounds**(`rounds`): `void`

Set rounds data (shouldn't bork anything)

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md)[]

Contest round data

#### Returns

`void`

#### Source

[src/scorer.ts:37](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L37)

***

### updateUser()

> **updateUser**(`submission`, `submissionRound`?): `Boolean`

Process submission and add to leaderboard

#### Parameters

• **submission**: [`Submission`](../../database/interfaces/Submission.md)

the scored submission

• **submissionRound?**: `string`

(optional) round UUID

#### Returns

`Boolean`

whether it was successful

#### Source

[src/scorer.ts:56](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/scorer.ts#L56)

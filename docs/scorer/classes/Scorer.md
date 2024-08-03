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

#### Defined in

[scorer.ts:28](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/scorer.ts#L28)

## Properties

### logger

> **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[scorer.ts:10](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/scorer.ts#L10)

## Methods

### addRounds()

> **addRounds**(`rounds`): `void`

Add rounds

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md) \| [`Round`](../../database/interfaces/Round.md)[]

Contest round data

#### Returns

`void`

#### Defined in

[scorer.ts:45](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/scorer.ts#L45)

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

#### Defined in

[scorer.ts:94](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/scorer.ts#L94)

***

### getScores()

> **getScores**(): `Map`\<`string`, `number`\>

Get the current standings, adding scores from all rounds together.

#### Returns

`Map`\<`string`, `number`\>

mapping of username to score

#### Defined in

[scorer.ts:147](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/scorer.ts#L147)

***

### setRounds()

> **setRounds**(`rounds`): `void`

Set rounds data (shouldn't bork anything)

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md)[]

Contest round data

#### Returns

`void`

#### Defined in

[scorer.ts:37](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/scorer.ts#L37)

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

#### Defined in

[scorer.ts:56](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/scorer.ts#L56)

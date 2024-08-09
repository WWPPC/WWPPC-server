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

Contest rounds

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logger instance

#### Returns

[`Scorer`](Scorer.md)

#### Defined in

[scorer.ts:19](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/scorer.ts#L19)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[scorer.ts:13](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/scorer.ts#L13)

## Accessors

### rounds

> `set` **rounds**(`rounds`): `void`

#### Parameters

• **rounds**: [`Round`](../../database/interfaces/Round.md)[]

#### Defined in

[scorer.ts:24](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/scorer.ts#L24)

## Methods

### getRoundScores()

> **getRoundScores**(`roundId`): `Map`\<`string`, `number`\>

Get standings for a specified round.

#### Parameters

• **roundId**: `string`

Round ID

#### Returns

`Map`\<`string`, `number`\>

Mapping of username to score

#### Defined in

[scorer.ts:72](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/scorer.ts#L72)

***

### getScores()

> **getScores**(): `Map`\<`string`, `number`\>

Get the current standings, adding scores from all rounds together.

#### Returns

`Map`\<`string`, `number`\>

mapping of username to score

#### Defined in

[scorer.ts:132](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/scorer.ts#L132)

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

[scorer.ts:34](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/scorer.ts#L34)

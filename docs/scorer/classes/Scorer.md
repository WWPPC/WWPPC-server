[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [scorer](../README.md) / Scorer

# Class: Scorer

Scorer class, supports adding and modifying user submission status, and can get scores of individual users and leaderboard.

## Constructors

### new Scorer()

> **new Scorer**(`rounds`, `logger`, `scoringFunction`): [`Scorer`](Scorer.md)

#### Parameters

##### rounds

[`Round`](../../database/type-aliases/Round.md)[]

Contest rounds

##### logger

[`Logger`](../../log/classes/Logger.md)

Logger instance

##### scoringFunction

[`ScoringFunction`](../type-aliases/ScoringFunction.md)

Scoring function

#### Returns

[`Scorer`](Scorer.md)

#### Defined in

[scorer.ts:43](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L43)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[scorer.ts:36](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L36)

***

### scoringFunction

> `readonly` **scoringFunction**: [`ScoringFunction`](../type-aliases/ScoringFunction.md)

#### Defined in

[scorer.ts:35](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L35)

## Methods

### clearScores()

> **clearScores**(): `void`

Remove all existing scores.

#### Returns

`void`

#### Defined in

[scorer.ts:161](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L161)

***

### getRoundScores()

> **getRoundScores**(`roundId`): `Map`\<`string`, [`UserScore`](../type-aliases/UserScore.md)\>

Get standings for a specified round.

#### Parameters

##### roundId

`string`

Round ID

#### Returns

`Map`\<`string`, [`UserScore`](../type-aliases/UserScore.md)\>

Mapping of username to score

#### Defined in

[scorer.ts:97](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L97)

***

### getScores()

> **getScores**(): `Map`\<`string`, [`UserScore`](../type-aliases/UserScore.md)\>

Get the current standings, adding scores from all rounds together.

#### Returns

`Map`\<`string`, [`UserScore`](../type-aliases/UserScore.md)\>

mapping of username to score

#### Defined in

[scorer.ts:146](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L146)

***

### setRounds()

> **setRounds**(`rounds`): `void`

#### Parameters

##### rounds

[`Round`](../../database/type-aliases/Round.md)[]

#### Returns

`void`

#### Defined in

[scorer.ts:49](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L49)

***

### updateUser()

> **updateUser**(`submission`, `submissionRound`?): `Boolean`

Process submission and add to leaderboard.

#### Parameters

##### submission

[`Submission`](../../database/type-aliases/Submission.md)

The scored submission

##### submissionRound?

`string`

(optional) round UUID. If this isn't passed in, we look it up from the loaded rounds

#### Returns

`Boolean`

whether it was successful

#### Defined in

[scorer.ts:59](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/scorer.ts#L59)

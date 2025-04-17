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

[scorer.ts:43](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L43)

## Properties

### logger

> `readonly` **logger**: [`NamedLogger`](../../log/classes/NamedLogger.md)

#### Defined in

[scorer.ts:36](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L36)

***

### scoringFunction

> `readonly` **scoringFunction**: [`ScoringFunction`](../type-aliases/ScoringFunction.md)

#### Defined in

[scorer.ts:35](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L35)

## Methods

### addSubmission()

> **addSubmission**(`submission`, `submissionRound`?): `Boolean`

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

[scorer.ts:59](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L59)

***

### clearScores()

> **clearScores**(): `void`

Remove all existing scores.

#### Returns

`void`

#### Defined in

[scorer.ts:162](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L162)

***

### getRoundScores()

> **getRoundScores**(`roundId`): `Map`\<`number`, [`TeamScore`](../type-aliases/TeamScore.md)\>

Get standings for a specified round.

#### Parameters

##### roundId

`string`

Round ID

#### Returns

`Map`\<`number`, [`TeamScore`](../type-aliases/TeamScore.md)\>

Mapping of team to score

#### Defined in

[scorer.ts:98](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L98)

***

### getScores()

> **getScores**(): `Map`\<`number`, [`TeamScore`](../type-aliases/TeamScore.md)\>

Get the current standings, adding scores from all rounds together.

#### Returns

`Map`\<`number`, [`TeamScore`](../type-aliases/TeamScore.md)\>

mapping of team to score

#### Defined in

[scorer.ts:147](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L147)

***

### setRounds()

> **setRounds**(`rounds`): `void`

#### Parameters

##### rounds

[`Round`](../../database/type-aliases/Round.md)[]

#### Returns

`void`

#### Defined in

[scorer.ts:49](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L49)

[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [scorer](../README.md) / ScoringFunction

# Type Alias: ScoringFunction()

> **ScoringFunction**: (`submission`, `problem`, `round`) => [`UserScore`](UserScore.md)

Function used by `Scorer` to assign point values to submissions.

## Parameters

### submission

#### submission.time

`number`

### problem

#### problem.numSubtasks

`number`

### round

#### round.endTime

`number`

#### round.startTime

`number`

## Returns

[`UserScore`](UserScore.md)

## Defined in

[scorer.ts:26](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/scorer.ts#L26)

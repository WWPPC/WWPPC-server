[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [scorer](../README.md) / ScoringFunction

# Type Alias: ScoringFunction()

> **ScoringFunction**: (`submission`, `problem`, `round`) => [`TeamScore`](TeamScore.md)

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

[`TeamScore`](TeamScore.md)

## Defined in

[scorer.ts:26](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/scorer.ts#L26)

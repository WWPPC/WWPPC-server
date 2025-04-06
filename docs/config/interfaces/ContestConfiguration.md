[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [config](../README.md) / ContestConfiguration

# Interface: ContestConfiguration

Configuration settings for a contest type, part of the [GlobalConfiguration.contests](GlobalConfiguration.md#contests) field of [GlobalConfiguration](GlobalConfiguration.md). Loaded from contests.json.

## Properties

### acceptedSolverLanguages

> `readonly` **acceptedSolverLanguages**: `string`[]

Programming languages accepted for submissions (case sensitive, only if "submitSolver" is "true") (default: Java8, Java11, Java17, Java21, C11, C++11, C++17, C++20, Python3.12.3)

#### Defined in

[config.ts:91](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L91)

***

### directSubmissionDelay

> `readonly` **directSubmissionDelay**: `number`

Submissions when [ContestConfiguration.submitSolver](ContestConfiguration.md#submitsolver) is "false" will be delayed by a number of seconds (usually to discourage spamming) (default: 10)

#### Defined in

[config.ts:89](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L89)

***

### graders

> `readonly` **graders**: `boolean`

Use grading system to evaluate submissions, otherwise grade manually (default: true)

#### Defined in

[config.ts:79](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L79)

***

### maxSubmissionSize

> `readonly` **maxSubmissionSize**: `number`

Maximum character length of uploaded submissions (default: 65536)

#### Defined in

[config.ts:93](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L93)

***

### rounds

> `readonly` **rounds**: `boolean`

Enable round separation (separates contest into multiple sub-contests) (default: true)

#### Defined in

[config.ts:81](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L81)

***

### scoreFreezeTime

> `readonly` **scoreFreezeTime**: `number`

"Freeze" scores - stop updating scores for clients - for some amount of time (minutes) before the last round ends (default: 60)

#### Defined in

[config.ts:83](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L83)

***

### submitSolver

> `readonly` **submitSolver**: `boolean`

Submissions will be treated as solution code instead of an answer - setting to "false" limits grading to one test case (default: true)

#### Defined in

[config.ts:87](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L87)

***

### withholdResults

> `readonly` **withholdResults**: `boolean`

Withhold submission results for each round until the round ends (submissions are still instantly graded however) (default: false)

#### Defined in

[config.ts:85](https://github.com/WWPPC/WWPPC-server/blob/f21384f154c6e2184ddc59d99a3230ee362152e8/src/config.ts#L85)

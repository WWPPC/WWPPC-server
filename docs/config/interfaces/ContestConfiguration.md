[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [config](../README.md) / ContestConfiguration

# Interface: ContestConfiguration

Configuration settings for a contest type, part of the [GlobalConfiguration.contests](GlobalConfiguration.md#contests) field of [GlobalConfiguration](GlobalConfiguration.md). Loaded from contests.json.

## Properties

### acceptedSolverLanguages

> `readonly` **acceptedSolverLanguages**: `string`[]

Programming languages accepted for submissions (case sensitive, only if "submitSolver" is "true") (default: Java8, Java11, Java17, Java21, C11, C++11, C++17, C++20, Python3.12.3)

#### Defined in

[config.ts:90](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L90)

***

### directSubmissionDelay

> `readonly` **directSubmissionDelay**: `number`

Submissions when [ContestConfiguration.submitSolver](ContestConfiguration.md#submitsolver) is "false" will be delayed by a number of seconds (usually to discourage spamming) (default: 10)

#### Defined in

[config.ts:88](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L88)

***

### graders

> `readonly` **graders**: `boolean`

Use grading system to evaluate submissions, otherwise grade manually (default: true)

#### Defined in

[config.ts:78](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L78)

***

### maxSubmissionSize

> `readonly` **maxSubmissionSize**: `number`

Maximum file size of uploaded submission files (default: 10240)

#### Defined in

[config.ts:92](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L92)

***

### rounds

> `readonly` **rounds**: `boolean`

Enable round separation (separates contest into multiple sub-contests) (default: true)

#### Defined in

[config.ts:80](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L80)

***

### scoreFreezeTime

> `readonly` **scoreFreezeTime**: `number`

"Freeze" scores - stop updating scores for clients - for some amount of time (minutes) before the last round ends (default: 60)

#### Defined in

[config.ts:82](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L82)

***

### submitSolver

> `readonly` **submitSolver**: `boolean`

Submissions will be treated as solution code instead of an answer - setting to "false" limits grading to one test case (default: true)

#### Defined in

[config.ts:86](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L86)

***

### withholdResults

> `readonly` **withholdResults**: `boolean`

Withhold submission results for each round until the round ends (submissions are still instantly graded however) (default: false)

#### Defined in

[config.ts:84](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/config.ts#L84)

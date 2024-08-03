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

[config.ts:88](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L88)

***

### graders

> `readonly` **graders**: `boolean`

Use grading system to evaluate submissions, otherwise grade manually (default: true)

#### Defined in

[config.ts:78](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L78)

***

### maxSubmissionSize

> `readonly` **maxSubmissionSize**: `number`

Maximum file size of uploaded submission files (actually counts the length of the base64 encoded `data:` URI, so it is imperfect) (default: 10240)

#### Defined in

[config.ts:90](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L90)

***

### rounds

> `readonly` **rounds**: `boolean`

Enable round separation (separates contest into multiple sub-contests) (default: true)

#### Defined in

[config.ts:80](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L80)

***

### scoreFreezeTime

> `readonly` **scoreFreezeTime**: `number`

"Freeze" scores - stop updating scores for clients - for some amount of time (minutes) before the last round ends (default: 60)

#### Defined in

[config.ts:82](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L82)

***

### submitSolver

> `readonly` **submitSolver**: `boolean`

Submissions will be treated as solution code instead of an answer - setting to "false" limits grading to one test case (default: true)

#### Defined in

[config.ts:86](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L86)

***

### withholdResults

> `readonly` **withholdResults**: `boolean`

Withhold submission results for each round until the round ends (submissions are still instantly graded however) (default: false)

#### Defined in

[config.ts:84](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/config.ts#L84)

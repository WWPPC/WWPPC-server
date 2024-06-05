[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [wwppcGrader](../README.md) / GraderNode

# Interface: GraderNode

Represents a grader server

## Properties

### deadline

> **deadline**: `number`

Deadline to return the submission (unix ms)

#### Source

[src/wwppcGrader.ts:286](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L286)

***

### grading

> **grading**: `undefined` \| [`SubmissionWithCallback`](SubmissionWithCallback.md)

Submission that is being graded

#### Source

[src/wwppcGrader.ts:284](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L284)

***

### lastCommunication

> **lastCommunication**: `number`

Last time we communicated with this judgehost (unix ms)

#### Source

[src/wwppcGrader.ts:288](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L288)

***

### username

> **username**: `string`

Username

#### Source

[src/wwppcGrader.ts:282](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/wwppcGrader.ts#L282)

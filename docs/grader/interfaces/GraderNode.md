[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [grader](../README.md) / GraderNode

# Interface: GraderNode

Represents a grader server

## Properties

### deadline

> **deadline**: `number`

Deadline to return the submission (unix ms)

#### Source

[src/grader.ts:296](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/grader.ts#L296)

***

### grading

> **grading**: `undefined` \| [`SubmissionWithCallback`](SubmissionWithCallback.md)

Submission that is being graded

#### Source

[src/grader.ts:294](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/grader.ts#L294)

***

### lastCommunication

> **lastCommunication**: `number`

Last time we communicated with this judgehost (unix ms)

#### Source

[src/grader.ts:298](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/grader.ts#L298)

***

### username

> **username**: `string`

Username

#### Source

[src/grader.ts:292](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/grader.ts#L292)

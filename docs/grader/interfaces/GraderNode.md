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

[src/grader.ts:298](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L298)

***

### grading

> **grading**: `undefined` \| [`SubmissionWithCallback`](SubmissionWithCallback.md)

Submission that is being graded

#### Source

[src/grader.ts:296](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L296)

***

### lastCommunication

> **lastCommunication**: `number`

Last time we communicated with this grader (unix ms)

#### Source

[src/grader.ts:300](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L300)

***

### username

> **username**: `string`

Username

#### Source

[src/grader.ts:294](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/grader.ts#L294)

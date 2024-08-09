[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [grader](../README.md) / GraderNode

# Interface: GraderNode

Represents a grader server

## Properties

### deadline

> **deadline**: `number`

Deadline to return the submission (unix ms)

#### Defined in

[grader.ts:298](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L298)

***

### grading

> **grading**: `undefined` \| [`SubmissionWithCallback`](SubmissionWithCallback.md)

Submission that is being graded

#### Defined in

[grader.ts:296](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L296)

***

### lastCommunication

> **lastCommunication**: `number`

Last time we communicated with this grader (unix ms)

#### Defined in

[grader.ts:300](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L300)

***

### username

> **username**: `string`

Username

#### Defined in

[grader.ts:294](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/grader.ts#L294)

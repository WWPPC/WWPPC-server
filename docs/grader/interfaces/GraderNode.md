[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [grader](../README.md) / GraderNode

# Interface: GraderNode

Represents a grader server

## Properties

### deadline

> **deadline**: `number`

Deadline to return the submission (unix ms)

#### Defined in

[grader.ts:298](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/grader.ts#L298)

***

### grading

> **grading**: `undefined` \| [`SubmissionWithCallback`](SubmissionWithCallback.md)

Submission that is being graded

#### Defined in

[grader.ts:296](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/grader.ts#L296)

***

### lastCommunication

> **lastCommunication**: `number`

Last time we communicated with this grader (unix ms)

#### Defined in

[grader.ts:300](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/grader.ts#L300)

***

### username

> **username**: `string`

Username

#### Defined in

[grader.ts:294](https://github.com/WWPPC/WWPPC-server/blob/2dee3653c422ea6b91c8bffad27d9e2a1aa16711/src/grader.ts#L294)

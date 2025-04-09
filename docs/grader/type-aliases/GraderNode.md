[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [grader](../README.md) / GraderNode

# Type Alias: GraderNode

> **GraderNode**: `object`

Represents a grader server

## Type declaration

### deadline

> **deadline**: `number`

Deadline to return the submission (unix ms)

### grading

> **grading**: [`SubmissionWithCallback`](SubmissionWithCallback.md) \| `undefined`

Submission that is being graded

### lastCommunication

> **lastCommunication**: `number`

Last time we communicated with this grader (unix ms)

### username

> **username**: `string`

Username

## Defined in

[grader.ts:294](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/grader.ts#L294)

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

[grader.ts:292](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/grader.ts#L292)

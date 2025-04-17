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

[grader.ts:295](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/grader.ts#L295)

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

[src/grader.ts:307](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L307)

***

### grading

> **grading**: `undefined` \| [`SubmissionWithCallback`](SubmissionWithCallback.md)

Submission that is being graded

#### Source

[src/grader.ts:305](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L305)

***

### lastCommunication

> **lastCommunication**: `number`

Last time we communicated with this grader (unix ms)

#### Source

[src/grader.ts:309](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L309)

***

### username

> **username**: `string`

Username

#### Source

[src/grader.ts:303](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/grader.ts#L303)

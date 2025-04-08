[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [api](../README.md) / ClientProblemCompletionState

# Enumeration: ClientProblemCompletionState

Client enum for completion state of problems

## Enumeration Members

### GRADED\_FAIL

> **GRADED\_FAIL**: `3`

Submitted, graded, and failed all subtasks

#### Defined in

[api.ts:330](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/api.ts#L330)

***

### GRADED\_PARTIAL

> **GRADED\_PARTIAL**: `4`

Submitted, graded, passed at least one subtask and failed at least one subtask

#### Defined in

[api.ts:332](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/api.ts#L332)

***

### GRADED\_PASS

> **GRADED\_PASS**: `5`

Submitted, graded, and passed all subtasks

#### Defined in

[api.ts:334](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/api.ts#L334)

***

### NOT\_UPLOADED

> **NOT\_UPLOADED**: `0`

Not attempted

#### Defined in

[api.ts:324](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/api.ts#L324)

***

### SUBMITTED

> **SUBMITTED**: `2`

Submitted but not graded, submissions locked

#### Defined in

[api.ts:328](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/api.ts#L328)

***

### UPLOADED

> **UPLOADED**: `1`

Uploaded but not graded, can still be changed

#### Defined in

[api.ts:326](https://github.com/WWPPC/WWPPC-server/blob/c08bb5874acf9739d5547370b47d1a65e80f6db4/src/api.ts#L326)

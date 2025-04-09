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

[api.ts:408](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/api.ts#L408)

***

### GRADED\_PARTIAL

> **GRADED\_PARTIAL**: `4`

Submitted, graded, passed at least one subtask and failed at least one subtask

#### Defined in

[api.ts:410](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/api.ts#L410)

***

### GRADED\_PASS

> **GRADED\_PASS**: `5`

Submitted, graded, and passed all subtasks

#### Defined in

[api.ts:412](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/api.ts#L412)

***

### NOT\_UPLOADED

> **NOT\_UPLOADED**: `0`

Not attempted

#### Defined in

[api.ts:402](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/api.ts#L402)

***

### SUBMITTED

> **SUBMITTED**: `2`

Submitted but not graded, submissions locked

#### Defined in

[api.ts:406](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/api.ts#L406)

***

### UPLOADED

> **UPLOADED**: `1`

Uploaded but not graded, can still be changed

#### Defined in

[api.ts:404](https://github.com/WWPPC/WWPPC-server/blob/893fab4901e205d136b5570c7c0b518b74b2e9d9/src/api.ts#L404)

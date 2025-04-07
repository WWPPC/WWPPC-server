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

[api.ts:319](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/api.ts#L319)

***

### GRADED\_PARTIAL

> **GRADED\_PARTIAL**: `4`

Submitted, graded, passed at least one subtask and failed at least one subtask

#### Defined in

[api.ts:321](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/api.ts#L321)

***

### GRADED\_PASS

> **GRADED\_PASS**: `5`

Submitted, graded, and passed all subtasks

#### Defined in

[api.ts:323](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/api.ts#L323)

***

### NOT\_UPLOADED

> **NOT\_UPLOADED**: `0`

Not attempted

#### Defined in

[api.ts:313](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/api.ts#L313)

***

### SUBMITTED

> **SUBMITTED**: `2`

Submitted but not graded, submissions locked

#### Defined in

[api.ts:317](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/api.ts#L317)

***

### UPLOADED

> **UPLOADED**: `1`

Uploaded but not graded, can still be changed

#### Defined in

[api.ts:315](https://github.com/WWPPC/WWPPC-server/blob/8fa1fab7588b7cc0d91c585786635fd288d3453c/src/api.ts#L315)

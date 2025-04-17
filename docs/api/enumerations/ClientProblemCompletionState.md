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

[api.ts:435](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/api.ts#L435)

***

### GRADED\_PARTIAL

> **GRADED\_PARTIAL**: `4`

Submitted, graded, passed at least one subtask and failed at least one subtask

#### Defined in

[api.ts:437](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/api.ts#L437)

***

### GRADED\_PASS

> **GRADED\_PASS**: `5`

Submitted, graded, and passed all subtasks

#### Defined in

[api.ts:439](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/api.ts#L439)

***

### NOT\_UPLOADED

> **NOT\_UPLOADED**: `0`

Not attempted

#### Defined in

[api.ts:429](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/api.ts#L429)

***

### SUBMITTED

> **SUBMITTED**: `2`

Submitted but not graded, submissions locked

#### Defined in

[api.ts:433](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/api.ts#L433)

***

### UPLOADED

> **UPLOADED**: `1`

Uploaded but not graded, can still be changed

#### Defined in

[api.ts:431](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/api.ts#L431)

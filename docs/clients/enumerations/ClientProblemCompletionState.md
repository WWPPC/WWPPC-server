[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [clients](../README.md) / ClientProblemCompletionState

# Enumeration: ClientProblemCompletionState

Client enum for completion state of problems

## Enumeration Members

### ERROR

> **ERROR**: `6`

Error loading status

#### Defined in

[clients.ts:572](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L572)

***

### GRADED\_FAIL

> **GRADED\_FAIL**: `4`

Submitted, graded, and failed all subtasks

#### Defined in

[clients.ts:568](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L568)

***

### GRADED\_PARTIAL

> **GRADED\_PARTIAL**: `5`

Submitted, graded, passed at least one subtask and failed at least one subtask

#### Defined in

[clients.ts:570](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L570)

***

### GRADED\_PASS

> **GRADED\_PASS**: `3`

Submitted, graded, and passed all subtasks

#### Defined in

[clients.ts:566](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L566)

***

### NOT\_UPLOADED

> **NOT\_UPLOADED**: `0`

Not attempted

#### Defined in

[clients.ts:560](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L560)

***

### SUBMITTED

> **SUBMITTED**: `2`

Submitted but not graded, submissions locked

#### Defined in

[clients.ts:564](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L564)

***

### UPLOADED

> **UPLOADED**: `1`

Uploaded but not graded, can still be changed

#### Defined in

[clients.ts:562](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L562)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ClientProblemCompletionState

# Enumeration: ClientProblemCompletionState

Client enum for completion state of problems

## Enumeration Members

### ERROR

> **ERROR**: `6`

Error loading status

#### Source

[src/contest.ts:276](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L276)

***

### GRADED\_FAIL

> **GRADED\_FAIL**: `4`

Submitted, graded, and failed all subtasks

#### Source

[src/contest.ts:272](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L272)

***

### GRADED\_PARTIAL

> **GRADED\_PARTIAL**: `5`

Submitted, graded, passed at least one subtask and failed at least one subtask

#### Source

[src/contest.ts:274](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L274)

***

### GRADED\_PASS

> **GRADED\_PASS**: `3`

Submitted, graded, and passed all subtasks

#### Source

[src/contest.ts:270](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L270)

***

### NOT\_UPLOADED

> **NOT\_UPLOADED**: `0`

Not attempted

#### Source

[src/contest.ts:264](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L264)

***

### SUBMITTED

> **SUBMITTED**: `2`

Submitted but not graded, submissions locked

#### Source

[src/contest.ts:268](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L268)

***

### UPLOADED

> **UPLOADED**: `1`

Uploaded but not graded, can still be changed

#### Source

[src/contest.ts:266](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/contest.ts#L266)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [contest](../README.md) / ContestUpdateSubmissionResult

# Enumeration: ContestUpdateSubmissionResult

Response codes for submitting to a problem in contest

## Enumeration Members

### ERROR

> **ERROR**: `4`

The submission was rejected because an error occured

#### Source

[src/contest.ts:261](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L261)

***

### FILE\_TOO\_LARGE

> **FILE\_TOO\_LARGE**: `1`

The submission was rejected because the file size was exceeded

#### Source

[src/contest.ts:255](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L255)

***

### LANGUAGE\_NOT\_ACCEPTABLE

> **LANGUAGE\_NOT\_ACCEPTABLE**: `2`

The submission was rejected because the submission language is not acceptable

#### Source

[src/contest.ts:257](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L257)

***

### PROBLEM\_NOT\_SUBMITTABLE

> **PROBLEM\_NOT\_SUBMITTABLE**: `3`

The submission was rejected because the target problem is not open to submissions

#### Source

[src/contest.ts:259](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L259)

***

### SUCCESS

> **SUCCESS**: `0`

The submission was accepted

#### Source

[src/contest.ts:253](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/contest.ts#L253)

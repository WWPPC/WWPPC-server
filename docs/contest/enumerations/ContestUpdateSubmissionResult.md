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

[src/contest.ts:275](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/contest.ts#L275)

***

### FILE\_TOO\_LARGE

> **FILE\_TOO\_LARGE**: `1`

The submission was rejected because the file size was exceeded

#### Source

[src/contest.ts:269](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/contest.ts#L269)

***

### LANGUAGE\_NOT\_ACCEPTABLE

> **LANGUAGE\_NOT\_ACCEPTABLE**: `2`

The submission was rejected because the submission language is not acceptable

#### Source

[src/contest.ts:271](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/contest.ts#L271)

***

### PROBLEM\_NOT\_SUBMITTABLE

> **PROBLEM\_NOT\_SUBMITTABLE**: `3`

The submission was rejected because the target problem is not open to submissions

#### Source

[src/contest.ts:273](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/contest.ts#L273)

***

### SUCCESS

> **SUCCESS**: `0`

The submission was accepted

#### Source

[src/contest.ts:267](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/contest.ts#L267)

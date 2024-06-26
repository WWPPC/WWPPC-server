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

[src/contest.ts:268](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L268)

***

### FILE\_TOO\_LARGE

> **FILE\_TOO\_LARGE**: `1`

The submission was rejected because the file size was exceeded

#### Source

[src/contest.ts:262](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L262)

***

### LANGUAGE\_NOT\_ACCEPTABLE

> **LANGUAGE\_NOT\_ACCEPTABLE**: `2`

The submission was rejected because the submission language is not acceptable

#### Source

[src/contest.ts:264](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L264)

***

### PROBLEM\_NOT\_SUBMITTABLE

> **PROBLEM\_NOT\_SUBMITTABLE**: `3`

The submission was rejected because the target problem is not open to submissions

#### Source

[src/contest.ts:266](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L266)

***

### SUCCESS

> **SUCCESS**: `0`

The submission was accepted

#### Source

[src/contest.ts:260](https://github.com/WWPPC/WWPPC-server/blob/2f411756995c4ec8bd83114e0be6e407a493af19/src/contest.ts#L260)

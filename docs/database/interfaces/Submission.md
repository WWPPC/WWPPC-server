[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / Submission

# Interface: Submission

Descriptor for a single submission

## Properties

### analysis

> **analysis**: `boolean`

If the submission was submitted through the upsolve system

#### Source

[src/database.ts:1500](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1500)

***

### file

> **file**: `string`

Contents of the submission file

#### Source

[src/database.ts:1485](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1485)

***

### history

> **history**: `object`[]

Shortened list of previous submissions and their results, without content (increasing chronologically)

#### Source

[src/database.ts:1491](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1491)

***

### lang

> **lang**: `string`

Submission language

#### Source

[src/database.ts:1487](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1487)

***

### problemId

> `readonly` **problemId**: `string`

UUID of problem submitted to

#### Source

[src/database.ts:1481](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1481)

***

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

#### Source

[src/database.ts:1489](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1489)

***

### time

> **time**: `number`

Time of submission, UNIX milliseconds

#### Source

[src/database.ts:1483](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1483)

***

### username

> `readonly` **username**: `string`

Username of submitter

#### Source

[src/database.ts:1479](https://github.com/WWPPC/WWPPC-server/blob/d36edcf5b3e9dc61bf375adab6f0ce8e98344d21/src/database.ts#L1479)

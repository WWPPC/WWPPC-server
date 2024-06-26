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

[src/database.ts:1492](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1492)

***

### file

> **file**: `string`

Contents of the submission file

#### Source

[src/database.ts:1477](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1477)

***

### history

> **history**: `object`[]

Shortened list of previous submissions and their results, without content (increasing chronologically)

#### Source

[src/database.ts:1483](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1483)

***

### lang

> **lang**: `string`

Submission language

#### Source

[src/database.ts:1479](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1479)

***

### problemId

> `readonly` **problemId**: `string`

UUID of problem submitted to

#### Source

[src/database.ts:1473](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1473)

***

### scores

> **scores**: [`Score`](Score.md)[]

Resulting scores of the submission

#### Source

[src/database.ts:1481](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1481)

***

### time

> **time**: `number`

Time of submission, UNIX milliseconds

#### Source

[src/database.ts:1475](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1475)

***

### username

> `readonly` **username**: `string`

Username of submitter

#### Source

[src/database.ts:1471](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1471)

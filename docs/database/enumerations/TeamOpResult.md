[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / TeamOpResult

# Enumeration: TeamOpResult

Response codes for operations involving team data

## Enumeration Members

### CONTEST\_ALREADY\_EXISTS

> **CONTEST\_ALREADY\_EXISTS**: `4`

The operation failed because the requested contest is already a registration

#### Source

[src/database.ts:1329](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1329)

***

### CONTEST\_CONFLICT

> **CONTEST\_CONFLICT**: `2`

The operation failed because the requested contest is on exclude list of other registration

#### Source

[src/database.ts:1325](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1325)

***

### CONTEST\_MEMBER\_LIMIT

> **CONTEST\_MEMBER\_LIMIT**: `3`

The operation failed because the member count exceeds limits in a registration

#### Source

[src/database.ts:1327](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1327)

***

### ERROR

> **ERROR**: `7`

The operation failed because of an unexpected issue

#### Source

[src/database.ts:1335](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1335)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `5`

The operation failed because of an authentication failure

#### Source

[src/database.ts:1331](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1331)

***

### NOT\_ALLOWED

> **NOT\_ALLOWED**: `6`

The operation failed because of an unspecified restriction

#### Source

[src/database.ts:1333](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1333)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `1`

The operation failed because the reqested account, team, or contest does not exist

#### Source

[src/database.ts:1323](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1323)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Source

[src/database.ts:1321](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1321)

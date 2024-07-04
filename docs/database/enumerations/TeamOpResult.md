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

[src/database.ts:1293](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1293)

***

### CONTEST\_CONFLICT

> **CONTEST\_CONFLICT**: `2`

The operation failed because the requested contest is on exclude list of other registration

#### Source

[src/database.ts:1289](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1289)

***

### CONTEST\_MEMBER\_LIMIT

> **CONTEST\_MEMBER\_LIMIT**: `3`

The operation failed because the member count exceeds limits in a registration

#### Source

[src/database.ts:1291](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1291)

***

### ERROR

> **ERROR**: `7`

The operation failed because of an unexpected issue

#### Source

[src/database.ts:1299](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1299)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `5`

The operation failed because of an authentication failure

#### Source

[src/database.ts:1295](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1295)

***

### NOT\_ALLOWED

> **NOT\_ALLOWED**: `6`

The operation failed because of an unspecified restriction

#### Source

[src/database.ts:1297](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1297)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `1`

The operation failed because the reqested account, team, or contest does not exist

#### Source

[src/database.ts:1287](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1287)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Source

[src/database.ts:1285](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1285)

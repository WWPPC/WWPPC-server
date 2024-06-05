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

[src/database.ts:1359](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1359)

***

### CONTEST\_CONFLICT

> **CONTEST\_CONFLICT**: `2`

The operation failed because the requested contest is on exclude list of other registration

#### Source

[src/database.ts:1355](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1355)

***

### CONTEST\_MEMBER\_LIMIT

> **CONTEST\_MEMBER\_LIMIT**: `3`

The operation failed because the member count exceeds limits in a registration

#### Source

[src/database.ts:1357](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1357)

***

### ERROR

> **ERROR**: `7`

The operation failed because of an unexpected issue

#### Source

[src/database.ts:1365](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1365)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `5`

The operation failed because of an authentication failure

#### Source

[src/database.ts:1361](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1361)

***

### NOT\_ALLOWED

> **NOT\_ALLOWED**: `6`

The operation failed because of an unspecified restriction

#### Source

[src/database.ts:1363](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1363)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `1`

The operation failed because the reqested account, team, or contest does not exist

#### Source

[src/database.ts:1353](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1353)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Source

[src/database.ts:1351](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1351)

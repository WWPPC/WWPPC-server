[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / TeamOpResult

# Enumeration: TeamOpResult

Response codes for operations involving team data

## Enumeration Members

### CONTEST\_ALREADY\_EXISTS

> **CONTEST\_ALREADY\_EXISTS**: `4`

The operation failed because the requested contest is already a registration

#### Defined in

[database.ts:1406](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1406)

***

### CONTEST\_CONFLICT

> **CONTEST\_CONFLICT**: `2`

The operation failed because the requested contest is on exclude list of other registration

#### Defined in

[database.ts:1402](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1402)

***

### CONTEST\_MEMBER\_LIMIT

> **CONTEST\_MEMBER\_LIMIT**: `3`

The operation failed because the member count exceeds limits in a registration

#### Defined in

[database.ts:1404](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1404)

***

### ERROR

> **ERROR**: `7`

The operation failed because of an unexpected issue

#### Defined in

[database.ts:1412](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1412)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `5`

The operation failed because of an authentication failure

#### Defined in

[database.ts:1408](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1408)

***

### NOT\_ALLOWED

> **NOT\_ALLOWED**: `6`

The operation failed because of an unspecified restriction

#### Defined in

[database.ts:1410](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1410)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `1`

The operation failed because the reqested account, team, or contest does not exist

#### Defined in

[database.ts:1400](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1400)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Defined in

[database.ts:1398](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1398)

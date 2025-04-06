[**wwppc-server**](../../README.md)

***

[wwppc-server](../../modules.md) / [database](../README.md) / DatabaseOpCode

# Enumeration: DatabaseOpCode

Response codes for operations involving account data

## Enumeration Members

### CONFLICT

> **CONFLICT**: `409`

The operation failed because the database found existing data that conflicts

#### Defined in

[database.ts:1512](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1512)

***

### ERROR

> **ERROR**: `503`

The operation failed because of an unexpected issue

#### Defined in

[database.ts:1520](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1520)

***

### FORBIDDEN

> **FORBIDDEN**: `403`

The operation failed because the requested action is restricted

#### Defined in

[database.ts:1518](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1518)

***

### NOT\_FOUND

> **NOT\_FOUND**: `404`

The operation failed because the database could not find the requested data

#### Defined in

[database.ts:1514](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1514)

***

### SUCCESS

> **SUCCESS**: `200`

The operation succeeded

#### Defined in

[database.ts:1510](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1510)

***

### UNAUTHORIZED

> **UNAUTHORIZED**: `401`

The operation failed because of an authentication failure

#### Defined in

[database.ts:1516](https://github.com/WWPPC/WWPPC-server/blob/ee3abdd1c71a13a423c7eb75f79ad6723d0eebfc/src/database.ts#L1516)

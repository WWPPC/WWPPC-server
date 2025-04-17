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

[database.ts:1552](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1552)

***

### ERROR

> **ERROR**: `500`

The operation failed because of an unexpected issue

#### Defined in

[database.ts:1560](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1560)

***

### FORBIDDEN

> **FORBIDDEN**: `403`

The operation failed because the requested action is restricted

#### Defined in

[database.ts:1558](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1558)

***

### NOT\_FOUND

> **NOT\_FOUND**: `404`

The operation failed because the database could not find the requested data

#### Defined in

[database.ts:1554](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1554)

***

### SUCCESS

> **SUCCESS**: `200`

The operation succeeded

#### Defined in

[database.ts:1550](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1550)

***

### UNAUTHORIZED

> **UNAUTHORIZED**: `401`

The operation failed because of an authentication failure

#### Defined in

[database.ts:1556](https://github.com/WWPPC/WWPPC-server/blob/240fd8d39aa7a9e87385634bffd25137bc757d0a/src/database.ts#L1556)

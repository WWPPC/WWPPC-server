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

[database.ts:1513](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1513)

***

### ERROR

> **ERROR**: `503`

The operation failed because of an unexpected issue

#### Defined in

[database.ts:1521](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1521)

***

### FORBIDDEN

> **FORBIDDEN**: `403`

The operation failed because the requested action is restricted

#### Defined in

[database.ts:1519](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1519)

***

### NOT\_FOUND

> **NOT\_FOUND**: `404`

The operation failed because the database could not find the requested data

#### Defined in

[database.ts:1515](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1515)

***

### SUCCESS

> **SUCCESS**: `200`

The operation succeeded

#### Defined in

[database.ts:1511](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1511)

***

### UNAUTHORIZED

> **UNAUTHORIZED**: `401`

The operation failed because of an authentication failure

#### Defined in

[database.ts:1517](https://github.com/WWPPC/WWPPC-server/blob/2a0f62ef9a8d6c45bd23ae8a1bcfb9cead6c0088/src/database.ts#L1517)

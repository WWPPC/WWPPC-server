[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / AccountOpResult

# Enumeration: AccountOpResult

Response codes for operations involving account data

## Enumeration Members

### ALREADY\_EXISTS

> **ALREADY\_EXISTS**: `1`

The operation failed because database cannot not overwrite existing account

#### Defined in

[database.ts:1384](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1384)

***

### ERROR

> **ERROR**: `4`

The operation failed because of an unexpected issue

#### Defined in

[database.ts:1390](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1390)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `3`

The operation failed because of an authentication failure

#### Defined in

[database.ts:1388](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1388)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `2`

The operation failed because the requested account does not exist

#### Defined in

[database.ts:1386](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1386)

***

### SESSION\_EXPIRED

> **SESSION\_EXPIRED**: `5`

The operation failed because the RSA-OAEP keys expired

#### Defined in

[database.ts:1392](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1392)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Defined in

[database.ts:1382](https://github.com/WWPPC/WWPPC-server/blob/ed9c7da6b6decb294863e396def82e9a8d81b105/src/database.ts#L1382)

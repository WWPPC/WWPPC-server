[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / AccountOpResult

# Enumeration: AccountOpResult

Response codes for operations involving account data

## Enumeration Members

### ALREADY\_EXISTS

> **ALREADY\_EXISTS**: `1`

The operation failed because database cannot not overwrite existing account

#### Source

[src/database.ts:1271](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1271)

***

### ERROR

> **ERROR**: `4`

The operation failed because of an unexpected issue

#### Source

[src/database.ts:1277](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1277)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `3`

The operation failed because of an authentication failure

#### Source

[src/database.ts:1275](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1275)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `2`

The operation failed because the requested account does not exist

#### Source

[src/database.ts:1273](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1273)

***

### SESSION\_EXPIRED

> **SESSION\_EXPIRED**: `5`

The operation failed because the RSA-OAEP keys expired

#### Source

[src/database.ts:1279](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1279)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Source

[src/database.ts:1269](https://github.com/WWPPC/WWPPC-server/blob/db20055e35fd52dcfa5e227481f94ec317e29b6f/src/database.ts#L1269)

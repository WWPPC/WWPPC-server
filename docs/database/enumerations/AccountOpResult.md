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

[src/database.ts:1307](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1307)

***

### ERROR

> **ERROR**: `4`

The operation failed because of an unexpected issue

#### Source

[src/database.ts:1313](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1313)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `3`

The operation failed because of an authentication failure

#### Source

[src/database.ts:1311](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1311)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `2`

The operation failed because the requested account does not exist

#### Source

[src/database.ts:1309](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1309)

***

### SESSION\_EXPIRED

> **SESSION\_EXPIRED**: `5`

The operation failed because the RSA-OAEP keys expired

#### Source

[src/database.ts:1315](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1315)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Source

[src/database.ts:1305](https://github.com/WWPPC/WWPPC-server/blob/5af5647ee3617fa27e87b8a991f7e99d942ffb71/src/database.ts#L1305)

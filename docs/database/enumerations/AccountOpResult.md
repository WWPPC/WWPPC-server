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

[src/database.ts:1272](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1272)

***

### ERROR

> **ERROR**: `4`

The operation failed because of an unexpected issue

#### Source

[src/database.ts:1278](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1278)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `3`

The operation failed because of an authentication failure

#### Source

[src/database.ts:1276](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1276)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `2`

The operation failed because the requested account does not exist

#### Source

[src/database.ts:1274](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1274)

***

### SESSION\_EXPIRED

> **SESSION\_EXPIRED**: `5`

The operation failed because the RSA-OAEP keys expired

#### Source

[src/database.ts:1280](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1280)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Source

[src/database.ts:1270](https://github.com/WWPPC/WWPPC-server/blob/ad5cd9fce3d5cf381927c08c4923fceefb2a5362/src/database.ts#L1270)

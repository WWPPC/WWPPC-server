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

[src/database.ts:1339](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1339)

***

### ERROR

> **ERROR**: `4`

The operation failed because of an unexpected issue

#### Source

[src/database.ts:1345](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1345)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `3`

The operation failed because of an authentication failure

#### Source

[src/database.ts:1343](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1343)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `2`

The operation failed because the requested account does not exist

#### Source

[src/database.ts:1341](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1341)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Source

[src/database.ts:1337](https://github.com/WWPPC/WWPPC/blob/584aa62fb3ebbd25c8ff645874f2b4225415492a/wwppc-server/src/database.ts#L1337)

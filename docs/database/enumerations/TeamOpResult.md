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

[database.ts:1294](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1294)

***

### CONTEST\_CONFLICT

> **CONTEST\_CONFLICT**: `2`

The operation failed because the requested contest is on exclude list of other registration

#### Defined in

[database.ts:1290](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1290)

***

### CONTEST\_MEMBER\_LIMIT

> **CONTEST\_MEMBER\_LIMIT**: `3`

The operation failed because the member count exceeds limits in a registration

#### Defined in

[database.ts:1292](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1292)

***

### ERROR

> **ERROR**: `7`

The operation failed because of an unexpected issue

#### Defined in

[database.ts:1300](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1300)

***

### INCORRECT\_CREDENTIALS

> **INCORRECT\_CREDENTIALS**: `5`

The operation failed because of an authentication failure

#### Defined in

[database.ts:1296](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1296)

***

### NOT\_ALLOWED

> **NOT\_ALLOWED**: `6`

The operation failed because of an unspecified restriction

#### Defined in

[database.ts:1298](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1298)

***

### NOT\_EXISTS

> **NOT\_EXISTS**: `1`

The operation failed because the reqested account, team, or contest does not exist

#### Defined in

[database.ts:1288](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1288)

***

### SUCCESS

> **SUCCESS**: `0`

The operation was completed successfully

#### Defined in

[database.ts:1286](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/database.ts#L1286)

[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [database](../README.md) / AdminPerms

# Enumeration: AdminPerms

Admin permission level bit flags

## Enumeration Members

### ADMIN

> **ADMIN**: `1`

Base admin permission; allows login

#### Source

[src/database.ts:1306](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1306)

***

### MANAGE\_ACCOUNTS

> **MANAGE\_ACCOUNTS**: `2`

Create, delete, and modify accounts

#### Source

[src/database.ts:1308](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1308)

***

### MANAGE\_ADMINS

> **MANAGE\_ADMINS**: `1073741824`

Manage admin permissions

#### Source

[src/database.ts:1316](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1316)

***

### MANAGE\_CONTESTS

> **MANAGE\_CONTESTS**: `8`

Edit contests and control ContestHost functions

#### Source

[src/database.ts:1312](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1312)

***

### MANAGE\_PROBLEMS

> **MANAGE\_PROBLEMS**: `4`

Edit all problems, both contest and upsolve

#### Source

[src/database.ts:1310](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1310)

***

### MANAGE\_SUBMISSIONS

> **MANAGE\_SUBMISSIONS**: `16`

View and disqualify submissions

#### Source

[src/database.ts:1314](https://github.com/WWPPC/WWPPC-server/blob/7d555ed708ef67895244cc584473d7c0aa4c1395/src/database.ts#L1314)

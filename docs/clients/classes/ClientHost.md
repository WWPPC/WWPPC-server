[**wwppc-server**](../../README.md) • **Docs**

***

[wwppc-server](../../modules.md) / [clients](../README.md) / ClientHost

# Class: ClientHost

Bundles code for client networking into a single class.

## Constructors

### new ClientHost()

> **new ClientHost**(`db`, `app`, `contests`, `upsolve`, `mailer`, `logger`): [`ClientHost`](ClientHost.md)

#### Parameters

• **db**: [`Database`](../../database/classes/Database.md)

Database connection

• **app**: `Express`

Express app (HTTP server) to attach API to

• **contests**: [`ContestManager`](../../contest/classes/ContestManager.md)

Contest manager instance

• **upsolve**: [`UpsolveManager`](../../upsolve/classes/UpsolveManager.md)

Upsolve manager instance

• **mailer**: [`Mailer`](../../email/classes/Mailer.md)

SMTP server connection

• **logger**: [`Logger`](../../log/interfaces/Logger.md)

Logging instance

#### Returns

[`ClientHost`](ClientHost.md)

#### Defined in

[clients.ts:39](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L39)

## Properties

### app

> `readonly` **app**: `Express`

#### Defined in

[clients.ts:20](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L20)

***

### clientEncryption

> `readonly` **clientEncryption**: [`RSAEncryptionHandler`](../../cryptoUtil/classes/RSAEncryptionHandler.md)

#### Defined in

[clients.ts:18](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L18)

***

### contestManager

> `readonly` **contestManager**: [`ContestManager`](../../contest/classes/ContestManager.md)

#### Defined in

[clients.ts:21](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L21)

***

### database

> `readonly` **database**: [`Database`](../../database/classes/Database.md)

#### Defined in

[clients.ts:19](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L19)

***

### logger

> `readonly` **logger**: [`Logger`](../../log/interfaces/Logger.md)

#### Defined in

[clients.ts:24](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L24)

***

### mailer

> `readonly` **mailer**: [`Mailer`](../../email/classes/Mailer.md)

#### Defined in

[clients.ts:23](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L23)

***

### ready

> `readonly` **ready**: `Promise`\<`any`\>

#### Defined in

[clients.ts:29](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L29)

***

### upsolveManager

> `readonly` **upsolveManager**: [`UpsolveManager`](../../upsolve/classes/UpsolveManager.md)

#### Defined in

[clients.ts:22](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L22)

## Methods

### handleSocketConnection()

> **handleSocketConnection**(`s`): `Promise`\<`void`\>

Add normal handlers for a client Socket.IO connection.
Performs authentication with reCAPTCHA, then adds user-specific endpoints over Socket.IO

#### Parameters

• **s**: [`ServerSocket`](../interfaces/ServerSocket.md)

SocketIO connection (with modifications)

#### Returns

`Promise`\<`void`\>

#### Defined in

[clients.ts:100](https://github.com/WWPPC/WWPPC-server/blob/64a61903b5a0f4aa306afe641a1ba5b173736b1a/src/clients.ts#L100)

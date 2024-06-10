import { Socket } from 'socket.io';

import Logger from './log';

/**
 * Socket.IO socket with username, IP, and kick function
 * @ignore
 */
export interface ServerSocket extends Socket {
    kick(reason: string): void
    logWithId(logMethod: (s: string, logOnly?: boolean) => void, message: string, logOnly?: boolean): void
    ip: string
    username: string
}

export function createServerSocket(socket: Socket, ip: string, logger: Logger): ServerSocket {
    const s2 = socket as ServerSocket;
    s2.kick = function (reason) {
        this.logWithId(logger.warn, 'Kicked for violating restrictions: ' + reason);
        socket.removeAllListeners();
        socket.disconnect();
    };
    s2.logWithId = (logMethod, message, logOnly) => {
        logMethod.call(logger, (`${s2.username} @ ${s2.ip} | ${message}`), logOnly);
    };
    s2.ip = ip;
    s2.username = '';
    return s2;
}
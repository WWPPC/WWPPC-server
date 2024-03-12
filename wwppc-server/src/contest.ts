import { Socket } from "socket.io";
export class ContestManager {
    #clients: Set<Socket> = new Set();
    #rooms: Map<string, Set<Socket>> = new Map();
    // all socketio connections are put here (IN A SET NOT AN ARRAY)
    // start/stop rounds, control which problems are where
    // uses database to get problems and then caches them
    // also prevent people from opening the contest page multiple times
    // remember to prevent large file submissions (over 10kb is probably unnecessarily large for these problems)
    // use socket.io rooms
}

export default ContestManager;
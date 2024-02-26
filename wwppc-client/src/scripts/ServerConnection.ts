import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

const socket = io(process.env.NODE_ENV == 'development' ? 'https://localhost:8080' : window.location.host, {
    path: '/socket.io'
});

// i guess also do logins using router

export const useServerConnectionStore = defineStore('socketio', {
    state: () => ({
        socket: socket,
        connected: socket.connected
    }),
    actions: {
        // do stuff here like http requests or pre-written socketio functions
    }
})
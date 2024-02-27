import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { ref } from 'vue';

const socket = io(process.env.NODE_ENV == 'development' ? 'https://localhost:8080' : window.location.host, {
    path: '/socket.io'
});
const connected = ref(false);
const connectError = ref(false);
const loggedIn = ref(false);
socket.on('connect', () => connected.value = true);
socket.on('disconnect', () => connected.value = false);
socket.on('timeout', () => connected.value = false);
socket.on('error', () => connected.value = false);
socket.on('connect_fail', () => connectError.value = true);
socket.on('connect_error', () => connectError.value = true);
const RSA: {
    publicKey: CryptoKey | null,
    sid: number,
    encode(text: string): Promise<ArrayBuffer | string>
} = {
    publicKey: null,
    sid: 0,
    async encode(text) {
        if (RSA.publicKey != null) return await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, RSA.publicKey, new TextEncoder().encode(text));
        else return text;
    }
};
socket.once('getCredentials', async (session) => {
    if (window.crypto.subtle === undefined) {
        console.warn('<h1>Insecure context!</h1><br>The page has been opened in an insecure context and cannot perform encryption processes. Credentials and submissions will be sent in PLAINTEXT!');
    } else {
        RSA.publicKey = await window.crypto.subtle.importKey('jwk', session.key, { name: "RSA-OAEP", hash: "SHA-256" }, false, ['encrypt']);
        RSA.sid = session.session;
    }
});

export const useServerConnectionStore = defineStore('socketio', {
    state: () => ({ socket, connected, connectError, loggedIn }),
    actions: {
        login(username: string, password: string): Promise<boolean> {
            return new Promise((resolve) => {

            });
        }
    }
});
import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { ref } from 'vue';

const socket = io(process.env.NODE_ENV == 'development' ? 'https://localhost:8080' : window.location.host, {
    path: '/socket.io'
});
const loggedIn = ref(false);
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
    state: () => ({ socket, loggedIn }),
    getters: {
        connected() { return socket.connected; },
    },
    actions: {
        login(username: string, password: string): Promise<boolean> {
            return new Promise((resolve) => {

            });
        }
    }
});
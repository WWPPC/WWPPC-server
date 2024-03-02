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
        const sessionCreds = window.localStorage.getItem('sessionCredentials');
        if (sessionCreds != null) {
            const creds = JSON.parse(sessionCreds);
            loggedIn.value = await sendCredentials(creds.username, creds.password, 0) == 0;
        }
    }
});
const sendCredentials = (username: string, password: string | Array<number>, action: 0 | 1): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        if (loggedIn.value) {
            resolve(4);
            return;
        }
        try {
            socket.emit('credentials', {
                action: action,
                username: await RSA.encode(username),
                password: password instanceof Array ? Uint32Array.from(password).buffer : await RSA.encode(password),
            });
            socket.once('credentialRes', (res: number) => {
                resolve(res);
            });
        } catch (err) {
            reject(err);
        }
    });
};

export const useServerConnection = defineStore('socketio', {
    state: () => ({ socket, loggedIn }),
    getters: {
        connected() { return socket.connected; },
    },
    actions: {
        login(username: string, password: string | Array<number>): Promise<number> {
            return sendCredentials(username, password, 0);
        },
        signup(username: string, password: string | Array<number>): Promise<number> {
            return sendCredentials(username, password, 1);
        },
        encode: RSA.encode,
        // shorthands
        emit(event: string, ...data: any[]) {
            return socket.emit(event, ...data);
        },
        on(event: string, handler: (...args: any[]) => void) {
            return socket.on(event, handler);
        },
        once(event: string, handler: (...args: any[]) => void) {
            return socket.once(event, handler);
        },
        off(event: string ,handler: (...args: any[]) => void) {
            return socket.off(event, handler);
        }
    }
});
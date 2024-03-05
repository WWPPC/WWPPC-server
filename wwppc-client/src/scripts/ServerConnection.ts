import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { ref } from 'vue';

// send HTTP wakeup request before trying socket.io
const serverHostname = process.env.NODE_ENV == 'development' ? 'https://localhost:8080' : (process.env.SERVER_HOST ?? window.location.host);
const socket = io(serverHostname, {
    // auth.token doesn't exist what are you talking about
    path: '/socket.io',
    autoConnect: false,
    reconnection: false
});
const connectErrorHandlers: (() => void)[] = [];
fetch(serverHostname + '/wakeup').then(() => {
    socket.connect();
}, () => {
    connectErrorHandlers.forEach(cb => cb());
    connectError.value = true;
});
socket.on('connect_error', () => connectError.value = true);
socket.on('connect_fail', () => connectError.value = true);

const loggedIn = ref(false);
const connectError = ref(false);
const handshakeComplete = ref(false);
let handshakeResolve: (v: any) => void = () => { };
const handshakePromise = new Promise((resolve) => handshakeResolve = resolve);
const manualLogin = ref(true);
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
        // autologin if possible
        if (sessionCreds != null && RSA.sid.toString() === window.localStorage.getItem('sessionId')) {
            const creds = JSON.parse(sessionCreds);
            loggedIn.value = await sendCredentials(creds.username, creds.password, 0) == 0;
            manualLogin.value = false;
        }
        handshakeComplete.value = true;
        handshakeResolve(undefined);
    }
});
const sendCredentials = (username: string, password: string | Array<number>, action: 0 | 1, email?: string, token?: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        if (loggedIn.value) {
            console.warn('Attempted login/signup while logged in');
            resolve(4);
            return;
        }
        try {
            const password2 = password instanceof Array ? Uint32Array.from(password).buffer : await RSA.encode(password);
            socket.emit('credentials', {
                action: action,
                username: await RSA.encode(username),
                password: password2,
                email: email != undefined ? await RSA.encode(email) : undefined,
                token: token != undefined ? await RSA.encode(token) : undefined
            });
            socket.once('credentialRes', async (res: number) => {
                if (res == 0) {
                    window.localStorage.setItem('sessionCredentials', JSON.stringify({
                        username: username,
                        password: password2 instanceof ArrayBuffer ? Array.from(new Uint32Array(password2)) : password2,
                    }));
                    window.localStorage.setItem('sessionId', RSA.sid.toString());
                    loggedIn.value = true;
                }
                resolve(res);
            });
        } catch (err) {
            reject(err);
        }
    });
};

export const useServerConnection = defineStore('socketio', {
    state: () => ({ socket, loggedIn, handshakeComplete, manualLogin, connectError }),
    getters: {
        connected() { return socket.connected; },
        handshakePromise() { return handshakePromise; }
    },
    actions: {
        login(username: string, password: string | Array<number>): Promise<number> {
            return sendCredentials(username, password, 0);
        },
        signup(username: string, password: string, email: string, token: string): Promise<number> {
            return sendCredentials(username, password, 1, email, token);
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
        off(event: string, handler: (...args: any[]) => void) {
            return socket.off(event, handler);
        },
        onconnect(handler: () => void) {
            socket.on('connect', handler);
        },
        onconnecterror(handler: () => void) {
            socket.on('connect_error', handler);
            socket.on('connect_fail', handler);
            connectErrorHandlers.push(handler);
        },
        ondisconnect(handler: () => void) {
            socket.on('disconnect', handler);
            socket.on('timeout', handler);
            socket.on('error', handler);
        }
    }
});

socket.on('connect', () => console.info(`ServerConnection: Connected to ${serverHostname}`));
socket.on('connect_error', () => console.info(`ServerConnection: Connection error for ${serverHostname}`));
socket.on('connect_fail', () => console.info(`ServerConnection: Connection failed for ${serverHostname}`));
socket.on('disconnect', (reason) => console.info(`ServerConnection: Disconnected: ${reason}`));
socket.on('timeout', () => console.info(`ServerConnection: Timed out`));
socket.on('error', (err) => console.info(`ServerConnection: Error: ${err}`));
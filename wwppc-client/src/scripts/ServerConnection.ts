import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { reactive } from 'vue';

// send HTTP wakeup request before trying socket.io
const serverHostname = process.env.NODE_ENV == 'development' ? 'https://localhost:8000' : ('https://wwppc.onrender.com' ?? window.location.host);
const socket = io(serverHostname, {
    // auth.token doesn't exist what are you talking about
    path: '/socket.io',
    autoConnect: false,
    reconnection: false
});
const connectErrorHandlers: (() => void)[] = [];
let connectionAttempts = 0;
const attemptConnect = () => {
    connectionAttempts++;
    fetch(serverHostname + '/wakeup').then(() => {
        socket.connect();
    }, () => {
        if (connectionAttempts <= 5) attemptConnect();
        else {
            console.error(`ServerConnection: Wakeup call failed for ${serverHostname}`);
            connectErrorHandlers.forEach(cb => cb());
            state.connectError = true;
        }
    });
};
attemptConnect();
socket.on('connect_error', () => state.connectError = true);
socket.on('connect_fail', () => state.connectError = true);

let handshakeResolve: (v: any) => void = () => { };
const state = reactive({
    loggedIn: false,
    connectError: false,
    handshakeComplete: false,
    handshakePromise: new Promise((resolve) => handshakeResolve = resolve),
    manualLogin: true
});
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
            state.loggedIn = await sendCredentials(creds.username, creds.password) == 0;
            state.manualLogin = false;
        }
        state.handshakeComplete = true;
        handshakeResolve(undefined);
    }
});
export interface CredentialsSignupData {
    firstName: string
    lastName: string
    email: string
    school: string
    grade: number
    experience: number
    languages: string[]
}
const sendCredentials = (username: string, password: string | Array<number>, token?: string, signupData?: CredentialsSignupData): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        if (state.loggedIn) {
            console.warn('Attempted login/signup while logged in');
            resolve(4);
            return;
        }
        try {
            const password2 = password instanceof Array ? Uint32Array.from(password).buffer : await RSA.encode(password);
            // for some reason RSA encode of ReCaptcha token throws an error
            socket.emit('credentials', {
                username: await RSA.encode(username),
                password: password2,
                token: token,
                signupData: signupData !== undefined ? {
                    firstName: await RSA.encode(signupData.firstName),
                    lastName: await RSA.encode(signupData.lastName),
                    email: await RSA.encode(signupData.email),
                    school: await RSA.encode(signupData.school),
                    grade: signupData.grade,
                    experience: signupData.experience,
                    languages: signupData.languages,
                } : undefined
            });
            socket.once('credentialRes', async (res: number) => {
                if (res == 0) {
                    window.localStorage.setItem('sessionCredentials', JSON.stringify({
                        username: username,
                        password: password2 instanceof ArrayBuffer ? Array.from(new Uint32Array(password2)) : password2,
                    }));
                    window.localStorage.setItem('sessionId', RSA.sid.toString());
                    state.loggedIn = true;
                }
                resolve(res);
            });
        } catch (err) {
            reject(err);
        }
    });
};

export const useServerConnection = defineStore('serverconnection', {
    state: () => state,
    getters: {
        socket() { return socket; },
        connected() { return socket.connected; }
    },
    actions: {
        login(username: string, password: string | Array<number>): Promise<number> {
            return sendCredentials(username, password);
        },
        signup(username: string, password: string, token: string, signupData: CredentialsSignupData): Promise<number> {
            return sendCredentials(username, password, token, signupData);
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
socket.on('connect_error', () => console.error(`ServerConnection: Connection error for ${serverHostname}`));
socket.on('connect_fail', () => console.error(`ServerConnection: Connection failed for ${serverHostname}`));
socket.on('disconnect', (reason) => console.error(`ServerConnection: Disconnected: ${reason}`));
socket.on('timeout', () => console.error(`ServerConnection: Timed out`));
socket.on('error', (err) => console.error(`ServerConnection: Error: ${err}`));
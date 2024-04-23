import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { reactive } from 'vue';

import { useAccountManager } from './AccountManager';
import recaptcha from './recaptcha';

// send HTTP wakeup request before trying socket.io
export const serverHostname = process.env.NODE_ENV == 'development' ? 'https://localhost:8000' : ('https://wwppc.onrender.com' ?? window.location.host);
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
let loginResolve: (v: any) => void = () => { };
const state = reactive<{
    handshakeComplete: boolean
    handshakePromise: Promise<undefined>
    connectError: boolean
    loggedIn: boolean
    loginPromise: Promise<undefined>
    manualLogin: boolean
    encryptedPassword: ArrayBuffer | string | null
}>({
    handshakeComplete: false,
    handshakePromise: new Promise((resolve) => handshakeResolve = resolve),
    connectError: false,
    loggedIn: false,
    loginPromise: new Promise((resolve) => loginResolve = resolve),
    manualLogin: true,
    encryptedPassword: null
});
const RSA: {
    publicKey: CryptoKey | null,
    sid: number,
    encrypt(text: string): Promise<ArrayBuffer | string>
} = {
    publicKey: null,
    sid: 0,
    async encrypt(text) {
        if (RSA.publicKey != null) return await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, RSA.publicKey, new TextEncoder().encode(text));
        else return text;
    }
};

export enum AccountOpResult {
    SUCCESS = 0,
    ALREADY_EXISTS = 1,
    NOT_EXISTS = 2,
    INCORRECT_CREDENTIALS = 3,
    ERROR = 4
}
export const getAccountOpMessage = (res: number): string => {
    return res == AccountOpResult.SUCCESS ? 'Success' : res == AccountOpResult.ALREADY_EXISTS ? 'Account with username already exists' : res == AccountOpResult.NOT_EXISTS ? 'Account not found' : res == AccountOpResult.INCORRECT_CREDENTIALS ? 'Incorrect credentials' : res == AccountOpResult.ERROR ? 'Database error' : 'Unknown error (this is a bug?)';
};
export interface CredentialsSignupData {
    firstName: string
    lastName: string
    email: string
    school: string
    grade: number
    experience: number
    languages: string[]
}

// RSA keys + autologin
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
            const res = await sendCredentials(creds.username, creds.password, await recaptcha.execute('autologin'));
            if (res == AccountOpResult.SUCCESS) {
                state.loggedIn = true;
                state.manualLogin = false;
            } else {
                window.localStorage.removeItem('sessionCredentials');
                window.localStorage.removeItem('sessionId');
            }
        }
        state.handshakeComplete = true;
        handshakeResolve(undefined);
    }
});
export const sendCredentials = async (username: string, password: string | number[], token: string, signupData?: CredentialsSignupData): Promise<AccountOpResult> => {
    return await new Promise(async (resolve, reject) => {
        if (state.loggedIn) {
            console.warn('Attempted login/signup while logged in');
            resolve(AccountOpResult.ERROR);
            return;
        }
        try {
            const accountManager = useAccountManager();
            const password2 = password instanceof Array ? Uint32Array.from(password).buffer : await RSA.encrypt(password);
            socket.emit('credentials', {
                username: await RSA.encrypt(username),
                password: password2,
                token: token,
                signupData: signupData !== undefined ? {
                    firstName: await RSA.encrypt(signupData.firstName),
                    lastName: await RSA.encrypt(signupData.lastName),
                    email: await RSA.encrypt(signupData.email),
                    school: await RSA.encrypt(signupData.school),
                    grade: signupData.grade,
                    experience: signupData.experience,
                    languages: signupData.languages,
                } : undefined
            });
            socket.once('credentialRes', async (res: AccountOpResult) => {
                if (res === AccountOpResult.SUCCESS) {
                    window.localStorage.setItem('sessionCredentials', JSON.stringify({
                        username: username,
                        password: password2 instanceof ArrayBuffer ? Array.from(new Uint32Array(password2)) : password2,
                    }));
                    state.encryptedPassword = password2;
                    window.localStorage.setItem('sessionId', RSA.sid.toString());
                    state.loggedIn = true;
                    loginResolve(undefined);
                    accountManager.username = username;
                    accountManager.updateOwnUserData();
                }
                resolve(res);
            });
        } catch (err) {
            socket.removeAllListeners('credentialRes')
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
        RSAencrypt: RSA.encrypt,
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
        removeAllListeners(event: string) {
            socket.removeAllListeners(event);
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
socket.on('disconnect', (reason) => { console.error(`ServerConnection: Disconnected: ${reason}`); socket.disconnect(); });
socket.on('timeout', () => { console.error(`ServerConnection: Timed out`); socket.disconnect(); });
socket.on('error', (err) => { console.error(`ServerConnection: Error: ${err}`); socket.disconnect(); });
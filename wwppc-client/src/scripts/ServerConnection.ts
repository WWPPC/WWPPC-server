import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { reactive } from 'vue';

import { globalModal } from '@/components/ui-defaults/UIDefaults';

import { useAccountManager } from './AccountManager';
import recaptcha from './recaptcha';

// send HTTP wakeup request before trying socket.io
export const serverHostname = process.env.NODE_ENV == 'development' ? 'https://localhost:8000' : 'https://server.wwppc.tech';
export const socket = io(serverHostname, {
    path: '/web-socketio',
    autoConnect: false,
    reconnection: false
});
let connectionAttempts = 0;
const connectAttemptHandlers: Set<() => any> = new Set();
const connectErrorHandlers: Set<() => any> = new Set();
const attemptConnect = () => {
    connectionAttempts++;
    connectAttemptHandlers.forEach((h) => h());
    fetch(serverHostname + '/wakeup').then(() => {
        socket.connect();
        apiFetch('GET', '/config').then((config: { maxProfileImgSize: number, acceptedLanguages: string[], maxSubmissionSize: number } | Error) => {
            if (config instanceof Error) {
                console.error('Failed to fetch server config!');
                const modal = globalModal();
                modal.showModal({ title: 'Failed to fetch server config!', content: 'The server configuration could not be fetched! This may cause issues with the website!', color: 'red' });
            } else state.serverConfig = config;
        });
    }, () => {
        console.info(`HTTP wakeup failed, retrying in ${10 * connectionAttempts} seconds...`);
        setTimeout(attemptConnect, 10000 * connectionAttempts);
        state.connectError = true;
        connectErrorHandlers.forEach((h) => h());
    });
};

let handshakeResolve: (v: any) => void = () => { };
let loginResolve: (v: any) => void = () => { };
const state = reactive<{
    handshakeComplete: boolean
    handshakePromise: Promise<undefined>
    connectError: boolean
    loggedIn: boolean
    loginPromise: Promise<undefined>
    manualLogin: boolean,
    encryptedPassword: ArrayBuffer | string | null,
    serverConfig: {
        maxProfileImgSize: number,
        acceptedLanguages: string[],
        maxSubmissionSize: number
    }
}>({
    handshakeComplete: false,
    handshakePromise: new Promise((resolve) => handshakeResolve = resolve),
    connectError: false,
    loggedIn: false,
    loginPromise: new Promise((resolve) => loginResolve = resolve),
    manualLogin: true,
    encryptedPassword: null,
    serverConfig: {
        maxProfileImgSize: 65535,
        acceptedLanguages: [
            "java8",
            "java17",
            "java21",
            "c",
            "cpp11",
            "cpp17",
            "cpp20",
            "py-3-6-9"
        ],
        maxSubmissionSize: 10240
    }
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
    ERROR = 4,
    NOT_CONNECTED = 5
}
export enum TeamOpResult {
    SUCCESS = 0,
    NOT_EXISTS = 1,
    CONTEST_CONFLICT = 2,
    CONTEST_MEMBER_LIMIT = 3,
    CONTEST_ALREADY_EXISTS = 4,
    INCORRECT_CREDENTIALS = 5,
    NOT_ALLOWED = 6,
    ERROR = 7,
    NOT_CONNECTED = 5
}
export const getAccountOpMessage = (res: number): string => {
    return res == AccountOpResult.SUCCESS ? 'Success' : res == AccountOpResult.ALREADY_EXISTS ? 'Account already exists' : res == AccountOpResult.NOT_EXISTS ? 'Account not found' : res == AccountOpResult.INCORRECT_CREDENTIALS ? 'Incorrect credentials' : res == AccountOpResult.ERROR ? 'Internal error' : res == AccountOpResult.NOT_CONNECTED ? 'Not connected to server' : 'Unknown response code (this is a bug?)';
};
export const getTeamOpMessage = (res: number): string => {
    return res == TeamOpResult.SUCCESS ? 'Success' : res == TeamOpResult.NOT_EXISTS ? 'Account, team, or contest not found' : res == TeamOpResult.CONTEST_CONFLICT ? 'Conflict with other registration' : res == TeamOpResult.CONTEST_MEMBER_LIMIT ? 'Too many team members' : res == TeamOpResult.CONTEST_ALREADY_EXISTS ? 'Already registered' : res == TeamOpResult.NOT_ALLOWED ? 'Not allowed (unspecified)' : res == TeamOpResult.ERROR ? 'Internal error' : res == AccountOpResult.NOT_CONNECTED ? 'Not connected to server' : 'Unknown response code (this is a bug?)';
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
socket.on('getCredentials', async (session) => {
    if (state.handshakeComplete) return;
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
            resolve(AccountOpResult.NOT_CONNECTED);
            return;
        }
        try {
            const accountManager = useAccountManager();
            const password2 = password instanceof Array ? Uint32Array.from(password).buffer : await RSA.encrypt(password);
            const res: AccountOpResult = await socket.emitWithAck('credentials', {
                username: username,
                password: password2,
                token: token,
                signupData: signupData !== undefined ? {
                    firstName: signupData.firstName,
                    lastName: signupData.lastName,
                    email: signupData.email,
                    school: signupData.school,
                    grade: signupData.grade,
                    experience: signupData.experience,
                    languages: signupData.languages,
                } : undefined
            });
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
        } catch (err) {
            reject(err);
        }
    });
};

const apiPath = serverHostname + '/api';
export const apiFetch = async (method: 'GET' | 'POST', path: string, body?: string): Promise<any | Error> => {
    try {
        const res = await fetch(apiPath + (path.startsWith('/') ? path : ('/' + path)), {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: body != undefined ? JSON.stringify(body) : undefined
        });
        if (res.ok) return await res.json();
        return new Error(res.status + (res.statusText != '' ? ' - ' + res.statusText : ''));
    } catch (err) {
        if (err instanceof Error) return err;
        return new Error('' + err);
    }
};

export const useServerConnection = defineStore('serverconnection', {
    state: () => state,
    getters: {
        socket: () => socket,
        connected: () => socket.connected
    },
    actions: {
        RSAencrypt: RSA.encrypt,
        apiFetch: apiFetch,
        // shorthands
        emit(event: string, ...data: any) {
            return socket.emit(event, ...data);
        },
        emitWithAck(event: string, ...data: any): Promise<any> {
            return socket.emitWithAck(event, ...data);
        },
        on(event: string, handler: (...args: any[]) => any) {
            return socket.on(event, handler);
        },
        once(event: string, handler: (...args: any[]) => any) {
            return socket.once(event, handler);
        },
        off(event: string, handler: (...args: any[]) => any) {
            return socket.off(event, handler);
        },
        removeAllListeners(event: string) {
            socket.removeAllListeners(event);
        },
        onattemptconnect(handler: () => boolean | void | Promise<boolean | void>) {
            const h = () => {
                if (handler()) connectAttemptHandlers.delete(h);
            };
            connectAttemptHandlers.add(h);
        },
        onconnect(handler: () => boolean | void | Promise<boolean | void>) {
            const h = () => {
                if (handler()) socket.off('connect', h);
            };
            socket.on('connect', h);
        },
        onconnecterror(handler: () => boolean | void | Promise<boolean | void>) {
            const h = () => {
                if (handler()) {
                    socket.off('connect_error', h);
                    socket.off('connect_fail', h);
                    connectErrorHandlers.delete(h);
                }
            };
            socket.on('connect_error', h);
            socket.on('connect_fail', h);
            connectErrorHandlers.add(h);
        },
        ondisconnect(handler: () => boolean | void | Promise<boolean | void>) {
            const h = () => {
                if (handler()) {
                    socket.off('disconnect', h);
                    socket.off('timeout', h);
                    socket.off('error', h);
                }
            };
            socket.on('disconnect', h);
            socket.on('timeout', h);
            socket.on('error', h);
        }
    }
});

const onConnectError = (message: string) => {
    console.error(`ServerConnection: Connection ${message} for ${serverHostname}`);
    state.connectError = true;
};
const onDisconnected = (message: string) => {
    console.error(`ServerConnection: ${message}`);
    console.info('ServerConnection: Reconnecting...');
    state.handshakeComplete = false;
    state.handshakePromise = new Promise((resolve) => handshakeResolve = resolve);
    state.loginPromise = new Promise((resolve) => loginResolve = resolve);
    state.loggedIn = false;
    state.manualLogin = true;
    connectionAttempts = 0;
    setTimeout(attemptConnect, 5000);
};
socket.on('connect', () => {
    state.connectError = false;
    console.info(`ServerConnection: Connected to ${serverHostname}`);
});
socket.on('connect_error', () => onConnectError('error'));
socket.on('connect_fail', () => onConnectError('failed'));
socket.on('disconnect', (reason) => onDisconnected('Disconnected: ' + reason));
socket.on('timeout', () => onDisconnected('Timed out'));
socket.on('error', (err) => onDisconnected('Error: ' + err));

window.addEventListener('load', attemptConnect);
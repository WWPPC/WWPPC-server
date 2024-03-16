import { defineStore } from "pinia";
import { reactive } from "vue";
import { sendCredentials, type CredentialsSignupData, useServerConnection } from "./ServerConnection";

export type Registration = {
    contest: 'WWPIT' | 'WWPHacks'
    division: number
}
export interface AccountData {
    username: string
    email: string
    firstName: string
    lastName: string
    displayName: string
    profileImage: string
    bio: string
    school: string
    grade: number
    experience: number
    languages: string[]
    registrations: Registration[]
}
export const toDivName = (division: number) => {
    return division == 1 ? 'Advanced' : (division == 0 ? 'Novice' : 'Unknown');
};

const state = reactive<AccountData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    profileImage: '',
    bio: '',
    school: '',
    grade: 0,
    experience: 0,
    languages: [],
    registrations: []
});
export const useAccountManager = defineStore('accountManager', {
    state: () => state,
    actions: {
        login(username: string, password: string | Array<number>): Promise<number> {
            return sendCredentials(username, password);
        },
        signup(username: string, password: string, token: string, signupData: CredentialsSignupData): Promise<number> {
            return sendCredentials(username, password, token, signupData);
        },
        signOut() {
            window.localStorage.removeItem('sessionCredentials');
            window.localStorage.removeItem('sessionId');
            window.location.replace('/home');
        },
        async getUserData() {
            // get stuff
        },
        async writeUserData() {
            // write new user data to the thing
        }
    }
});

window.addEventListener('load', () => {
    const serverConnection = useServerConnection();
    serverConnection.handshakePromise.then(() => {
        serverConnection.on('credentialRes', (res: number) => {
            if (res == 0) serverConnection.emit('getOwnUserData');
        });
    });
});
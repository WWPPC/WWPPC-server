import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';

import { AccountOpResult, type CredentialsSignupData, sendCredentials, useServerConnection } from './ServerConnection';

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

export interface Registration {
    contest: string,
    completed: boolean
}

// dropdown options keep getting reused
export const gradeMaps = [
    { text: 'Pre-High School', value: '8' },
    { text: '9', value: '9' },
    { text: '10', value: '10' },
    { text: '11', value: '11' },
    { text: '12', value: '12' },
    { text: 'College Student', value: '13' },
    { text: 'Graduated', value: '14' }
];
export const experienceMaps = [
    { text: 'Beginner / AP CS A', value: '0' },
    { text: 'Intermediate / USACO Silver / Codeforces 1500', value: '1' },
    { text: 'Good / USACO Gold / Codeforces 1900', value: '2' },
    { text: 'Advanced / USACO Platinum / Codeforces Grandmaster', value: '3' },
    { text: 'Cracked / IOI / USACO Camp', value: '4' },
];
export const languageMaps = [
    { text: 'Python', value: 'python' },
    { text: 'C', value: 'c' },
    { text: 'C++', value: 'cpp' },
    { text: 'C#', value: 'cs' },
    { text: 'Java', value: 'java' },
    { text: 'JavaScript', value: 'js' },
    { text: 'SQL', value: 'sql' },
    { text: 'Assembly', value: 'asm' },
    { text: 'PHP', value: 'php' },
    { text: 'Swift', value: 'swift' },
    { text: 'Pascal', value: 'pascal' },
    { text: 'Ruby', value: 'python' },
    { text: 'Rust', value: 'rust' },
    { text: 'Scratch', value: 'scratch' },
    { text: 'LabVIEW', value: 'ev3' },
    { text: 'Kotlin', value: 'ktx' },
    { text: 'Lua', value: 'lua' },
    { text: 'Bash', value: 'bash' },
];

export function validateCredentials(username: string, password: string): boolean {
    return username.trim().length > 0 && password.trim().length > 0 && username.length <= 16 && password.length <= 1024 && /^[a-z0-9\-_=+]+$/.test(username);
}

const unsaved = ref(false);
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
watch(state, () => unsaved.value = true);
export const useAccountManager = defineStore('accountManager', {
    state: () => state,
    getters: {
        unsavedChanges: () => unsaved.value
    },
    actions: {
        async login(username: string, password: string | number[], token: string): Promise<AccountOpResult> {
            return await sendCredentials(username, password, token);
        },
        async signup(username: string, password: string, token: string, signupData: CredentialsSignupData): Promise<AccountOpResult> {
            return await sendCredentials(username, password, token, signupData);
        },
        async changePassword(password: string, newPassword: string, token: string): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve, reject) => {
                try {
                    serverConnection.emit('changeCredentials', {
                        password: await serverConnection.RSAencrypt(password),
                        newPassword: await serverConnection.RSAencrypt(newPassword),
                        token: token
                    });
                    serverConnection.once('credentialRes', (res: AccountOpResult) => resolve(res));
                } catch (err) {
                    serverConnection.removeAllListeners('credentialRes');
                    reject(err);
                }
            });
        },
        async deleteAccount(password: string, token: string): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve, reject) => {
                try {
                    serverConnection.emit('deleteCredentials', {
                        password: await serverConnection.RSAencrypt(password),
                        token: token
                    });
                    serverConnection.once('credentialRes', (res: AccountOpResult) => resolve(res));
                } catch (err) {
                    serverConnection.removeAllListeners('credentialRes');
                    reject(err);
                }
            });
        },
        async requestRecovery(username: string, email: string, token: string): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve, reject) => {
                try {
                    serverConnection.emit('requestRecovery', {
                        username: await serverConnection.RSAencrypt(username),
                        email: await serverConnection.RSAencrypt(email),
                        token: token
                    });
                    serverConnection.once('credentialRes', (res: AccountOpResult) => resolve(res));
                } catch (err) {
                    serverConnection.removeAllListeners('credentialRes');
                    reject(err);
                }
            });
        },
        async recoverAccount(username: string, recoveryPassword: string, newPassword: string, token: string): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve, reject) => {
                try {
                    serverConnection.emit('recoverCredentials', {
                        username: await serverConnection.RSAencrypt(username),
                        recoveryPassword: await serverConnection.RSAencrypt(recoveryPassword),
                        newPassword: await serverConnection.RSAencrypt(newPassword),
                        token: token
                    });
                    serverConnection.once('credentialRes', (res: AccountOpResult) => resolve(res));
                } catch (err) {
                    serverConnection.removeAllListeners('credentialRes');
                    reject(err);
                }
            });
        },
        signout() {
            window.localStorage.removeItem('sessionCredentials');
            window.localStorage.removeItem('sessionId');
            window.location.replace('/home');
        },
        async getUserData(username: string): Promise<AccountData | null> {
            const serverConnection = useServerConnection();
            if (!serverConnection.handshakeComplete) return null;
            return await new Promise((resolve) => {
                const token = Math.random();
                serverConnection.emit('getUserData', { username, token });
                const handle = ({ data, token: token2 }: { data: AccountData | null, token: number }) => {
                    if (token2 != token) return;
                    resolve(data);
                    serverConnection.off('userData', handle);
                };
                serverConnection.on('userData', handle);
            });
        },
        async updateOwnUserData(): Promise<boolean> {
            const dat = await this.getUserData(this.username);
            if (dat != null) {
                this.email = dat.email;
                this.firstName = dat.firstName;
                this.lastName = dat.lastName;
                this.displayName = dat.displayName;
                this.profileImage = dat.profileImage;
                this.bio = dat.bio;
                this.school = dat.school;
                this.grade = dat.grade;
                this.experience = dat.experience;
                this.languages = dat.languages;
                this.registrations = dat.registrations;
                setTimeout(() => unsaved.value = false);
                return true;
            }
            return false;

        },
        async writeUserData(): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.INCORRECT_CREDENTIALS;
            return await new Promise(async (resolve) => {
                serverConnection.emit('setUserData', {
                    password: serverConnection.encryptedPassword,
                    data: {
                        firstName: await serverConnection.RSAencrypt(this.firstName),
                        lastName: await serverConnection.RSAencrypt(this.lastName),
                        displayName: await serverConnection.RSAencrypt(this.displayName),
                        profileImage: this.profileImage,
                        bio: await serverConnection.RSAencrypt(this.bio),
                        school: await serverConnection.RSAencrypt(this.school),
                        grade: this.grade,
                        experience: this.experience,
                        languages: this.languages
                    }
                });
                serverConnection.once('setUserDataResponse', (res: AccountOpResult) => {
                    if (res == AccountOpResult.SUCCESS) unsaved.value = false;
                    resolve(res);
                });
            });
        }
    }
});
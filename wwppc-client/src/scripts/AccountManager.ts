import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { useServerConnection, sendCredentials } from "./ServerConnection";
import type { Registration } from "./ContestManager";

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
        async login(username: string, password: string | Array<number>, token: string): Promise<AccountOpResult> {
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
        signOut() {
            window.localStorage.removeItem('sessionCredentials');
            window.localStorage.removeItem('sessionId');
            window.location.replace('/home');
        },
        async getUserData(username: string): Promise<AccountData | null> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return null;
            return await new Promise((resolve) => {
                const token = Math.random();
                serverConnection.emit('getUserData', { username, token });
                const handle = ({ data, token: token2 }: { data: AccountData | null, token: number }) => {
                    if (token2 != token) return;
                    resolve(data);
                    serverConnection.off('userdata', handle);
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
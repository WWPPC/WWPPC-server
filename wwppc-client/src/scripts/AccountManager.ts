import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { sendCredentials, type CredentialsSignupData, useServerConnection, AccountOpResult } from "./ServerConnection";

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
export type Registration = {
    contest: 'WWPIT' | 'WWPHacks'
    division: number
    name: string
}
export const toDivName = (division: number) => {
    return division == 1 ? 'Advanced' : (division == 0 ? 'Novice' : 'Unknown');
};

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
        async login(username: string, password: string | Array<number>): Promise<number> {
            return await sendCredentials(username, password);
        },
        async signup(username: string, password: string, token: string, signupData: CredentialsSignupData): Promise<number> {
            return await sendCredentials(username, password, token, signupData);
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
                serverConnection.emit('getUserData', { username });
                serverConnection.once('userData', (data: AccountData | null) => resolve(data));
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
                        firstName: await serverConnection.RSAencode(this.firstName),
                        lastName: await serverConnection.RSAencode(this.lastName),
                        displayName: await serverConnection.RSAencode(this.displayName),
                        profileImage: this.profileImage,
                        bio: await serverConnection.RSAencode(this.bio),
                        school: await serverConnection.RSAencode(this.school),
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
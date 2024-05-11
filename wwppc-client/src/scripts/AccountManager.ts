import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';

import { AccountOpResult, type CredentialsSignupData, sendCredentials, socket, useServerConnection } from './ServerConnection';

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
    registrations: string[]
    pastRegistrations: string[]
    team: string
}

export interface TeamData {
    teamName: string
    teamBio: string
    teamMembers: string[]
    teamJoinCode: string | null
}

type ExtendedAccountData = AccountData & TeamData;

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
    { text: 'Beginner', value: '0' },
    { text: 'Intermediate', value: '1' },
    { text: 'Advanced', value: '2' },
    { text: 'Legendary', value: '3' },
    { text: '???', value: '4' },
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
const unsaved2 = ref(false);
const state = reactive<ExtendedAccountData>({
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
    registrations: [],
    pastRegistrations: [],
    team: '',
    teamName: '',
    teamMembers: [],
    teamBio: '',
    teamJoinCode: ''
});
watch(() => ([state.firstName, state.lastName, state.displayName, state.bio, state.school, state.grade, state.experience, state.languages]), () => unsaved.value = true);
watch(() => [state.teamName, state.teamBio], () => unsaved2.value = true);
export const useAccountManager = defineStore('accountManager', {
    state: () => state,
    getters: {
        unsavedChanges: () => unsaved.value,
        unsavedTeamChanges: () => unsaved2.value
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
            if (!serverConnection.handshakeComplete || serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve, reject) => {
                try {
                    serverConnection.emit('requestRecovery', {
                        username: username,
                        email: email,
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
            if (!serverConnection.handshakeComplete || serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve, reject) => {
                try {
                    serverConnection.emit('recoverCredentials', {
                        username: username,
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
            const res: AccountData | null = await serverConnection.apiFetch('GET', '/userData/' + username);
            return res;
        },
        async getTeamData(username: string): Promise<TeamData | null> {
            const serverConnection = useServerConnection();
            const res: { id: string, name: string, bio: string, members: string[], joinCode: string } | null = await serverConnection.apiFetch('GET', '/teamData/' + username);
            return res == null ? null : { teamName: res.name, teamBio: res.bio, teamMembers: res.members, teamJoinCode: res.joinCode };
        },
        async writeUserData(): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve) => {
                serverConnection.emit('setUserData', {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    displayName: this.displayName,
                    profileImage: this.profileImage,
                    bio: this.bio,
                    school: this.school,
                    grade: this.grade,
                    experience: this.experience,
                    languages: this.languages
                });
                serverConnection.once('setUserDataResponse', (res: AccountOpResult) => {
                    if (res == AccountOpResult.SUCCESS) unsaved.value = false;
                    resolve(res);
                });
            });
        },
        async writeTeamData(): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve) => {
                serverConnection.emit('setTeamData', {
                    teamName: this.teamName,
                    teamBio: this.teamBio
                });
                serverConnection.once('teamActionResponse', (res: AccountOpResult) => {
                    if (res == AccountOpResult.SUCCESS) unsaved2.value = false;
                    resolve(res);
                });
            });
        },
        async updateOwnUserData(): Promise<boolean> {
            const dat = await this.getUserData(this.username);
            const dat2 = await this.getTeamData(this.username);
            if (dat != null && dat2 != null) {
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
                this.pastRegistrations = dat.pastRegistrations;
                this.team = dat.team;
                this.teamName = dat2.teamName;
                this.teamMembers = dat2.teamMembers;
                this.teamBio = dat2.teamBio;
                setTimeout(() => {
                    unsaved.value = false;
                    unsaved2.value = false;
                });
                return true;
            }
            return false;

        },
        async joinTeam(joinCode: string, token: string): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve) => {
                serverConnection.emit('joinTeam', { code: joinCode, token: token });
                serverConnection.once('teamActionResponse', (res: AccountOpResult) => resolve(res));
            });
        },
        async leaveTeam(): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve) => {
                serverConnection.emit('leaveTeam');
                serverConnection.once('teamActionResponse', (res: AccountOpResult) => resolve(res));
            });
        },
        async registerContest(contest: string, token: string): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve) => {
                serverConnection.emit('registerContest', { contest: contest, token: token });
                serverConnection.once('registerContestResponse', (res: AccountOpResult) => resolve(res));
            });
        },
        async unregisterContest(contest: string): Promise<AccountOpResult> {
            const serverConnection = useServerConnection();
            if (!serverConnection.loggedIn) return AccountOpResult.ERROR;
            return await new Promise(async (resolve) => {
                serverConnection.emit('registerContest', { contest: contest });
                serverConnection.once('registerContestResponse', (res: AccountOpResult) => resolve(res));
            });
        }

    }
});

// prevent circular dependency nuke
window.addEventListener('DOMContentLoaded', () => {
    socket.on('teamJoinCode', (code: string) => {
        state.teamJoinCode = code;
    });
});
import { defineStore } from "pinia";
import { reactive } from "vue";
import { useServerConnection } from "./ServerConnection";

export type Registration = {
    contest: 'WWPIT' | 'WWPHacks'
    division: number
}
export const toDivName = (division: number) => {
    return division == 1 ? 'Advanced' : (division == 0 ? 'Novice' : 'Unknown');
};

const state = reactive({
    username: '',
    profileImage: '',
    registrations: new Array<Registration>()
});
export const useAccountManager = defineStore('accountManager', {
    state: () => state,
    actions: {

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
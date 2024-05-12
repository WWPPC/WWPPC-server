import { defineStore } from 'pinia';
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ModalMode } from '@/components/ui-defaults/FullscreenModal.vue';
import { globalModal } from '@/components/ui-defaults/UIDefaults';

import { useServerConnection } from './ServerConnection';

const state = reactive<{
    connectionInclude: Set<string>
    connectionExclude: Set<string>
    connectionIncludeExact: Set<string>
    connectionExcludeExact: Set<string>
    loginInclude: Set<string>
    loginExclude: Set<string>
    loginIncludeExact: Set<string>
    loginExcludeExact: Set<string>
}>({
    connectionInclude: new Set(),
    connectionExclude: new Set(),
    connectionIncludeExact: new Set(),
    connectionExcludeExact: new Set(),
    loginInclude: new Set(),
    loginExclude: new Set(),
    loginIncludeExact: new Set(),
    loginExcludeExact: new Set()
});

let initialized = false;
export const useConnectionEnforcer = defineStore('connectionenforcer', {
    state: () => state,
    actions: {
        init() {
            if (initialized) return;
            initialized = true;
            const serverConnection = useServerConnection();
            const modal = globalModal();
            const route = useRoute();
            const router = useRouter();
            const checkConnection = () => {
                const trimmed = route.path.replace(/\/*$/, '');
                return (Array.from(state.connectionInclude.values()).some((p) => trimmed.startsWith(p)) || Array.from(state.connectionIncludeExact.values()).some((p) => trimmed == p))
                    && !(Array.from(state.connectionExclude.values()).some((p) => trimmed.startsWith(p)) || Array.from(state.connectionExcludeExact.values()).some((p) => trimmed == p));
            };
            const showConnectError = () => {
                if (!checkConnection() || route.query.ignore_server !== undefined) return;
                const m = modal.showModal({
                    title: 'Connect Error',
                    content: 'Could not connect to the server. Attempting to reconnect.<br>Click YES to reload.',
                    mode: ModalMode.INPUT,
                    color: 'red'
                });
                serverConnection.onconnecterror(() => { m.cancel(); return true; });
                serverConnection.once('connect', () => m.cancel());
                m.result.then((v) => v === true && window.location.reload());
            };
            const showDisconnected = () => {
                if (!checkConnection() || route.query.ignore_server !== undefined) return;
                const m = modal.showModal({
                    title: 'Disconnected',
                    content: 'You were disconnected from the server. Attempting to reconnect.<br>Click YES to reload.',
                    mode: ModalMode.INPUT,
                    color: 'red'
                });
                serverConnection.onconnecterror(() => { m.cancel(); return true; });
                serverConnection.once('connect', () => m.cancel());
                m.result.then((v) => v === true && window.location.reload());
                if (checkLogin()) router.replace({ path: '/login', query: { redirect: route.fullPath, clearQuery: 1 } });
            };
            const checkLogin = () => {
                const trimmed = route.path.replace(/\/*$/, '');
                return (!serverConnection.loggedIn && Array.from(state.loginInclude.values()).some((p) => trimmed.startsWith(p)) || Array.from(state.loginIncludeExact.values()).some((p) => trimmed == p))
                    && !(Array.from(state.loginExclude.values()).some((p) => trimmed.startsWith(p)) || Array.from(state.loginExcludeExact.values()).some((p) => trimmed == p));
            };
            serverConnection.onconnecterror(showConnectError);
            serverConnection.ondisconnect(showDisconnected);
            watch(() => route.params, () => {
                if (serverConnection.connectError) showConnectError();
                if (serverConnection.handshakeComplete && !serverConnection.connected) showDisconnected();
                if (checkLogin() && route.query.ignore_server === undefined) router.replace({ path: '/login', query: { redirect: route.fullPath, clearQuery: 1 }});
            });
        }
    }
})
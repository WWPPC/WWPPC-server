import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import PageHome from './pages/PageHome.vue';
import { io } from 'socket.io-client';
import { nextTick } from 'vue';

const socket = io(process.env.NODE_ENV == 'development' ? 'https://localhost:8080' : window.location.host, {
    path: '/socket.io'
});
// socket.once('getCredentials', async (session) => {
//     if (window.crypto.subtle === undefined) {
//         modal('Insecure context', 'The page has been opened in an insecure context and cannot perform encryption processes. Credentials and submissions will be sent in PLAINTEXT!');
//     } else {
//         window.publicKey = await window.crypto.subtle.importKey('jwk', session.key, { name: "RSA-OAEP", hash: "SHA-256" }, false, ['encrypt']);
//         window.sid = session.session;
//     }
// });
// async function RSAencode(text: string) {
//     if (window.publicKey) return await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, window.publicKey, new TextEncoder().encode(text));
//     else return text;
// }

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: PageHome }
    ]
});

const app = createApp(PageHome);
app.use(router);
app.mount('#root');
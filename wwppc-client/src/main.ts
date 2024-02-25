import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import PageHome from './pages/PageHome.vue';
import { io } from 'socket.io-client';
// import { nextTick } from 'vue';

const socket = io(process.env.NODE_ENV == 'development' ? 'https://localhost:8080' : window.location.host, {
    path: '/socket.io'
});
// use pinia for socketio stuff

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: PageHome }
    ]
});

const app = createApp(PageHome);
app.use(router);
app.mount('#root');
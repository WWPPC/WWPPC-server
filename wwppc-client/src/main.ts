import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import PageHackathon from './pages/PageHackathon.vue';
import PageContest from './pages/PageContest.vue';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: App },
        { path: '/:sub', component: App },
        { path: '/contest/problems/:pid', component: PageContest }
    ]
});
app.use(pinia);
app.use(router);
app.mount('#root');
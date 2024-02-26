import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import { PanelMain } from './components/panels/PanelManager';

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: App },
        {
            path: '/:page',
            components: { App, PanelMain },
            children: [
                {
                    path: ':panel',
                    component: PanelMain
                }
            ]
        },
    ]
});
app.use(pinia);
app.use(router);
app.mount('#root');
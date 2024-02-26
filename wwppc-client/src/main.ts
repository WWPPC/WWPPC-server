import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import { PanelBody } from './components/panels/PanelManager';

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', components: { App, PanelBody } },
        {
            path: '/:page',
            component: App,
            children: [
                {
                    path: ':panel',
                    component: PanelBody
                }
            ]
        },
    ]
});
app.use(pinia);
app.use(router);
app.mount('#root');
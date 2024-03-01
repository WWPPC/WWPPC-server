import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import { PanelBody, PanelNavButton } from './components/panels/PanelManager';

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', components: { App, PanelBody } },
        {
            path: '/:page',
            components: { App, PanelNavButton },
            children: [{
                path: ':panel',
                components: { PanelBody, PanelNavButton },
                children: [{
                    path: ':probDiv-:probRound-:probNum',
                    component: PanelBody
                }]
            }]
        },
    ]
});
router.beforeEach((to, from, next) => {
    if (Object.keys(to.query).length == 0 && Object.keys(from.query).length > 0) {
        next({ ...to, query: from.query });
    } else {
        next();
    }
});
app.use(pinia);
app.use(router);
app.mount('#root');
import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import { PanelBody, PanelNavButton } from './components/panels/PanelManager';
import { VueReCaptcha } from 'vue-recaptcha-v3'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        {
            path: '/:page',
            components: { App, PanelNavButton },
            children: [{
                path: ':panel',
                components: { PanelBody, PanelNavButton },
                children: [{
                    path: ':probDiv-:probRound-:probNum',
                    component: PanelBody
                }],
            }]
        }
    ]
});
let handledRoute = false;
router.beforeEach((to, from, next) => {
    // keep old queries unless cleared
    if (to.query.clearQuery !== undefined) {
        next({ ...to, query: { ...to.query, clearQuery: undefined, ignore_server: from.query.ignore_server || to.query.ignore_server } });
    } else if (handledRoute) {
        next();
    } else {
        next({ ...to, query: { ...to.query, ...from.query, clearQuery: undefined } });
    }
    handledRoute = true;
});
router.afterEach(() => {
    handledRoute = false;
});
app.use(router);
// app.use(VueReCaptcha, { siteKey: '6LfvsYgpAAAAAKi_E0IgDfIb7BCZKYfSlphYTNem' });
VueReCaptcha.install(app, { siteKey: '6LfvsYgpAAAAAKi_E0IgDfIb7BCZKYfSlphYTNem', loaderOptions: {} });
app.mount('#root');
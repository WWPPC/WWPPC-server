import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import { PanelBody, PanelNavButton } from '@/components/panels/PanelManager';
import VueKatex from '@hsorby/vue3-katex';
import 'katex/dist/katex.min.css';
import { VueReCaptcha } from 'vue-recaptcha-v3';
import PagePanelAccountRegistrations from '@/pages/account/PagePanelAccountRegistrations.vue';

const app = createApp(App)
.use(VueKatex, {
  globalOptions: {
  }
});
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
                children: [
                    {
                        path: ':probDiv-:probRound-:probNum',
                        component: PanelBody
                    },
                    {
                        path: 'new/:contestName',
                        component: PagePanelAccountRegistrations
                    }
                ],
            }]
        },
        {
            path: '/team/:viewTeam',
            components: { }
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
VueReCaptcha.install(app, { siteKey: '6LfvsYgpAAAAAKi_E0IgDfIb7BCZKYfSlphYTNem', loaderOptions: {} });
app.mount('#root');
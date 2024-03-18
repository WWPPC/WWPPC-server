import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import 'katex/dist/katex.min.css';
import { VueReCaptcha } from 'vue-recaptcha-v3';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        // not the right way to do this (but oh well)
        {
            // uhhh this causes error because of bug
            // path: '/:page(^(?:(?!contest).)*$)',
            path: '/:page',
            components: { App },
            children: [{
                path: ':panel',
                components: { App }
            }]
        },
        {
            path: '/:page(contest)',
            components: { App },
            children: [{
                path: ':contestName',
                children: [
                    {
                        path: ':panel',
                        components: { App }
                    },
                    {
                        path: ':panel(problemView)/:problemId',
                        components: { App }
                    }
                ]
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
VueReCaptcha.install(app, { siteKey: '6LfvsYgpAAAAAKi_E0IgDfIb7BCZKYfSlphYTNem', loaderOptions: {} });
app.mount('#root');
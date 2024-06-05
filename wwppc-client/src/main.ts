import './assets/main.css';
import 'katex/dist/katex.min.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';

import App from '@/App.vue';

import recaptcha from './scripts/recaptcha';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        // not the right way to do this (but oh well)
        {
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
            children: [
                {
                    path: ':panel',
                    components: { App }
                },
                {
                    path: ':panel(problemView)/:problemId',
                    components: { App }
                },
                {
                    path: ':panel(problemView)/:problemRound(\\d+)_:problemNumber(\\d+)',
                    components: { App }
                },
                {
                    path: ':panel(archive)/:archiveContest',
                    components: { App },
                    children: [{
                        path: ':archiveRound',
                        components: { App },
                        children: [{
                            path: ':archiveProblem',
                            components: { App }
                        }]
                    }]
                },
                {
                    path: ':panel(archiveView)/:archiveContest/:archiveRound/:archiveProblem',
                    components: { App }
                }
            ]
        },
        {
            path: '/:page(user)/@:userView',
            components: { App }
        },
        // spaghetti
        {
            path: '/:catchAll+',
            components: { App }
        }
    ]
});
let handledRoute = false;
router.beforeEach((to, from, next) => {
    // keep old queries unless cleared
    if (to.query.clearQuery !== undefined) {
        next({ ...to, query: { ...to.query, clearQuery: undefined, ignore_server: (from.query.ignore_server !== undefined || to.query.ignore_server !== undefined) ? null : undefined } });
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
app.mount('#root');

recaptcha.loaded().then(() => console.log('reCAPTCHA loaded'));
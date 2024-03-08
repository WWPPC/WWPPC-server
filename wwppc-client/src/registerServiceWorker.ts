/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        offline() {
            console.warn('Offline! This page is not meant to run offline, and there may be problems!')
        }
    });
}

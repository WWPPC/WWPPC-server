// Copyright (C) 2024 Sampleprovider(sp)

// COPIED FROM SOUND TILE
// spsquared/sound-tile
self.addEventListener('install', (e) => {
    e.waitUntil(new Promise(async (resolve, reject) => {
        const cache = await caches.open('page');
        await cache.addAll([
            // '/',
            // '/common/common.js',
            // '/common/common.css',
            // '/socket.io/socket.io.js',
            // '/common/loadingCover.html',
            // '/common/panels.js',
            // '/index.html',
            // '/index.js',
            // '/index.css',
            // '/login/index.html',
            // '/login/index.js',
            // '/login/index.css',
            // '/contest/index.html',
            // '/contest/index.js',
            // '/contest/index.css',
            // '/admin/index.html',
            // '/admin/index.js',
            // '/admin/index.css',
            // '/assets/noise.png',
            // '/assets/SourceCodePro.ttf',
            // '/assets/timer.svg',
            // '/assets/timer.svg',
            // '/assets/',
        ]);
        self.skipWaiting();
        resolve();
    }));
});
self.addEventListener("activate", (e) => {
    let activate = async () => {
        await Promise.all((await caches.keys()).filter((key) => key != 'page').map((key) => caches.delete(key)));
        await self.registration.navigationPreload?.enable();
        await self.clients.claim();
    }
    e.waitUntil(activate());
});
let getCached = async (request, preloadResponse) => {
    try {
        const cache = await caches.open('page');
        // serve from cache while also updating the cache if possible
        const cached = await cache.match(request);
        if (cached !== undefined) {
            updateCache(cache, request, undefined);
            return cached;
        } else {
            return await updateCache(cache, request, preloadResponse);
        }
    } catch (err) {
        console.error(err)
        return new Response('cache error', {
            status: 502,
            headers: { "Content-Type": "text/plain" }
        });
    }
};
let updateCache = async (cache, request, preloadResponse) => {
    try {
        const preloaded = await preloadResponse;
        if (preloaded !== undefined && preloaded.ok) {
            cache.put(request.url, preloaded.clone());
            return preloaded;
        }
    } finally {
        try {
            const networked = await fetch(request);
            if (networked.ok) cache.put(request.url, networked.clone());
            return networked;
        } catch (err) {
            console.error(err)
            return new Response('timed out', {
                status: 408,
                headers: { "Content-Type": "text/plain" }
            });
        }
    }
};
self.addEventListener("fetch", (e) => {
    if (e.request.method != 'GET') return;
    if (e.request.url.startsWith(self.location.origin)) {
        e.respondWith(getCached(e.request, e.preloadResponse));
    } else {
        try {
            e.respondWith(fetch(e.request));
        } catch (err) {
            console.error(err)
            return new Response('timed out', {
                status: 408,
                headers: { "Content-Type": "text/plain" }
            });
        }
    }
});
// also sound tile copy paste

self.addEventListener('install', (e) => {
    e.waitUntil(new Promise(async (resolve) => {
        const pageCache = await caches.open('page');
        await pageCache.addAll([
            '/',
            '/index.html',
            '/favicon.png',
            '/logo.svg',
            '/icon.svg',
            '/icon2.png'
        ]);
        self.skipWaiting();
        resolve();
    }))
});
self.addEventListener("activate", (e) => {
    let activate = async () => {
        await self.registration.navigationPreload?.enable();
        await self.clients.claim();
    };
    e.waitUntil(activate());
});
let getCached = async (request, preloadResponse) => {
    try {
        const cache = await caches.open('page');
        // serve from cache while also updating the cache if possible
        const cached = await cache.match(request);
        if (cached !== undefined) {
            await preloadResponse;
            updateCache(cache, request, undefined);
            return cached;
        } else {
            return await updateCache(cache, request, preloadResponse);
        }
    } catch (err) {
        console.error(err);
        return new Response('cache error', {
            status: 502,
            headers: { "Content-Type": "text/plain" }
        });
    }
};
let updateCache = async (cache, request, preloadResponse) => {
    if (preloadResponse != undefined) {
        try {
            const preloaded = await preloadResponse;
            if (preloaded !== undefined && preloaded.ok) {
                cache.put(request.url, preloaded.clone());
                return preloaded;
            }
        } catch { /* no */ }
    }
    try {
        const networked = await fetch(request);
        if (networked.ok) cache.put(request.url, networked.clone());
        return networked;
    } catch (err) {
        console.error(err);
        return new Response('timed out', {
            status: 408,
            headers: { "Content-Type": "text/plain" }
        });
    }
};
self.addEventListener("fetch", (e) => {
    if (e.request.method == 'GET' && e.request.url.startsWith(self.location.origin)) {
        e.respondWith(getCached(e.request, e.preloadResponse));
    }
});
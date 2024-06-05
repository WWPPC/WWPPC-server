// cache
self.addEventListener('install', (e) => {
    e.waitUntil(new Promise(async (resolve) => {
        const pageCache = await caches.open('page');
        await pageCache.addAll([
            '/',
            '/index.html',
            '/favicon.png',
            '/logo.svg',
            '/icon.svg',
            '/icon2.png',
            '/icon2-small.png'
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
            updateCache(cache, request);
            return cached;
        } else {
            return await updateCache(cache, request, await preloadResponse);
        }
    } catch (err) {
        console.error(err);
        return new Response('cache error (try reloading?)', {
            status: 502,
            headers: { "Content-Type": "text/plain" }
        });
    }
};
let updateCache = async (cache, request, preloaded) => {
    if (preloaded !== undefined && preloaded.ok) {
        cache.put(request.url, preloaded.clone());
        return preloaded;
    }
    try {
        const networked = await fetch(request);
        if (networked.ok) cache.put(request.url, networked.clone());
        return networked;
    } catch (err) {
        console.error(err);
        return new Response('offline', {
            status: 502,
            headers: { "Content-Type": "text/plain" }
        });
    }
};
const noCacheList = ['/admin', '/api', '/web-socketio'];
self.addEventListener("fetch", (e) => {
    if (e.request.method == 'GET' && e.request.url.startsWith(self.location.origin) && !noCacheList.some((path) => e.request.url.startsWith(self.location.origin + path))) {
        e.respondWith(getCached(e.request, e.preloadResponse));
    }
});
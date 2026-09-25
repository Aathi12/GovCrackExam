const CACHE_NAME = 'govcrackexam-cache-v1';

// Assets to precache during install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/analogy-word-number.html',
    '/blood-relations.html',
    '/classification-odd-one-out.html',
    '/coded-language.html',
    '/dictionary-order.html',
    '/letter-cluster-analogy-series.html',
    '/mathematical-operations.html',
    '/number-figure-series.html',
    '/syllogism.html',
    '/css/styles.css',
    '/js/app.js',
    '/data/questions.json',
    '/data/frequency.json',
    '/data/metadata.json',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/404.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .catch(err => console.error('Failed to precache assets:', err))
    );
});

self.addEventListener('activate', event => {
    // Delete old caches that belong to this app but don't match the current CACHE_NAME
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName.startsWith('govcrackexam-cache-') && cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Only handle GET requests and same-origin requests (for caching)
    if (event.request.method !== 'GET' || url.origin !== location.origin) {
        return; // Pass through natively
    }

    // Network-first for HTML navigation requests
    if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the fresh copy
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Network failed, fallback to cache
                    return caches.match(event.request).then(cachedResponse => {
                        if (cachedResponse) return cachedResponse;
                        // Final fallback for missing HTML if offline
                        return caches.match('/index.html');
                    });
                })
        );
        return;
    }

    // Cache-first for static assets (CSS, JS, JSON, images)
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse; // Return from cache
            }
            // If not in cache, fetch from network and cache it
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return networkResponse;
            }).catch(() => {
                // If it fails (e.g. offline and not in cache), just return a generic response or let it fail
                return new Response('Network error and asset not cached', { status: 408, headers: { 'Content-Type': 'text/plain' } });
            });
        })
    );
});

// Allow the application to trigger a forced update (skip waiting)
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

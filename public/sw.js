self.addEventListener('install', (e) => {
    console.log('[Service worker] Installing Service Worker...', e);
});

self.addEventListener('activate', (e) => {
    console.log('[Service worker] Activating Service Worker...', e);
    return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    console.log('[Service worker] Fetching something...', e);
    e.respondWith(fetch(e.request));
});

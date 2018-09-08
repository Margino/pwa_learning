self.addEventListener('install', (e) => {
    console.log('[Service worker] Installing Service Worker...', e);
});

self.addEventListener('activate', (e) => {
    console.log('[Service worker] Activating Service Worker...', e);
    return self.clients.claim();
});

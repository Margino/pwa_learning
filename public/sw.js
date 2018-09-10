self.addEventListener('install', (e) => {
  console.log('[Service Worker] Installing Service Worker ...', e);
  // use event.waitUntil() because of acync
  e.waitUntil(
      // 'static' is just an arbitraty name for the cache
      caches.open('static')
        .then((cache) => {
            console.log('[Service worker] Precaching App');
            // add files to the cache
            cache.add('/');
            cache.add('/index.html');
            cache.add('/src/js/app.js');
        })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activating Service Worker ...', e);
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
      caches.match(e.request)
        .then((response) => {
            if (response) {
                // get the cached files
                return response;
            } else {
                return fetch(e.request);
            }
        })
  );
});

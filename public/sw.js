const CACHE_STATIC_NAME = 'static-v4';
const CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Installing Service Worker ...', e);
  // use event.waitUntil() because of acync
  e.waitUntil(
      // 'static' is just an arbitraty name for the cache
      caches.open(CACHE_STATIC_NAME)
        .then((cache) => {
            console.log('[Service worker] Precaching App');
            // add files to the cache
            cache.addAll([
                '/',
                '/index.html',
                '/src/js/app.js',
                '/src/js/feed.js',
                '/src/js/promise.js',
                '/src/js/fetch.js',
                '/src/js/material.min.js',
                '/src/css/app.css',
                '/src/css/feed.css',
                '/src/images/main-image.jpg',
                '/src/css/material.indigo-pink.min.css',
                '/src/css/roboto.css',
                '/src/css/icon.css'
            ]);
        })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activating Service Worker ...', e);
  e.waitUntil(
      caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    console.log('[Service worker] Removing old cache.', key);
                    return caches.delete(key);
                }
            }));
        })
  );
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
                // return not cached files
                return fetch(e.request)
                    .then((res) => {
                        // dynamic chace
                        return caches.open(CACHE_DYNAMIC_NAME)
                            .then((cache) => {
                                cache.put(e.request.url, res.clone());
                                return res;
                            })
                    })
                    .catch((err) => {

                    })
            }
        })
  );
});

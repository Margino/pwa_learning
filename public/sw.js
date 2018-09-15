const CACHE_STATIC_NAME = 'static-v13';
const CACHE_DYNAMIC_NAME = 'dynamic-v5';
const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
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
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Installing Service Worker ...', e);
  // use e.waitUntil() because of acync
  e.waitUntil(
      // 'static' is just an arbitraty name for the cache
      caches.open(CACHE_STATIC_NAME)
        .then((cache) => {
            console.log('[Service worker] Precaching App');
            // add files to the cache
            cache.addAll(STATIC_FILES);
        })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activating Service Worker ...', e);
  e.waitUntil(
      caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_STATIC_NAME && key != CACHE_DYNAMIC_NAME) {
                    console.log('[Service worker] Removing old cache.', key);
                    return caches.delete(key);
                }
            }));
        })
  );
  return self.clients.claim();
});

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', (e) => {
    const url = 'https://httpbin.org/get';
    if (e.request.url.indexOf(url) > -1) {
        e.respondWith(
            caches.open(CACHE_DYNAMIC_NAME)
                .then((cache) => {
                    return fetch(e.request)
                        .then((res) => {
                            cache.put(e.request, res.clone());
                            return res;
                        })
                })
        );
    } else if (isInArray(e.request.url, STATIC_FILES)) {
      e.respondWith(
        caches.match(e.request)
      );
    } else {
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
                                return caches.open(CACHE_STATIC_NAME)
                                    .then((cache) => {
                                        if (e.request.headers.get('accept').includes('text/html')) {
                                            return cache.match('/offline.html');
                                        }
                                    })
                            })
                    }
                })
          );
    }

});

// self.addEventListener('fetch', (e) => {
//   e.respondWith(
//       caches.match(e.request)
//         .then((response) => {
//             if (response) {
//                 // get the cached files
//                 return response;
//             } else {
//                 // return not cached files
//                 return fetch(e.request)
//                     .then((res) => {
//                         // dynamic chace
//                         return caches.open(CACHE_DYNAMIC_NAME)
//                             .then((cache) => {
//                                 cache.put(e.request.url, res.clone());
//                                 return res;
//                             })
//                     })
//                     .catch((err) => {
//                         return caches.open(CACHE_STATIC_NAME)
//                             .then((cache) => {
//                                 return cache.match('/offline.html');
//                             })
//                     })
//             }
//         })
//   );
// });

// Cache only
// self.addEventListener('fetch', (e) => {
//     e.respondWith(
//         caches.match(e.request);
//     );
// });

// Network only
// self.addEventListener('fetch', (e) => {
//     e.respondWith(
//         fetch(e.request);
//     );
// });

// Network with cache fallback
// self.addEventListener('fetch', (e) => {
//     e.respondWith(
//         fetch(e.request)
//             // dynamic cache
//             .then((res) => {
//                 return caches.open(CACHE_DYNAMIC_NAME)
//                     .then((cache) => {
//                         cache.put(e.request.url, res.clone());
//                         return res;
//                     })
//             })
//             // if network is unavailable
//             .catch((err) => {
//                 // return 'static' cache
//                 return caches.match(e.request);
//             })
//     );
// });

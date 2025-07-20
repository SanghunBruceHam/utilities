
// Enhanced service worker for better caching and error prevention
const CACHE_NAME = 'utilities-v1';
const urlsToCache = [
  '/',
  '/ko/',
  '/ja/',
  '/en/',
  '/vi/',
  '/favicon.ico',
  '/favicon.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache).catch(err => {
          // Silently fail on cache errors
          console.log('Cache error:', err);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(function() {
          // Return a basic fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return new Response('Page not available offline', {
              status: 200,
              headers: { 'Content-Type': 'text/html' }
            });
          }
        });
      })
  );
});

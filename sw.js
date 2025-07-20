
// Basic service worker to prevent 404 errors
self.addEventListener('install', function(event) {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Claim clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Let the browser handle all fetch events
  return;
});

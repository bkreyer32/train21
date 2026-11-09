/* Replacement for the Train 21 app service worker.
   It was registered from /train21/registerSW.js:
     navigator.serviceWorker.register('/train21/sw.js', { scope: '/train21/' })
   Installing this file clears Cache Storage, drops the registration, and
   reloads open pages onto the static landing page. */
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    self.clients.claim().then(function () {
      return caches.keys();
    }).then(function (keys) {
      return Promise.all(keys.map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.registration.unregister();
    }).then(function () {
      return self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    }).then(function (clients) {
      clients.forEach(function (client) {
        if (typeof client.navigate === 'function') {
          client.navigate(client.url);
        }
      });
    })
  );
});

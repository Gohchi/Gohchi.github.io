async function addResourcesToCache(storeName, resources) {
  const cache = await caches.open(storeName);
  await cache.addAll(resources);
};

self.addEventListener('install', e => {
  e.waitUntil(
    addResourcesToCache(
      'gametracker-store',
      [
        '/gametracker/',
        '/gametracker/index.html',
        '/gametracker/scripts.js',
        '/gametracker/styles.css'
      ]
    )
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;

  e.respondWith(
    caches
      .match(request)
      .then(res => res || fetch(request))
  );
});
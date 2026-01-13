async function addResourcesToCache(storeName, resources) {
  const cache = await caches.open(storeName);
  await cache.addAll(resources);
};

self.addEventListener('install', e => {
  e.waitUntil(
    addResourcesToCache(
      'japanese-store',
      [
        '/japanese/',
        '/japanese/index.html',
        '/japanese/scripts.js',
        '/japanese/styles.css'
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
self.addEventListener('install', e => {
  e.waitUntil(
    addResourcesToCache(
      'gametracker-store',
      [
        '/gametracker/',
        '/gametracker/index.html',
        '/gametracker/scripts.js',
        '/gametracker/styles.css',
        '/gametracker/modules/disgaea-ds/ds.css'
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
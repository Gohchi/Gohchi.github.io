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
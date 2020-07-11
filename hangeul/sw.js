self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('hangeul-store').then(function(cache) {
      return cache.addAll([
        '/hangeul/',
        '/hangeul/index.htm',
        '/hangeul/scripts.js',
        '/hangeul/style.css'
      ]);
    })
  );
 });
 
 self.addEventListener('fetch', function(e) {
   console.log(e.request.url);
   e.respondWith(
     caches.match(e.request).then(function(response) {
       return response || fetch(e.request);
     })
   );
 });
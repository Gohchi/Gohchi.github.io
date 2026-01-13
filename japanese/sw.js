self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('japanese-store')
      .then(function(cache) {
        return cache.addAll([
          '/japanese/',
          '/japanese/index.html',
          '/japanese/scripts.js',
          '/japanese/styles.css',
          '/japanese/manifest.webmanifest',
          '/japanese/register.js',
          '/common.js',
          '/japanese/tools.js',
          '/japanese/components/PhraseToRuby.js',
          '/japanese/components/MainHeader.js',
          '/japanese/components/KanjiWithRuby.js',
          '/japanese/views/Home.js',
          '/japanese/views/Translation.js',
          '/japanese/views/KanaKeyboard.js',
          '/japanese/data/phrases.js',
          '/japanese/data/translations.js',
          '/japanese/data/kanji.js',
          '/cdn/vue.esm-browser.prod.js',
          '/cdn/vue-router.esm-browser.prod.js',
          '/japanese/favicon.ico'
        ]);
      })
  )
});

self.addEventListener('fetch', e => {
  const { request } = e;

  e.respondWith(
    caches
      .match(request)
      .then(res => res || fetch(request))
  );
});
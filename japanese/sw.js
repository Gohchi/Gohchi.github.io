self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('japanese-store')
      .then(function(cache) {
        return cache.addAll([
          '/common.js',
          '/japanese/',
          '/japanese/favicon.ico',
          '/japanese/index.html',
          '/japanese/manifest.webmanifest',
          '/japanese/scripts.js',
          '/japanese/styles.css',
          '/japanese/register.js',
          '/japanese/tools.js',
          '/japanese/components/KanjiWithRuby.js',
          '/japanese/components/MainHeader.js',
          '/japanese/components/PhraseToRuby.js',
          '/japanese/components/SessionHistory.js',
          '/japanese/data/adjectives.js',
          '/japanese/data/conjugate.js',
          '/japanese/data/kana-romaji.js',
          '/japanese/data/kanji.js',
          '/japanese/data/phrases.js',
          '/japanese/data/progress.js',
          '/japanese/data/translations.js',
          '/japanese/data/verbs.js',
          '/japanese/templates/AdjectivesPractice.js',
          '/japanese/templates/VerbsPractice.js',
          '/japanese/views/AdjectivesPractice.js',
          '/japanese/views/CommonPhrases.js',
          '/japanese/views/Home.js',
          '/japanese/views/KanaKeyboard.js',
          '/japanese/views/Translation.js',
          '/japanese/views/VerbsPractice.js',
          '/cdn/vue.esm-browser.prod.js',
          '/cdn/vue-router.esm-browser.prod.js',
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
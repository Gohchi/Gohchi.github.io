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
          '/japanese/store.js',
          '/japanese/styles.css',
          '/japanese/register.js',
          '/japanese/tools.js',
          '/japanese/components/KanjiWithRuby.js',
          '/japanese/components/ListOfItems.js',
          '/japanese/components/MainHeader.js',
          '/japanese/components/PhraseToRuby.js',
          '/japanese/components/SessionHistory.js',
          '/japanese/components/Sources.js',
          '/japanese/data/adjectives.js',
          '/japanese/data/books/berserk.js',
          '/japanese/data/books/eoe.js',
          '/japanese/data/books/index.js',
          '/japanese/data/books/mgs4.js',
          '/japanese/data/conjugate.js',
          '/japanese/data/donate.js',
          '/japanese/data/favorites.js',
          '/japanese/data/kana-romaji.js',
          '/japanese/data/kana.js',
          '/japanese/data/kanji.js',
          '/japanese/data/phrases.js',
          '/japanese/data/progress.js',
          '/japanese/data/roadmap-progress.js',
          '/japanese/data/roadmap.js',
          '/japanese/data/topics.js',
          '/japanese/data/translations.js',
          '/japanese/data/verbs.js',
          '/japanese/data/words.js',
          '/japanese/templates/AdjectivesPractice.js',
          '/japanese/templates/CommonPhrases.js',
          '/japanese/templates/Donate.js',
          '/japanese/templates/Home.js',
          '/japanese/templates/KanaKeyboard.js',
          '/japanese/templates/PrintPractice.js',
          '/japanese/templates/Roadmap.js',
          '/japanese/templates/Topics.js',
          '/japanese/templates/Translations.js',
          '/japanese/templates/VerbsPractice.js',
          '/japanese/views/AdjectivesPractice.js',
          '/japanese/views/CommonPhrases.js',
          '/japanese/views/Donate.js',
          '/japanese/views/Home.js',
          '/japanese/views/KanaKeyboard.js',
          '/japanese/views/PrintPractice.js',
          '/japanese/views/Roadmap.js',
          '/japanese/views/Topics.js',
          '/japanese/views/Translations.js',
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
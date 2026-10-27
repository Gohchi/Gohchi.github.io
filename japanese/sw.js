const CACHE_NAME = 'japanese-store-v1.6';
const CACHE_ASSETS = [
  '/common.js',
  '/japanese/',
  '/japanese/favicon.ico',
  '/japanese/index.html',
  '/japanese/manifest.webmanifest',
  '/japanese/practice.css',
  '/japanese/register.js',
  '/japanese/scripts.js',
  '/japanese/store.js',
  '/japanese/styles.css',
  '/japanese/tools.js',
  '/japanese/images/books.svg',
  '/japanese/images/hiragana.svg',
  '/japanese/images/icons/apple-touch-icon.png',
  '/japanese/images/icons/favicon-96x96.png',
  '/japanese/images/icons/favicon.ico',
  '/japanese/images/icons/favicon.svg',
  '/japanese/images/icons/icon-192.png',
  '/japanese/images/icons/icon-512.png',
  '/japanese/images/icons/web-app-manifest-192x192.png',
  '/japanese/images/icons/web-app-manifest-512x512.png',
  '/japanese/images/kanji-study.svg',
  '/japanese/images/katakana.svg',
  '/japanese/images/keyboard.svg',
  '/japanese/images/me.jpg',
  '/japanese/images/options-tick.svg',
  '/japanese/images/question-file.svg',
  '/japanese/images/sushi.png',
  '/japanese/images/sushi.svg',
  '/japanese/components/FilterMenu.js',
  '/japanese/components/InfoIcons.js',
  '/japanese/components/KanjiPoolMenu.js',
  '/japanese/components/KanjiWithRuby.js',
  '/japanese/components/ListOfItems.js',
  '/japanese/components/MainHeader.js',
  '/japanese/components/PhraseToRuby.js',
  '/japanese/components/SessionHistory.js',
  '/japanese/components/Sources.js',
  '/japanese/components/WordCorner.js',
  '/japanese/data/adjectives.js',
  '/japanese/data/books/berserk.js',
  '/japanese/data/books/eoe.js',
  '/japanese/data/books/index.js',
  '/japanese/data/books/mgs4.js',
  '/japanese/data/codec.js',
  '/japanese/data/conjugate.js',
  '/japanese/data/donate.js',
  '/japanese/data/favorites.js',
  '/japanese/data/feedback.js',
  '/japanese/data/firebase.js',
  '/japanese/data/kana-romaji.js',
  '/japanese/data/kana.js',
  '/japanese/data/kanji.js',
  '/japanese/data/phrases.js',
  '/japanese/data/profile.js',
  '/japanese/data/progress.js',
  '/japanese/data/roadmap-progress.js',
  '/japanese/data/roadmap.js',
  '/japanese/data/sync.js',
  '/japanese/data/topics.js',
  '/japanese/data/topics-read.js',
  '/japanese/data/verbs.js',
  '/japanese/data/words.js',
  '/japanese/templates/AdjectivesPractice.js',
  '/japanese/templates/CommonPhrases.js',
  '/japanese/templates/Donate.js',
  '/japanese/templates/HiraganaPractice.js',
  '/japanese/templates/Home.js',
  '/japanese/templates/KanjiPractice.js',
  '/japanese/templates/KanaKeyboard.js',
  '/japanese/templates/KatakanaPractice.js',
  '/japanese/templates/PrintPractice.js',
  '/japanese/templates/Profile.js',
  '/japanese/templates/Progress.js',
  '/japanese/templates/Roadmap.js',
  '/japanese/templates/Topics.js',
  '/japanese/templates/Translations.js',
  '/japanese/templates/VerbsPractice.js',
  '/japanese/views/AdjectivesPractice.js',
  '/japanese/views/CommonPhrases.js',
  '/japanese/views/Donate.js',
  '/japanese/views/HiraganaPractice.js',
  '/japanese/views/Home.js',
  '/japanese/views/KanjiPractice.js',
  '/japanese/views/KanaKeyboard.js',
  '/japanese/views/KatakanaPractice.js',
  '/japanese/views/PrintPractice.js',
  '/japanese/views/Profile.js',
  '/japanese/views/Progress.js',
  '/japanese/views/Roadmap.js',
  '/japanese/views/Topics.js',
  '/japanese/views/Translations.js',
  '/japanese/views/VerbsPractice.js',
  '/japanese/data/songs/index.js',
  '/japanese/data/songs/akg-world_world_world.js',
  '/cdn/vue.esm-browser.prod.js',
  '/cdn/vue-router.esm-browser.prod.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(CACHE_ASSETS);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const { request } = e;

  e.respondWith(
    caches
      .match(request)
      .then(res => res || fetch(request))
  );
});
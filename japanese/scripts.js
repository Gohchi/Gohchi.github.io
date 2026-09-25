import { createApp, ref } from 'vue';
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';

import Home from 'views/Home.js';
import CommonPhrases from 'views/CommonPhrases.js';
import Translations from 'views/Translations.js';
import KanaKeyboard from 'views/KanaKeyboard.js';
import HiraganaPractice from 'views/HiraganaPractice.js';
import KatakanaPractice from 'views/KatakanaPractice.js';
import KanjiPractice from 'views/KanjiPractice.js';
import VerbsPractice from 'views/VerbsPractice.js';
import AdjectivesPractice from 'views/AdjectivesPractice.js';
import Topics from 'views/Topics.js';
import PrintPractice from 'views/PrintPractice.js';
import Roadmap from 'views/Roadmap.js';
import Donate from 'views/Donate.js';

const app = createApp({});

const NotFound = {
  template: /*html*/`<div class="box"><h2>404</h2><p>That route doesn’t exist.</p></div>`
};

// Routes
const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/roadmap', component: Roadmap, name: 'roadmap' },
  { path: '/common-phrases/:phrase?', component: CommonPhrases, name: 'common-phrases', props: true },
  { path: '/translations/:book?', component: Translations, name: 'translations', props: true },
  { path: '/kana-keyboard', component: KanaKeyboard, name: 'kana-keyboard' },
  { path: '/hiragana-practice', component: HiraganaPractice, name: 'hiragana-practice' },
  { path: '/katakana-practice', component: KatakanaPractice, name: 'katakana-practice' },
  { path: '/kanji-practice', component: KanjiPractice, name: 'kanji-practice' },
  { path: '/verbs-practice', component: VerbsPractice, name: 'verbs-practice' },
  { path: '/adjectives-practice', component: AdjectivesPractice, name: 'adjectives-practice' },
  { path: '/topics/:topic?', component: Topics, name: 'topics', props: true },
  { path: '/print-practice', component: PrintPractice, name: 'print-practice' },
  { path: '/donate', component: Donate, name: 'donate' },
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound }
];

// Router
const router = createRouter({
  history: createWebHashHistory(), // switch to createWebHistory() if you have server rewrite support
  routes,
  scrollBehavior() { return { top: 0 }; }
});

// Global guard (example)
router.beforeEach((to, from, next) => {
  // Example: block negative user ids
  if (to.name === 'user' && Number(to.params.id) < 0) {
    return next({ name: 'select-user' });
  }
  next();
});

app.use(router);

app.mount('#app');
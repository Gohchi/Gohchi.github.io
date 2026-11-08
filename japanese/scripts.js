import { createApp, ref } from 'vue';
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';

import Home from 'views/Home.js';
import CommonPhrases from 'views/CommonPhrases.js';
import Notes from 'views/Notes.js';
import Translations from 'views/Translations.js';
import HiraganaPractice from 'views/HiraganaPractice.js';
import HiraganaKeyboard from 'views/HiraganaKeyboard.js';
import HiraganaWords from 'views/HiraganaWords.js';
import HiraganaListen from 'views/HiraganaListen.js';
import KatakanaPractice from 'views/KatakanaPractice.js';
import KatakanaKeyboard from 'views/KatakanaKeyboard.js';
import KatakanaWords from 'views/KatakanaWords.js';
import KatakanaListen from 'views/KatakanaListen.js';
import KanjiPractice from 'views/KanjiPractice.js';
import VerbsPractice from 'views/VerbsPractice.js';
import AdjectivesPractice from 'views/AdjectivesPractice.js';
import Topics from 'views/Topics.js';
import PrintPractice from 'views/PrintPractice.js';
import SpeechPractice from 'views/SpeechPractice.js';
import Roadmap from 'views/Roadmap.js';
import Progress from 'views/Progress.js';
import Profile from 'views/Profile.js';
import Settings from 'views/Settings.js';
import Donate from 'views/Donate.js';
import Gachamon from 'views/Gachamon.js';
import Admin from 'views/Admin.js';
import { isRouteUnlocked } from 'data/progression.js';
import 'data/keyboard-open.js'; // <html class="keyboard-open"> while a phone keyboard is up

const app = createApp({});

const NotFound = {
  template: /*html*/`<div class="box"><h2>404</h2><p>That route doesn’t exist.</p></div>`
};

// Routes
const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/roadmap', component: Roadmap, name: 'roadmap' },
  { path: '/progress', component: Progress, name: 'progress' },
  { path: '/profile', component: Profile, name: 'profile' },
  { path: '/common-phrases/:phrase?', component: CommonPhrases, name: 'common-phrases', props: true },
  { path: '/notes/:note?', component: Notes, name: 'notes', props: true },
  { path: '/translations/:type?/:id?', component: Translations, name: 'translations', props: true },
  // one route per unit, so each can be unlocked on its own (see MENU in data/progression.js)
  { path: '/hiragana-practice', component: HiraganaPractice, name: 'hiragana-practice' },
  { path: '/hiragana-keyboard', component: HiraganaKeyboard, name: 'hiragana-keyboard' },
  { path: '/hiragana-listen', component: HiraganaListen, name: 'hiragana-listen' },
  { path: '/hiragana-words', component: HiraganaWords, name: 'hiragana-words' },
  { path: '/katakana-practice', component: KatakanaPractice, name: 'katakana-practice' },
  { path: '/katakana-keyboard', component: KatakanaKeyboard, name: 'katakana-keyboard' },
  { path: '/katakana-listen', component: KatakanaListen, name: 'katakana-listen' },
  { path: '/katakana-words', component: KatakanaWords, name: 'katakana-words' },
  { path: '/kanji-meaning', component: KanjiPractice, name: 'kanji-meaning', props: { mode: 'choice' } },
  { path: '/kanji-reading', component: KanjiPractice, name: 'kanji-reading', props: { mode: 'type' } },
  // old links keep working
  { path: '/kana-keyboard', redirect: '/hiragana-keyboard' },
  { path: '/kanji-practice', redirect: '/kanji-meaning' },
  { path: '/verbs-practice', component: VerbsPractice, name: 'verbs-practice' },
  { path: '/adjectives-practice', component: AdjectivesPractice, name: 'adjectives-practice' },
  { path: '/topics/:topic?', component: Topics, name: 'topics', props: true },
  { path: '/print-practice', component: PrintPractice, name: 'print-practice' },
  { path: '/speech-practice', component: SpeechPractice, name: 'speech-practice' },
  { path: '/settings', component: Settings, name: 'settings' },
  { path: '/admin', component: Admin, name: 'admin' },
  { path: '/gacha', component: Gachamon, name: 'gacha' },
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
  // Sections that are still locked send you to Progress (see MENU in data/progression.js)
  if (!isRouteUnlocked(to.path)) return next({ path: '/progress' });
  next();
});

app.use(router);

app.mount('#app');
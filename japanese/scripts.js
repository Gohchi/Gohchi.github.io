
import { createApp, ref } from 'vue';
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';

import Home from 'views/Home.js';
import CommonPhrases from 'views/CommonPhrases.js';
import Translations from 'views/Translations.js';
import KanaKeyboard from 'views/KanaKeyboard.js';
import VerbsPractice from 'views/VerbsPractice.js';
import Topics from 'views/Topics.js';
import PrintPractice from 'views/PrintPractice.js';
import Donate from 'views/Donate.js';

const app = createApp({});


// Pages (components)
const SelectUser = {
  template: /*html*/`
    <div class="box">
      <h2>Select user</h2>
      <p>Type a user id and jump:</p>
      <input v-model="id" placeholder="e.g. 7" @keyup.enter="go" />
      <button @click="go">Go to /user/:id</button>
    </div>
  `,
  setup(_, { attrs }) {
    const id = ref("");
    const router = useRouter();
    const go = () => {
      if (!id.value) return;
      router.push({ name: 'user', params: { id: id.value }});
    };
    return { id, go };
  }
};

const About = {
  template: /*html*/`
    <div class="box">
      <h2>About</h2>
      <p>This route demonstrates a normal static page.</p>
    </div>
  `
};

const User = {
  // `props: ['id']` via route props (see route def)
  props: ['id'],
  template: /*html*/`
    <div class="box">
      <h2>User {{ id }}</h2>
      <p>Param comes in as a prop thanks to <code>props: true</code>.</p>
      <router-link :to="{ name: 'user', params: { id: Number(id)+1 } }">
        Next user →
      </router-link>
    </div>
  `
};

const NotFound = {
  template: /*html*/`<div class="box"><h2>404</h2><p>That route doesn’t exist.</p></div>`
};

// Routes
const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/common-phrases/:phrase?', component: CommonPhrases, name: 'common-phrases', props: true },
  { path: '/translations/:book?', component: Translations, name: 'translations', props: true },
  { path: '/kana-keyboard', component: KanaKeyboard, name: 'kana-keyboard' },
  { path: '/verbs-practice', component: VerbsPractice, name: 'verbs-practice' },
  { path: '/topics/:topic?', component: Topics, name: 'topics', props: true },
  { path: '/print-practice', component: PrintPractice, name: 'print-practice' },
  { path: '/donate', component: Donate, name: 'donate' },
  { path: '/about', component: About, name: 'about' },
  { path: '/user/:id(\\d+)', component: User, name: 'user', props: true },
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
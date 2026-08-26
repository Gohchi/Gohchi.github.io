
import { createApp, ref } from 'vue';
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';

import Home from 'views/Home.js';

const app = createApp({});

const currentHash = window.location.hash;
if (currentHash && !currentHash.startsWith('#/') && currentHash !== '#') {
  window.location.replace('#/' + currentHash.slice(1));
}

const NotFound = {
  template: /*html*/`<div class="box"><h2>404</h2><p>That route doesn’t exist.</p></div>`
};

// Routes
const routes = [
  {
    path: '/',
    component: Home, name: 'home',
    props: true // passes route params as props
  },
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
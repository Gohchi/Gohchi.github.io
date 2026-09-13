import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import Home from 'views/Home.js';

const app = createApp({});

const NotFound = {
  template: /*html*/`<div class="box"><h2>404</h2><p>That route doesn’t exist.</p></div>`
};

const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 }; }
});

app.use(router);
app.mount('#app');

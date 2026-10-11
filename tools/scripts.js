import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import Mosaic from 'views/Mosaic.js';

const app = createApp({});

const NotFound = {
  template: /*html*/`<div class="box"><h2>404</h2><p>Esa ruta no existe.</p></div>`
};

// Routes
const routes = [
  { path: '/', component: Mosaic, name: 'home' },
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound }
];

// Router
const router = createRouter({
  history: createWebHashHistory(), // switch to createWebHistory() if you have server rewrite support
  routes,
  scrollBehavior() { return { top: 0 }; }
});

app.use(router);

app.mount('#app');
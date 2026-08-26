import { createApp, ref } from 'vue';
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';

import Main from 'components/Main.js';

const app = createApp({});

const NotFound = {
  template: /*html*/`<div class="box"><h2>404</h2><p>That route doesn’t exist.</p></div>`
};

// Routes
const routes = [
  { path: '/', component: Main, name: 'home' },
  // { path: '/translation', component: Translation, name: 'translation' },
  // { path: '/kana-keyboard', component: KanaKeyboard, name: 'kana-keyboard' },
  // { path: '/about', component: About, name: 'about' },
  // {
  //   path: '/user/:id(\\d+)',
  //   component: User,
  //   name: 'user',
  //   props: true // passes route params as props
  // },
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
// // configure menu
// {
//   function configureMenu(id) {
//     const buttonEl = document.getElementById('button-'+id);
//     const menuEl = document.getElementById('menu-'+id);

//     const menu = new mdc.menu.MDCMenu(menuEl);
    
//     buttonEl.addEventListener('click', (event) => {
//       menu.open = !menu.open;
//       menu.setAnchorCorner(mdc.menu.Corner.BOTTOM_LEFT);
//       menu.setAnchorElement(buttonEl);
//     });
//   }

//   configureMenu('sizes');
//   configureMenu('line-styles');
//   configureMenu('bg-color');
//   configureMenu('download');
// }
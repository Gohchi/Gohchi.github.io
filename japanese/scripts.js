
import { createApp, ref } from 'vue';
import { createRouter, createWebHashHistory, useRouter } from 'vue-router';

import Home from 'views/Home.js';
import Translation from 'views/Translation.js';
import KanaKeyboard from 'views/KanaKeyboard.js';

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
        { path: '/translation', component: Translation, name: 'translation' },
        { path: '/kana-keyboard', component: KanaKeyboard, name: 'kana-keyboard' },
        { path: '/about', component: About, name: 'about' },
        {
          path: '/user/:id(\\d+)',
          component: User,
          name: 'user',
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
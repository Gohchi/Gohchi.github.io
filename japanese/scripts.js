
import { createApp } from 'vue';

import { data } from './data/phrases.js';

createApp({
  components: {
  },
  methods: {
  },
  mounted() {
  },
  data() {
    return {
      showMenu: false,
      articles: data,
    }
  },
}).mount('#app');
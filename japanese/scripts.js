
import { createApp } from 'vue';

import PhraseToRuby from './components/PhraseToRuby.js';

import {
  closeDialog,
  extractKanji,
  goTo,
  showDialog,
  showRefsDialog,
  splitByKanji
} from './tools.js';

import { data } from './data/phrases.js';
import { ruby } from './data/kanji.js';
import { translations } from './data/translations.js';

createApp({
  components: {
    PhraseToRuby,
  },
  methods: {
    extractKanji,
    splitByKanji,
    showRefsDialog,
    showDialog,
    closeDialog,
    goTo,
    "goToIndex": function() {
      const index = this.translations.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
    },
  },
  mounted() {
  },
  data() {
    return {
      "showMenu": false,
      "articles": data,
      "ruby": ruby,
      "translations": translations,
      "pageSelected": 1, // Default to the first page
      "hideDisclaimer": false,
      "lang": 'eng', // Default language
      "showTranslation": true,
      "writingDirection": 'yokogaki', // Default writing direction - horizontal writing
    }
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
    type() {
      if (!this.translations[this.pageSelected-1]) {
        return 'unknown';
      }

      return this.page.type;
    },
    title() {
      return this.page.title;
    },
    subtitle() {
      return this.page.subtitle;
    },
    chapters() {
      return this.page.chapters;
    },
    content() {
      return this.page.content;
    },
    footer() {
      return this.page.footer;
    },
    showPageNumber() {
      return !this.page.hidePageNumber;
    },
    pageNumber() {
      return this.pageSelected?.toString().padStart(3, '0');
    },
    first() {
      if (this.pageSelected > this.translations.length) {
        return true; // If the selected page is out of bounds, consider it as the first page
      }
      return this.pageSelected === 1;
    },
    last() {
      if (this.pageSelected > this.translations.length) {
        return true; // If the selected page is out of bounds, consider it as the last page
      }
      return this.pageSelected === this.translations.length;
    }
  }
}).mount('#app');
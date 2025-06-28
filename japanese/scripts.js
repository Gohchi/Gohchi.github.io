
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
    goToIndex() {
      const index = this.translations.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
    },
    openZoom() {
      this.showMenu = false;
      this.prevZoomLevel = this.showZoomMenu;
      this.showZoomMenu = true;
    },
    confirmZoomLevel() {
      this.showZoomMenu = false;
      localStorage.setItem('zoom-level', this.zoomLevel);
    },
    cancelZoomLevel() {
      this.zoomLevel = this.prevZoomLevel;
      this.showZoomMenu = false;
    },
    onZoomChange(e) {
      this.zoomLevel = e.target.value;
    },
    nextPage() {
      document.querySelector('article').scrollTo(0, 0);
      this.pageSelected += 1;
      localStorage.setItem('last-page-visited', this.pageSelected);
    },
    prevPage() {
      document.querySelector('article').scrollTo(0, 0);
      this.pageSelected -= 1;
      localStorage.setItem('last-page-visited', this.pageSelected);
    }
  },
  mounted() {
  },
  data() {
    const zoomLevel = localStorage.getItem('zoom-level');
    const lastPageVisited = localStorage.getItem('last-page-visited');

    return {
      "showMenu": false,
      "articles": data,
      "ruby": ruby,
      "translations": translations,
      "pageSelected": lastPageVisited ?? 4, // Default to the first page
      "hideDisclaimer": true,
      "lang": 'eng', // Default language
      "showTranslation": true,
      "writingDirection": 'yokogaki', // Default writing direction - tategaki | 
      "showZoomMenu": false,
      "zoomLevel": zoomLevel ?? 100,
      "prevZoomLevel": zoomLevel ?? 100,
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
    chapter() {
      return this.page.chapter;
    },
    chapterFirstPage() {
      return this.page.chapterFirstPage;
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
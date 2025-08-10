
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
    speak(text) {
      if (this.voiceActive) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        window.speechSynthesis.speak(utterance);
      }
    },
    goTo,
    goToIndex() {
      const index = this.translations.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
    },
    openZoom() {
      this.showMenu = false;
      this.prevZoomLevel = this.zoomLevel;
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
    },
    switchTranslation() {
      this.showTranslation = !this.showTranslation;
      this.writingDirection = 'yokogaki';
      localStorage.setItem('show-translation', this.showTranslation);
      localStorage.setItem('writing-direction', this.writingDirection);
    },
    setLang(value) {
      this.lang = value;
      localStorage.setItem('lang', value);
    },
    setWritingDirection(value) {
      this.writingDirection = value;
      localStorage.setItem('writing-direction', value);
    }
  },
  mounted() {
  },
  data() {
    const zoomLevel = localStorage.getItem('zoom-level');
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      "showMenu": false,
      "articles": data,
      "ruby": ruby,
      "translations": translations,
      "pageSelected": lastPageVisited ? +lastPageVisited : 1, // Default to the first page
      "hideDisclaimer": true,
      "lang": lang ?? 'eng', // Default language
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki', // Default writing direction - tategaki | yokogaki
      "showZoomMenu": false,
      "zoomLevel": zoomLevel ?? 100,
      "prevZoomLevel": zoomLevel ?? 100,
      "furigana": true,
      "voiceActive": false,
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
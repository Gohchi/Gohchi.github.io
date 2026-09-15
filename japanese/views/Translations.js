import { useRouter } from 'vue-router';

import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import template from 'templates/Translations.js';

import { books, getBookMeta, loadBook } from 'data/books/index.js';

import {
  zoomStore,
  furiganaStore
} from 'store';

export default {
  components: {
    PhraseToRuby,
    MainHeader,
  },
  props: {
    book: String, // route param, undefined = show book picker
  },
  setup(props) {
    const router = useRouter()
    return {
      "router": router,
    };
  },
  methods: {
    goToIndex() {
      const index = this.translations.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
    },
    nextPage() {
      document.querySelector('article').scrollTo(0, 0);
      this.pageSelected += 1;
      localStorage.setItem(this.pageStorageKey, this.pageSelected);
    },
    prevPage() {
      document.querySelector('article').scrollTo(0, 0);
      this.pageSelected -= 1;
      localStorage.setItem(this.pageStorageKey, this.pageSelected);
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
    },
    selectBook(id) {
      this.router.push('translations/' + id);
    },
    backToBookList() {
      this.router.push('/translations');
    },
    async loadSelectedBook(id) {
      this.loadingBook = true;
      this.translations = [];

      const meta = getBookMeta(id);
      if (!meta) {
        this.loadingBook = false;
        return;
      }

      const data = await loadBook(id);
      this.translations = data?.translations || [];

      const lastPageVisited = localStorage.getItem(this.pageStorageKey);
      this.pageSelected = lastPageVisited ? +lastPageVisited : 1;

      this.loadingBook = false;
    },
  },
  watch: {
    book: {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.loadSelectedBook(newId);
        } else {
          this.translations = [];
        }
      },
    },
  },
  data() {
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      books,
      "translations": [],
      "pageSelected": 1,
      "hideDisclaimer": true,
      "lang": lang ?? 'eng',
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki',
      "selectedArticle": null,
      "voices": [],
      "selectedVoice": null,
      "loadingBook": false,
      furiganaStore,
    }
  },
  computed: {
    zoomLevel() {
      return zoomStore.getZoomLevel();
    },
    pageStorageKey() {
      return `last-page-visited:${this.book}`;
    },
    currentBookMeta() {
      return getBookMeta(this.book);
    },
    hasContent() {
      return this.translations.length > 0;
    },
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
    type() {
      if (!this.translations[this.pageSelected-1]) {
        return 'unknown';
      }
      return this.page.type;
    },
    title() { return this.page.title; },
    subtitle() { return this.page.subtitle; },
    chapters() { return this.page.chapters; },
    content() { return this.page.content; },
    footer() { return this.page.footer; },
    showPageNumber() { return !this.page.hidePageNumber; },
    pageNumber() { return this.pageSelected?.toString().padStart(3, '0'); },
    chapter() { return this.page.chapter; },
    chapterFirstPage() { return this.page.chapterFirstPage; },
    first() {
      if (this.pageSelected > this.translations.length) return true;
      return this.pageSelected === 1;
    },
    last() {
      if (this.pageSelected > this.translations.length) return true;
      return this.pageSelected === this.translations.length;
    }
  },
  template
}
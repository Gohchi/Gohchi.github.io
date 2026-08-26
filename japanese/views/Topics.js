import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import template from 'templates/Topics.js';

import { topics } from 'data/topics.js';

import {
  zoomStore,
  furiganaStore
} from 'store';

export default {
  components: {
    PhraseToRuby,
    MainHeader,
  },
  methods: {
    goToIndex() {
      const index = this.topics.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
    },
  },
  mounted() {
  },
  data() {
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      "showMenu": false,
      "topics": topics,
      "pageSelected": lastPageVisited ? +lastPageVisited : 1, // Default to the first page
      "hideDisclaimer": true,
      "lang": lang ?? 'eng', // Default language
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki', // Default writing direction - tategaki | yokogaki
      "selectedArticle": null,
      "voices": [],
      "selectedVoice": null,
      zoomStore,
      furiganaStore
    }
  },
  computed: {
    page() {
      return this.topics[this.pageSelected-1] || {};
    },
    type() {
      if (!this.topics[this.pageSelected-1]) {
        return 'unknown';
      }

      return this.page.type;
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
      if (this.pageSelected > this.topics.length) {
        return true; // If the selected page is out of bounds, consider it as the first page
      }
      return this.pageSelected === 1;
    },
    last() {
      if (this.pageSelected > this.topics.length) {
        return true; // If the selected page is out of bounds, consider it as the last page
      }
      return this.pageSelected === this.topics.length;
    }

  },
  template
}
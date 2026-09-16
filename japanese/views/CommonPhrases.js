import MainHeader from 'components/MainHeader.js';
import PhraseToRuby from 'components/PhraseToRuby.js';
import template from 'templates/CommonPhrases.js';

import {
  zoomStore,
  furiganaStore
} from 'store';

import {
  showDialog,
  closeDialog,
  showRefsDialog,
  speak,
} from 'tools';

import { data } from 'data/phrases.js';

export default {
  components: {
    MainHeader,
    PhraseToRuby,
  },
  methods: {
    showRefsDialog,
    showDialog,
    closeDialog,
    speak,
  },
  data() {
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      "articles": data,
      "pageSelected": lastPageVisited ? +lastPageVisited : 1,
      "hideDisclaimer": true,
      "lang": lang ?? 'eng',
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki',

      "furigana": true,
      "selectedArticle": null,
      furiganaStore,
    }
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
    zoomLevel() {
      return zoomStore.getZoomLevel();
    }
  },
  template,
}
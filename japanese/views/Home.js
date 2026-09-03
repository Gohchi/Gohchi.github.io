import MainHeader from 'components/MainHeader.js';
import PhraseToRuby from 'components/PhraseToRuby.js';
import template from 'templates/Home.js';

import {
  zoomStore,
  furiganaStore
} from 'store';

import {
  showDialog,
  showRefsDialog,
  speak,
} from 'tools';

import { data } from 'data/phrases.js';

export default {
  // setup(props) {
  //   const { text } = toRefs(props);
    
  //   return {
  //     "text": text,
  //   };
  // },
  components: {
    MainHeader,
    PhraseToRuby,
  },
  methods: {
    showRefsDialog,
    showDialog,
    speak,
  },
  data() {
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      "articles": data,
      "pageSelected": lastPageVisited ? +lastPageVisited : 1, // Default to the first page
      "hideDisclaimer": true,
      "lang": lang ?? 'eng', // Default language
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki', // Default writing direction - tategaki | yokogaki

      "furigana": true,
      "selectedArticle": null,
      zoomStore,
      furiganaStore,
    }
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
  },
  template,
}
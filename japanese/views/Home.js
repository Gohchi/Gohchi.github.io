import MainHeader from 'components/MainHeader.js';
import PhraseToRuby from 'components/PhraseToRuby.js';
import template from 'templates/Home.js';

import {
  closeDialog,
  showDialog,
  showRefsDialog,
  speak,
  getVoices,
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
    closeDialog,
    selectVoice(voice) {
      this.selectedVoice = voice;
      this.speak(this.selectedArticle);
    },
    speak(text) {
      speak(text, this.selectedVoice);
    },
    async loadVoices() {
      this.voices = await getVoices();
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
  },
  mounted() {
    this.loadVoices();
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
      "pageSelected": lastPageVisited ? +lastPageVisited : 1, // Default to the first page
      "hideDisclaimer": true,
      "lang": lang ?? 'eng', // Default language
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki', // Default writing direction - tategaki | yokogaki
      "showZoomMenu": false,
      "zoomLevel": zoomLevel ?? 100,
      "prevZoomLevel": zoomLevel ?? 100,
      "furigana": true,
      "selectedArticle": null,
      "voices": [],
      "selectedVoice": null,
    }
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
  },
  template,
}
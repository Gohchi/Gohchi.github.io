import { useRouter } from 'vue-router';

import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import template from 'templates/CommonPhrases.js';

import { phrases } from 'data/phrases.js';
import { getFavorites, toggleFavorite } from 'data/favorites.js';

import {
  zoomStore,
  furiganaStore,
} from 'store';

import { speak } from 'tools';

export default {
  components: {
    PhraseToRuby,
    MainHeader,
  },
  props: {
    phrase: String, // route param id; undefined = show the list
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    selectPhrase(id) {
      this.router.push({ name: 'common-phrases', params: { phrase: id } });
    },
    backToList() {
      this.router.push({ name: 'common-phrases' });
    },
    isFavorite(id) {
      return this.favorites.includes(id);
    },
    toggleFavorite(id) {
      this.favorites = toggleFavorite(id);
    },
    toggleLevel(level) {
      this.selectedLevels = this.selectedLevels.includes(level)
        ? this.selectedLevels.filter(l => l !== level)
        : [...this.selectedLevels, level];
    },
    clearFilters() {
      this.queryText = '';
      this.selectedLevels = [];
      this.favoritesOnly = false;
    },
    speak,
  },
  data() {
    return {
      phrases,
      favorites: getFavorites(),
      queryText: '',
      selectedLevels: [],
      favoritesOnly: false,
      furiganaStore,
    };
  },
  computed: {
    zoomLevel() {
      return zoomStore.getZoomLevel();
    },
    allLevels() {
      return ['N5', 'N4', 'N3', 'N2', 'N1'];
    },
    allPhrases() {
      return Object.values(this.phrases);
    },
    filteredPhrases() {
      return this.allPhrases.filter(item => {
        if (this.favoritesOnly && !this.isFavorite(item.id)) return false;
        if (this.selectedLevels.length && !this.selectedLevels.includes(item.level)) return false;

        if (this.queryText) {
          const query = this.queryText.toLowerCase();
          const matchesJapanese = item.japanese.toLowerCase().includes(query);
          const matchesEnglish = item.english.toLowerCase().includes(query);
          const matchesTags = (item.tags || []).some(tag => tag.toLowerCase().includes(query));
          if (!matchesJapanese && !matchesEnglish && !matchesTags) return false;
        }

        return true;
      });
    },
    currentPhrase() {
      if (!this.phrase) return null;
      return this.phrases[this.phrase] || null;
    },
    relatedPhrases() {
      if (!this.currentPhrase) return [];
      const currentTags = this.currentPhrase.tags || [];
      if (!currentTags.length) return [];

      return this.allPhrases
        .filter(item => item.id !== this.currentPhrase.id)
        .map(item => ({
          ...item,
          sharedTagCount: (item.tags || []).filter(tag => currentTags.includes(tag)).length,
        }))
        .filter(item => item.sharedTagCount > 0)
        .sort((a, b) => b.sharedTagCount - a.sharedTagCount)
        .slice(0, 4);
    },
  },
  template,
}
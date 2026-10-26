import { useRouter } from 'vue-router';

import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import template from 'templates/CommonPhrases.js';

import { phrases } from 'data/phrases.js';
import { getFavorites, toggleFavorite } from 'data/favorites.js';

import {
  zoomStore,
} from 'store';

import { speak } from 'tools';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const SCOPES = [
  { key: 'japanese', label: 'Japanese' },
  { key: 'english', label: 'English' },
  { key: 'tags', label: 'Tags' },
];
const SCOPE_KEYS = SCOPES.map(({ key }) => key);

const LEVELS_KEY = 'common-phrases-levels';
const SCOPE_KEY = 'common-phrases-scope';

const normalize = text => String(text ?? '').toLowerCase();

// View model of a phrase for the cards / the detail header
function describe(phrase, favorites) {
  const tags = phrase.tags || [];
  return {
    phrase,
    id: phrase.id,
    japanese: phrase.japanese,
    english: phrase.english,
    level: phrase.level,
    tags,
    primaryTag: tags[0] || '',
    extraTags: tags.slice(1, 4),
    favorite: favorites.includes(phrase.id),
  };
}

export default {
  components: {
    PhraseToRuby,
    MainHeader,
    FilterMenu,
  },
  props: {
    phrase: String, // route param id; undefined = show the list
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    speak,

    tagLabel(tag) {
      return String(tag).replace(/-/g, ' ');
    },
    selectPhrase(id) {
      // remember where the list was, to come back to the same place
      if (!this.phrase) this.listScroll = window.scrollY;
      this.searchOpen = false;
      this.router.push({ name: 'common-phrases', params: { phrase: id } });
    },
    backToList() {
      this.router.push({ name: 'common-phrases' });
    },
    toggleFavorite(id) {
      this.favorites = toggleFavorite(id);
    },

    // --- filters ---
    setLevels(levels) {
      this.selectedLevels = levels;
      saveSelection(LEVELS_KEY, levels);
    },
    setScope(scope) {
      this.searchScope = scope;
      saveSelection(SCOPE_KEY, scope);
    },
    clearFilters() {
      this.query = '';
      this.category = 'all';
      this.setLevels([...LEVELS]);
      this.setScope([...SCOPE_KEYS]);
    },
    toggleSearch() {
      this.searchOpen = !this.searchOpen;
      if (this.searchOpen) {
        this.$nextTick(() => this.$refs.searchInput && this.$refs.searchInput.focus());
      }
    },
    onSearchEnter() {
      // on mobile this closes the panel (and the keyboard); the filter stays applied
      this.$refs.searchInput && this.$refs.searchInput.blur();
      this.searchOpen = false;
    },
    onSearchEscape() {
      if (this.query) {
        this.query = '';
      } else {
        this.searchOpen = false;
      }
    },

    // --- keyboard: ← → between phrases, Esc back to the list ---
    onKeydown(e) {
      if (!this.currentPhrase) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (document.querySelector('dialog[open]')) return; // Esc closes the kanji dialog first

      if (e.key === 'ArrowLeft' && this.prevPhrase) {
        this.selectPhrase(this.prevPhrase.id);
      } else if (e.key === 'ArrowRight' && this.nextPhrase) {
        this.selectPhrase(this.nextPhrase.id);
      } else if (e.key === 'Escape') {
        this.backToList();
      }
    },
  },
  data() {
    return {
      phrases,
      favorites: getFavorites(),
      listScroll: 0,

      query: '',
      searchOpen: false, // mobile only: panel under the header
      category: 'all', // 'all' | 'favorites' | a tag
      levelOptions: LEVELS.map(level => ({ key: level, label: level })),
      scopeOptions: SCOPES,
      selectedLevels: loadSelection(LEVELS_KEY, LEVELS).filter(l => LEVELS.includes(l)),
      searchScope: loadSelection(SCOPE_KEY, SCOPE_KEYS).filter(s => SCOPE_KEYS.includes(s)),
    };
  },
  computed: {
    zoomLevel() {
      return zoomStore.getZoomLevel();
    },
    allPhrases() {
      return Object.values(this.phrases);
    },
    // lowercase text per phrase, built once
    searchIndex() {
      return this.allPhrases.map(phrase => ({
        phrase,
        japanese: normalize(phrase.japanese),
        english: normalize([phrase.english, ...(phrase.refs || [])].join(' ')),
        tags: normalize((phrase.tags || []).join(' ')),
      }));
    },
    levelsFiltered() {
      return this.selectedLevels.length !== LEVELS.length;
    },
    activeFilterCount() {
      return (this.query.trim() ? 1 : 0)
        + (this.levelsFiltered ? 1 : 0)
        + (this.category !== 'all' ? 1 : 0);
    },
    // search + JLPT levels (the chips are applied on top of this)
    matchedPhrases() {
      const terms = normalize(this.query).split(/\s+/).filter(Boolean);
      // nothing selected in "Search in" behaves like everything selected
      const scope = this.searchScope.length ? this.searchScope : SCOPE_KEYS;

      return this.searchIndex
        .filter(entry => {
          if (this.levelsFiltered && !this.selectedLevels.includes(entry.phrase.level)) return false;
          if (!terms.length) return true;

          const haystack = scope.map(key => entry[key]).join(' ');
          return terms.every(term => haystack.includes(term));
        })
        .map(({ phrase }) => phrase);
    },
    // All, Favorites, then one chip per tag (most used first), with counts for the current search
    categoryOptions() {
      const counts = new Map();
      this.matchedPhrases.forEach(phrase => {
        (phrase.tags || []).forEach(tag => counts.set(tag, (counts.get(tag) || 0) + 1));
      });

      const tagOptions = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([key, count]) => ({ key, label: this.tagLabel(key), count }));

      // keep the selected chip visible even when the search leaves it empty
      if (!['all', 'favorites'].includes(this.category) && !counts.has(this.category)) {
        tagOptions.push({ key: this.category, label: this.tagLabel(this.category), count: 0 });
      }

      return [
        { key: 'all', label: 'All', count: this.matchedPhrases.length },
        {
          key: 'favorites',
          label: '★ Favorites',
          count: this.matchedPhrases.filter(phrase => this.favorites.includes(phrase.id)).length,
        },
        ...tagOptions,
      ];
    },
    filteredPhrases() {
      if (this.category === 'all') return this.matchedPhrases;
      if (this.category === 'favorites') {
        return this.matchedPhrases.filter(phrase => this.favorites.includes(phrase.id));
      }
      return this.matchedPhrases.filter(phrase => (phrase.tags || []).includes(this.category));
    },
    cards() {
      return this.filteredPhrases.map(phrase => describe(phrase, this.favorites));
    },

    // --- detail ---
    currentPhrase() {
      if (!this.phrase) return null;
      return this.phrases[this.phrase] || null;
    },
    currentMeta() {
      return this.currentPhrase ? describe(this.currentPhrase, this.favorites) : null;
    },
    // previous / next follow the current filter (or every phrase if this one is filtered out)
    navList() {
      return this.filteredPhrases.some(item => item.id === this.phrase)
        ? this.filteredPhrases
        : this.allPhrases;
    },
    phraseIndex() {
      return this.navList.findIndex(item => item.id === this.phrase);
    },
    prevPhrase() {
      return this.phraseIndex > 0 ? this.navList[this.phraseIndex - 1] : null;
    },
    nextPhrase() {
      return this.phraseIndex >= 0 && this.phraseIndex < this.navList.length - 1
        ? this.navList[this.phraseIndex + 1]
        : null;
    },
    relatedPhrases() {
      if (!this.currentPhrase) return [];
      const currentTags = this.currentPhrase.tags || [];
      if (!currentTags.length) return [];

      return this.allPhrases
        .filter(item => item.id !== this.currentPhrase.id)
        .map(item => ({
          item,
          sharedTagCount: (item.tags || []).filter(tag => currentTags.includes(tag)).length,
        }))
        .filter(({ sharedTagCount }) => sharedTagCount > 0)
        .sort((a, b) => b.sharedTagCount - a.sharedTagCount)
        .slice(0, 4)
        .map(({ item }) => describe(item, this.favorites));
    },
  },
  watch: {
    phrase(now, before) {
      // back on the list: the router scrolls to the top, so restore after it
      if (!now && before) {
        this.$nextTick(() => requestAnimationFrame(() => window.scrollTo(0, this.listScroll || 0)));
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
  },
  template,
}
import { useRouter } from 'vue-router';

import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import ListOfItems from 'components/ListOfItems.js';
import Sources from 'components/Sources.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import template from 'templates/Topics.js';

import { topics } from 'data/topics.js';

import {
  zoomStore,
} from 'store';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const SCOPES = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
];
const SCOPE_KEYS = SCOPES.map(({ key }) => key);

const LEVELS_KEY = 'topics-levels';
const SCOPE_KEY = 'topics-search-scope';

const normalize = text => String(text ?? '').toLowerCase();

// Everything readable inside a topic besides its title
function contentText(topic) {
  const parts = [topic.subtitle];

  if (typeof topic.content === 'string') {
    parts.push(topic.content);
  } else if (Array.isArray(topic.content)) {
    topic.content.forEach(({ heading, text, example }) => parts.push(heading, text, example));
  }

  if (Array.isArray(topic.items)) {
    topic.items.forEach(({ kanji, kana, meaning, notes }) => parts.push(kanji, kana, meaning, notes));
  }

  return normalize(parts.filter(Boolean).join(' '));
}

export default {
  components: {
    PhraseToRuby,
    MainHeader,
    ListOfItems,
    Sources,
    FilterMenu,
  },
  props: {
    topic: String, // route param slug; undefined = show the preview list
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    selectTopic(id) {
      this.searchOpen = false;
      this.router.push({ name: 'topics', params: { topic: id } });
    },
    backToList() {
      this.router.push({ name: 'topics' });
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
  },
  data() {
    return {
      topics,
      hideDisclaimer: true,

      query: '',
      searchOpen: false, // mobile only: panel under the header
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
    // lowercase title / content text per topic, built once
    searchIndex() {
      return this.topics.map(topic => ({
        topic,
        title: normalize(topic.title),
        content: contentText(topic),
      }));
    },
    levelsFiltered() {
      return this.selectedLevels.length !== LEVELS.length;
    },
    activeFilterCount() {
      return (this.query.trim() ? 1 : 0) + (this.levelsFiltered ? 1 : 0);
    },
    filteredTopics() {
      const terms = normalize(this.query).split(/\s+/).filter(Boolean);
      // nothing selected in "Search in" behaves like everything selected
      const scope = this.searchScope.length ? this.searchScope : SCOPE_KEYS;

      return this.searchIndex
        .filter(({ topic, title, content }) => {
          if (this.levelsFiltered && !(topic.tags || []).some(tag => this.selectedLevels.includes(tag))) {
            return false;
          }
          if (!terms.length) return true;

          const haystack = [
            scope.includes('title') ? title : '',
            scope.includes('content') ? content : '',
          ].join(' ');

          return terms.every(term => haystack.includes(term));
        })
        .map(({ topic }) => topic);
    },
    currentTopic() {
      if (!this.topic) return null;
      return this.topics.find(item => item.id === this.topic) || null;
    },
    relatedTopics() {
      if (!this.currentTopic) return [];
      const currentTags = this.currentTopic.tags || [];
      if (!currentTags.length) return [];

      return this.topics
        .filter(item => item.id !== this.currentTopic.id)
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
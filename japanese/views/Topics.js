import { useRouter } from 'vue-router';

import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import ListOfItems from 'components/ListOfItems.js';
import Sources from 'components/Sources.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import template from 'templates/Topics.js';

import { topics } from 'data/topics.js';
import { getRead, markRead, clearRead } from 'data/topics-read.js';

import {
  zoomStore,
} from 'store';

import { speak } from 'tools';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const LEVEL_RE = /^N[1-5]$/;
const SCOPES = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
];
const SCOPE_KEYS = SCOPES.map(({ key }) => key);

const LEVELS_KEY = 'topics-levels';
const SCOPE_KEY = 'topics-search-scope';

// The first tag of every topic (see TOPIC_META) is its category.
const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'vocabulary', label: 'Vocabulary' },
  { key: 'kanji', label: 'Kanji' },
  { key: 'resource', label: 'Resources' },
];
const CATEGORY_KEYS = CATEGORIES.slice(1).map(({ key }) => key);
const CATEGORY_NAMES = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  kanji: 'Kanji',
  resource: 'Resource',
  other: 'Topic',
};

const TYPES = {
  standard: { icon: '📖', label: 'Lesson' },
  list: { icon: '📋', label: 'List' },
  resource: { icon: '🔗', label: 'Resource' },
};

const normalize = text => String(text ?? '').toLowerCase();

// "Time — 時間" -> { main: 'Time', alt: '時間' }
function splitDash(text) {
  const value = String(text ?? '');
  const index = value.indexOf(' — ');
  return index === -1
    ? { main: value, alt: '' }
    : { main: value.slice(0, index), alt: value.slice(index + 3) };
}

// "a | b | c" -> ['a', 'b', 'c']
function splitBars(text) {
  return String(text ?? '').split(/\s+\|\s+/).map(part => part.trim()).filter(Boolean);
}

// "三時です。 (It is three o'clock.) | ..." -> [{ jp, en }, ...]
const TRANSLATION_RE = /^(.*?)\s*\(([^()]*[A-Za-z][^()]*)\)\s*$/;

function parseExamples(example) {
  return splitBars(example)
    .map(chunk => {
      const match = chunk.match(TRANSLATION_RE);
      return match
        ? { jp: match[1].trim(), en: match[2].trim() }
        : { jp: chunk, en: '' };
    })
    .filter(({ jp }) => jp);
}

// View model of a topic for the cards / the detail header
function describe(topic, read) {
  const tags = topic.tags || [];
  const category = tags.find(tag => CATEGORY_KEYS.includes(tag)) || 'other';
  const level = tags.find(tag => LEVEL_RE.test(tag)) || '';
  const type = TYPES[topic.type] || TYPES.standard;
  const { main, alt } = splitDash(topic.title);

  return {
    topic,
    id: topic.id,
    category,
    categoryName: CATEGORY_NAMES[category],
    level,
    icon: type.icon,
    typeLabel: type.label,
    main,
    alt,
    extraTags: tags.filter(tag => tag !== category && !LEVEL_RE.test(tag) && tag !== 'list').slice(0, 3),
    read: read.includes(topic.id),
  };
}

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
    splitDash,
    splitBars,
    parseExamples,
    speak,

    selectTopic(id) {
      // remember where the list was, to come back to the same place
      if (!this.topic) this.listScroll = window.scrollY;
      this.searchOpen = false;
      this.router.push({ name: 'topics', params: { topic: id } });
    },
    backToList() {
      this.router.push({ name: 'topics' });
    },
    scrollToSection(index) {
      const el = document.getElementById('topic-section-' + index);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    resetRead() {
      if (!confirm('Clear the list of topics you have read?')) return;
      this.read = clearRead();
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

    // --- keyboard: ← → between topics, Esc back to the list ---
    onKeydown(e) {
      if (!this.currentTopic) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (document.querySelector('dialog[open]')) return; // Esc closes the kanji dialog first

      if (e.key === 'ArrowLeft' && this.prevTopic) {
        this.selectTopic(this.prevTopic.id);
      } else if (e.key === 'ArrowRight' && this.nextTopic) {
        this.selectTopic(this.nextTopic.id);
      } else if (e.key === 'Escape') {
        this.backToList();
      }
    },
  },
  data() {
    return {
      topics,
      hideDisclaimer: true,

      read: getRead(),
      listScroll: 0,

      query: '',
      searchOpen: false, // mobile only: panel under the header
      category: 'all',
      categoryOptions: CATEGORIES,
      levelOptions: LEVELS.map(level => ({ key: level, label: level })),
      scopeOptions: SCOPES,
      selectedLevels: loadSelection(LEVELS_KEY, LEVELS).filter(l => LEVELS.includes(l)),
      searchScope: loadSelection(SCOPE_KEY, SCOPE_KEYS).filter(s => SCOPE_KEYS.includes(s)),

      listQuery: '', // filter inside a "list" topic
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
      return (this.query.trim() ? 1 : 0)
        + (this.levelsFiltered ? 1 : 0)
        + (this.category !== 'all' ? 1 : 0);
    },
    // search + JLPT levels (the category chips are applied on top of this)
    matchedTopics() {
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
    categoryCounts() {
      const counts = { all: this.matchedTopics.length };
      CATEGORY_KEYS.forEach(key => {
        counts[key] = this.matchedTopics.filter(topic => (topic.tags || [])[0] === key).length;
      });
      return counts;
    },
    filteredTopics() {
      if (this.category === 'all') return this.matchedTopics;
      return this.matchedTopics.filter(topic => (topic.tags || [])[0] === this.category);
    },
    cards() {
      return this.filteredTopics.map(topic => describe(topic, this.read));
    },
    readCount() {
      return this.topics.filter(topic => this.read.includes(topic.id)).length;
    },

    // --- detail ---
    currentTopic() {
      if (!this.topic) return null;
      return this.topics.find(item => item.id === this.topic) || null;
    },
    currentMeta() {
      return this.currentTopic ? describe(this.currentTopic, this.read) : null;
    },
    // "Subtitle | with | bars" is shown as a list
    leadLines() {
      return this.currentTopic ? splitBars(this.currentTopic.subtitle) : [];
    },
    // section index for the "jump to" bar
    sections() {
      const content = this.currentTopic?.content;
      if (this.currentTopic?.type !== 'standard' || !Array.isArray(content)) return [];
      return content
        .map((section, index) => ({ index, main: splitDash(section.heading).main }))
        .filter(({ main }) => main);
    },
    visibleItems() {
      const items = this.currentTopic?.items || [];
      const query = normalize(this.listQuery).trim();
      if (!query) return items;
      return items.filter(item => normalize(Object.values(item).join(' ')).includes(query));
    },
    // previous / next follow the current filter (or every topic if this one is filtered out)
    navList() {
      return this.filteredTopics.some(item => item.id === this.topic)
        ? this.filteredTopics
        : this.topics;
    },
    topicIndex() {
      return this.navList.findIndex(item => item.id === this.topic);
    },
    prevTopic() {
      return this.topicIndex > 0 ? this.navList[this.topicIndex - 1] : null;
    },
    nextTopic() {
      return this.topicIndex >= 0 && this.topicIndex < this.navList.length - 1
        ? this.navList[this.topicIndex + 1]
        : null;
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
    relatedCards() {
      return this.relatedTopics.map(topic => describe(topic, this.read));
    },
  },
  watch: {
    topic: {
      immediate: true,
      handler(now, before) {
        this.listQuery = '';

        if (now) {
          if (this.topics.some(item => item.id === now)) this.read = markRead(now);
        } else if (before) {
          // back on the list: the router scrolls to the top, so restore after it
          this.$nextTick(() => requestAnimationFrame(() => window.scrollTo(0, this.listScroll || 0)));
        }
      },
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
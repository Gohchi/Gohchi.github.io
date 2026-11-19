import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import KanjiPoolMenu from 'components/KanjiPoolMenu.js';
import InfoIcons from 'components/InfoIcons.js';
import template from 'templates/AdjectivesPractice.js';
import KanaSpellInput from 'components/KanaSpellInput.js';

import adjectivesData from 'data/adjectives.js';
import { feedbackMixin } from 'data/feedback.js';
import {
  MAX_MEMORY,
  getEntry,
  getCategoryEntries,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

import { furiganaStore } from 'store';

import { shuffle, alignFurigana, pickDistractors } from 'tools';

const HISTORY_LIMIT = 50;

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const TYPES = [
  { key: 'i', label: 'い-adjectives' },
  { key: 'na', label: 'な-adjectives' },
];
const LEVELS_KEY = 'adjectives-practice-levels';
const TYPES_KEY = 'adjectives-practice-types';
// Adjectives the user turned off in the pool. Stored as "excluded" so new adjectives are in the pool by default.
const EXCLUDED_KEY = 'adjectives-practice-excluded';

export default {
  mixins: [feedbackMixin],
  components: {
    MainHeader,
    SessionHistory,
    WordCorner,
    FilterMenu,
    KanjiPoolMenu,
    InfoIcons,
    KanaSpellInput,
  },
  data() {
    const inputMode = localStorage.getItem('adjectives-practice-input-mode') || 'choice';

    return {
      inputMode, // 'choice' | 'type' (spell the reading kana by kana)
      MAX_MEMORY,
      sessionHistory: [],

      adjectives: adjectivesData,
      levelOptions: LEVELS.map(level => ({ key: level, label: level })),
      adjTypes: TYPES,
      selectedLevels: loadSelection(LEVELS_KEY, ['N5', 'N4']).filter(l => LEVELS.includes(l)),
      selectedTypes: loadSelection(TYPES_KEY, ['i', 'na']).filter(t => TYPES.some(o => o.key === t)),
      excludedAdjectives: loadSelection(EXCLUDED_KEY, []),

      targetAdj: null,
      choiceOptions: [],
      spellRound: 0, // new value = the spelling input starts over
      status: '',
      statusClass: 'status',
      score: 0,
      streak: 0,
      progressVersion: 0, // bumped after each save so the memory bar/stats/pool refresh (progress lives in localStorage)

      furiganaStore,
    };
  },
  computed: {
    // Adjectives that pass the JLPT + type filters (what the pool matrix shows)
    levelTypeAdjectives() {
      return this.adjectives.filter(
        a => this.selectedLevels.includes(a.level) && this.selectedTypes.includes(a.type)
      );
    },
    excludedSet() {
      return new Set(this.excludedAdjectives);
    },
    // The practice pool: JLPT + type filters AND not turned off in the pool matrix
    filteredAdjectives() {
      return this.levelTypeAdjectives.filter(({ dictionary }) => !this.excludedSet.has(dictionary));
    },
    // [{ text, rt? }] the reading only goes over the kanji (美味しい -> 美味(おい) + しい)
    promptParts() {
      if (!this.targetAdj) return [];
      const { dictionary, reading } = this.targetAdj;
      return alignFurigana(dictionary, reading);
    },
    adjMemoryKey() {
      return this.targetAdj ? this.targetAdj.dictionary : null;
    },
    adjMemory() {
      this.progressVersion; // reactive dependency
      return this.adjMemoryKey ? getEntry('adjectives', this.adjMemoryKey).memory : 0;
    },
    adjStats() {
      this.progressVersion; // reactive dependency
      const keys = this.filteredAdjectives.map(a => a.dictionary);
      return getStats('adjectives', keys);
    },
    typeLabel() {
      if (!this.targetAdj) return '';
      return this.targetAdj.type === 'na' ? 'な-adjective' : 'い-adjective';
    },
    // What the pool matrix shows: every adjective of the selected levels / types
    poolItems() {
      this.progressVersion; // reactive dependency
      const entries = Object.fromEntries(getCategoryEntries('adjectives'));

      return this.levelTypeAdjectives.map(({ dictionary, reading, meaning, level, tags, type }) => ({
        word: dictionary,
        reading,
        meaning,
        level,
        tags: [...(tags || []), type === 'na' ? 'na-adjective' : 'i-adjective'],
        memory: entries[dictionary]?.memory ?? 0,
      }));
    },
  },
  methods: {
    pushHistory(entry) {
      this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
      if (this.sessionHistory.length > HISTORY_LIMIT) {
        this.sessionHistory.length = HISTORY_LIMIT;
      }
    },
    setInputMode(value) {
      this.inputMode = value;
      localStorage.setItem('adjectives-practice-input-mode', value);
      this.newTarget();
    },
    setLevels(levels) {
      this.selectedLevels = levels;
      saveSelection(LEVELS_KEY, levels);
      this.refreshTargetIfNeeded();
    },
    setTypes(types) {
      this.selectedTypes = types;
      saveSelection(TYPES_KEY, types);
      this.refreshTargetIfNeeded();
    },
    setExcluded(words) {
      this.excludedAdjectives = words;
      saveSelection(EXCLUDED_KEY, words);
      this.refreshTargetIfNeeded();
    },
    refreshTargetIfNeeded() {
      if (!this.targetAdj || !this.filteredAdjectives.includes(this.targetAdj)) {
        this.newTarget();
      }
    },
    buildChoiceOptions(adj) {
      // wrong answers: the practice pool first, then the JLPT + type filters, then every adjective
      const meanings = list => list.map(({ meaning }) => meaning);
      const distractors = pickDistractors(adj.meaning, [
        meanings(this.filteredAdjectives),
        meanings(this.levelTypeAdjectives),
        meanings(this.adjectives),
      ]);
      return shuffle([adj.meaning, ...distractors]);
    },
    newTarget() {
      clearTimeout(this.nextTimer);
      const adj = weightedPick('adjectives', this.filteredAdjectives, a => a.dictionary)
        || this.filteredAdjectives[Math.floor(Math.random() * this.filteredAdjectives.length)];

      this.spellRound++;

      if (!adj) {
        this.targetAdj = null;
        this.status = 'No adjectives match the selected filters or pool.';
        this.statusClass = 'status bad';
        return;
      }

      this.targetAdj = adj;
      this.choiceOptions = this.inputMode === 'choice' ? this.buildChoiceOptions(adj) : [];
      this.status = this.inputMode === 'type'
        ? 'Type the reading in hiragana, kana by kana.'
        : 'Pick the correct meaning.';
      this.statusClass = 'status';
      if (this.inputMode === 'type') {
        this.$nextTick(() => this.focusInput());
      }
    },

    // --- type mode: the spelling input reports every wrong kana and the finished word ---
    onMistake(typed) {
      this.status = `Wrong: "${typed}"`;
      this.statusClass = 'status bad';
      this.flash(false, 0);
    },
    // one answer per adjective: right when no kana needed a second try
    onSpelled({ mistakes }) {
      if (!this.targetAdj) return;
      const adj = this.targetAdj;
      const correct = mistakes === 0;

      recordAnswer('adjectives', adj.dictionary, correct);
      this.progressVersion++;
      this.flash(correct, correct ? this.streak + 1 : 0);

      this.pushHistory({
        type: 'adjective',
        prompt: adj.dictionary,
        detail: 'reading',
        chosen: correct ? adj.reading : `${mistakes} wrong kana`,
        correctAnswer: adj.reading,
        isCorrect: correct,
      });

      this.score++;
      this.streak = correct ? this.streak + 1 : 0;
      this.status = `${correct ? 'Correct!' : 'Done.'} ${adj.reading} = ${adj.meaning}`;
      this.statusClass = correct ? 'status ok' : 'status bad';
      this.nextTimer = setTimeout(() => this.newTarget(), 1400);
    },
    // the Check button
    checkTypeAnswer() {
      if (this.$refs.typeInput) this.$refs.typeInput.submit();
    },

    // --- choice mode ---
    chooseOption(meaning) {
      if (!this.targetAdj) return;
      this.gradeAnswer(meaning === this.targetAdj.meaning, meaning);
    },
    gradeAnswer(correct, chosenDisplay) {
      const adj = this.targetAdj;
      recordAnswer('adjectives', adj.dictionary, correct);
      this.progressVersion++;
      this.flash(correct, correct ? this.streak + 1 : 0);

      this.pushHistory({
        type: 'adjective',
        prompt: adj.dictionary,
        detail: 'meaning',
        chosen: chosenDisplay,
        correctAnswer: adj.meaning,
        isCorrect: correct,
      });

      if (correct) {
        this.score++;
        this.streak++;
        this.status = 'Correct!';
        this.statusClass = 'status ok';
        clearTimeout(this.nextTimer);
        this.nextTimer = setTimeout(() => this.newTarget(), 500);
      } else {
        this.streak = 0;
        this.status = 'Not quite, try another one.';
        this.statusClass = 'status bad';
      }
    },
    revealAnswer() {
      if (!this.targetAdj) return;
      if (this.inputMode === 'type' && this.$refs.typeInput) this.$refs.typeInput.reveal();
      this.status = this.inputMode === 'type'
        ? 'Answer: ' + this.targetAdj.reading
        : 'Answer: ' + this.targetAdj.meaning;
      this.statusClass = 'status';
    },
    resetScore() {
      this.score = 0;
      this.streak = 0;
      resetProgress('adjectives');
      this.progressVersion++;
      this.newTarget();
    },
    focusInput() {
      this.$refs.typeInput && this.$refs.typeInput.focus();
    },
  },
  mounted() {
    this.newTarget();
  },
  beforeUnmount() {
    clearTimeout(this.nextTimer);
  },
  template,
};
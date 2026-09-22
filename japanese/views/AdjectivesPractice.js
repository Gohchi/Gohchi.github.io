import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import template from 'templates/AdjectivesPractice.js';

import adjectivesData from 'data/adjectives.js';
import {
  MAX_MEMORY,
  getEntry,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

import { furiganaStore } from 'store';

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const HISTORY_LIMIT = 50;

export default {
  components: {
    MainHeader,
    SessionHistory,
  },
  data() {
    const inputMode = localStorage.getItem('adjectives-practice-input-mode') || 'choice';

    return {
      inputMode, // 'choice' | 'type'
      MAX_MEMORY,
      sessionHistory: [],

      adjectives: adjectivesData,
      adjLevels: ['N5', 'N4', 'N3', 'N2', 'N1'],
      adjTypes: [
        { key: 'i', label: 'い-adjectives' },
        { key: 'na', label: 'な-adjectives' },
      ],
      selectedLevels: ['N5', 'N4'],
      selectedTypes: ['i', 'na'],

      targetAdj: null,
      choiceOptions: [],
      typeInputValue: '',
      status: '',
      statusClass: 'status',
      score: 0,
      streak: 0,

      furiganaStore,
    };
  },
  computed: {
    filteredAdjectives() {
      return this.adjectives.filter(
        a => this.selectedLevels.includes(a.level) && this.selectedTypes.includes(a.type)
      );
    },
    adjMemoryKey() {
      return this.targetAdj ? this.targetAdj.dictionary : null;
    },
    adjMemory() {
      return this.adjMemoryKey ? getEntry('adjectives', this.adjMemoryKey).memory : 0;
    },
    adjStats() {
      const keys = this.filteredAdjectives.map(a => a.dictionary);
      return getStats('adjectives', keys);
    },
    typeLabel() {
      if (!this.targetAdj) return '';
      return this.targetAdj.type === 'na' ? 'な-adjective' : 'い-adjective';
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
    toggleLevel(level) {
      this.selectedLevels = this.selectedLevels.includes(level)
        ? this.selectedLevels.filter(l => l !== level)
        : [...this.selectedLevels, level];
      this.refreshTargetIfNeeded();
    },
    toggleType(type) {
      this.selectedTypes = this.selectedTypes.includes(type)
        ? this.selectedTypes.filter(t => t !== type)
        : [...this.selectedTypes, type];
      this.refreshTargetIfNeeded();
    },
    refreshTargetIfNeeded() {
      if (!this.targetAdj || !this.filteredAdjectives.includes(this.targetAdj)) {
        this.newTarget();
      }
    },
    buildChoiceOptions(adj) {
      // Distractors are pulled from the full dataset (not just the current filter)
      // so there are always at least 3 wrong-but-plausible options to pick from.
      const pool = this.adjectives.filter(a => a.meaning !== adj.meaning);
      const distractors = shuffle(pool).slice(0, 3).map(a => a.meaning);
      return shuffle([adj.meaning, ...distractors]);
    },
    newTarget() {
      const adj = weightedPick('adjectives', this.filteredAdjectives, a => a.dictionary)
        || this.filteredAdjectives[Math.floor(Math.random() * this.filteredAdjectives.length)];

      if (!adj) {
        this.targetAdj = null;
        this.status = 'No adjectives match the selected filters.';
        this.statusClass = 'status bad';
        return;
      }

      this.targetAdj = adj;
      this.choiceOptions = this.inputMode === 'choice' ? this.buildChoiceOptions(adj) : [];
      this.typeInputValue = '';
      this.status = this.inputMode === 'type'
        ? 'Type the reading in hiragana.'
        : 'Pick the correct meaning.';
      this.statusClass = 'status';
      if (this.inputMode === 'type') {
        this.$nextTick(() => this.focusInput());
      }
    },
    checkTypeAnswer() {
      if (!this.targetAdj) return;
      const value = this.typeInputValue.trim();
      if (!value) return;
      this.gradeAnswer(value === this.targetAdj.reading, value);
    },
    chooseOption(meaning) {
      if (!this.targetAdj) return;
      this.gradeAnswer(meaning === this.targetAdj.meaning, meaning);
    },
    gradeAnswer(correct, chosenDisplay) {
      const adj = this.targetAdj;
      recordAnswer('adjectives', adj.dictionary, correct);

      this.pushHistory({
        type: 'adjective',
        prompt: adj.dictionary,
        detail: this.inputMode === 'type' ? 'reading' : 'meaning',
        chosen: chosenDisplay,
        correctAnswer: this.inputMode === 'type' ? adj.reading : adj.meaning,
        isCorrect: correct,
      });

      if (correct) {
        this.score++;
        this.streak++;
        this.status = 'Correct!';
        this.statusClass = 'status ok';
        setTimeout(() => this.newTarget(), this.inputMode === 'choice' ? 500 : 700);
      } else {
        this.streak = 0;
        this.status = this.inputMode === 'type'
          ? `Not quite. Answer: ${adj.reading}`
          : `Not quite. Answer: ${adj.meaning}`;
        this.statusClass = 'status bad';
      }
    },
    revealAnswer() {
      if (!this.targetAdj) return;
      this.status = this.inputMode === 'type'
        ? 'Answer: ' + this.targetAdj.reading
        : 'Answer: ' + this.targetAdj.meaning;
      this.statusClass = 'status';
    },
    resetScore() {
      this.score = 0;
      this.streak = 0;
      resetProgress('adjectives');
      this.newTarget();
    },
    focusInput() {
      this.$refs.typeInput && this.$refs.typeInput.focus();
    },
  },
  mounted() {
    this.newTarget();
  },
  template,
};
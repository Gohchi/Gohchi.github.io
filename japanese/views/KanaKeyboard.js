import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import template from 'templates/KanaKeyboard.js';

import { hiragana, katakana, kanaMap } from 'data/kana-romaji.js';
import { shuffle } from 'tools';
import {
  MAX_MEMORY,
  getEntry,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

const HISTORY_LIMIT = 50;

export default {
  components: {
    MainHeader,
    SessionHistory,
  },
  setup() {
    const capture = ref(null);
    return { capture };
  },
  data() {
    const inputMode = localStorage.getItem('kana-practice-input-mode') || 'type';
    const kanaMode = localStorage.getItem('kana-practice-kana-mode') || 'hiragana';

    return {
      inputMode, // 'type' | 'choice'
      kanaMode, // 'hiragana' | 'katakana'
      MAX_MEMORY,
      sessionHistory: [],

      KANA: Object.keys(kanaMode === 'hiragana' ? hiragana : katakana),
      target: "",
      kanaOptions: [],
      score: 0,
      streak: 0,
      last: "-",
      status: "Click anywhere and start typing.",
      statusClass: "status",
      inputValue: "",
    }
  },
  computed: {
    // hiragana-practice and katakana-practice share these same categories,
    // so progress carries over regardless of which page you drill from.
    category() {
      return this.kanaMode === 'hiragana' ? 'kana-hiragana' : 'kana-katakana';
    },
    kanaMemory() {
      return this.target ? getEntry(this.category, this.target).memory : 0;
    },
    kanaStats() {
      return getStats(this.category, this.KANA);
    },
    kanaRomaji() {
      return this.kanaMode === 'hiragana' ? hiragana : katakana;
    },
  },
  methods: {
    switchKanaMode() {
      this.kanaMode = this.kanaMode === 'hiragana' ? 'katakana' : 'hiragana';
      localStorage.setItem('kana-practice-kana-mode', this.kanaMode);
      this.KANA = Object.keys(this.kanaMode === 'hiragana' ? hiragana : katakana);
      this.newTarget();
    },
    setInputMode(value) {
      this.inputMode = value;
      localStorage.setItem('kana-practice-input-mode', value);
    },
    pushHistory(entry) {
      this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
      if (this.sessionHistory.length > HISTORY_LIMIT) {
        this.sessionHistory.length = HISTORY_LIMIT;
      }
    },
    buildKanaOptions(correctKana) {
      const wrongPool = this.KANA.filter(k => k !== correctKana);
      const wrongs = shuffle(wrongPool).slice(0, 3);
      return shuffle([correctKana, ...wrongs]).map(k => ({ kana: k, romaji: this.kanaRomaji[k] }));
    },
    newTarget() {
      this.target = weightedPick(this.category, this.KANA, k => k);
      this.kanaOptions = this.buildKanaOptions(this.target);
      this.status = this.inputMode === 'type'
        ? "Type the kana shown above."
        : "Pick the reading that matches.";
      this.statusClass = "status";
      this.inputValue = "";
      if (this.inputMode === 'type') {
        this.$nextTick(() => this.focusInput());
      }
    },
    resetScore() {
      this.score = 0;
      this.streak = 0;
      resetProgress(this.category);
      this.status = "Score and memory reset.";
      this.statusClass = "status";
      this.$nextTick(() => this.focusInput());
    },
    handleKana(candidate) {
      this.last = candidate;
      const correct = candidate === this.target;
      recordAnswer(this.category, this.target, correct);

      this.pushHistory({
        type: 'kana',
        prompt: this.target,
        detail: '',
        chosen: candidate,
        correctAnswer: this.target,
        isCorrect: correct,
      });

      if (correct) {
        this.score++;
        this.streak++;
        this.status = "Correct!";
        this.statusClass = "status ok";
        this.newTarget();
      } else {
        this.streak = 0;
        this.status = `Wrong: "${candidate}"`;
        this.statusClass = "status bad";
      }
    },
    onInput(e) {
      const { data } = e;
      if (!data) return;
      // typing is usually done through a romaji->hiragana IME, so the raw
      // character needs converting to its katakana counterpart to compare
      const raw = [...data].at(-1);
      const candidate = this.kanaMode === 'katakana' ? (kanaMap[raw] || raw) : raw;
      this.handleKana(candidate);
      this.inputValue = data;
      e.target.value = '';
    },
    chooseKanaOption(option) {
      this.handleKana(option.kana);
    },
    focusInput() {
      if (this.inputMode === 'type') {
        this.$refs.capture && this.$refs.capture.focus();
      }
    },
    onDocumentClick() {
      if (this.inputMode === 'type') this.focusInput();
    },
  },
  mounted() {
    this.newTarget();
    document.addEventListener("click", this.onDocumentClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocumentClick);
  },
  template
}
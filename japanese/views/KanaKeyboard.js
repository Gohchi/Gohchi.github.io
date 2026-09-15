import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import template from 'templates/KanaKeyboard.js';

import { hiragana, katakana, kanaMap } from 'data/kana-romaji.js';
import {
  MAX_MEMORY,
  getEntry,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

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
  setup() {
    const capture = ref(null);
    return { capture };
  },
  data() {
    const inputMode = localStorage.getItem('kana-keyboard-input-mode') || 'type';

    const kanaMode = localStorage.getItem('kana-keyboard-kana-mode') || 'hiragana';
    
    const kana = Object.keys(kanaMode === 'hiragana' ? hiragana : katakana);

    return {
      inputMode, // 'type' | 'choice'
      MAX_MEMORY,
      sessionHistory: [],

      showMenu: false,
      furigana: true,
      KANA: kana,
      kanaMode,
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
    kanaMemory() {
      return this.target ? getEntry('kana', this.target).memory : 0;
    },
    kanaStats() {
      return getStats('kana', this.KANA);
    },
    kanaRomaji() {
      return this.kanaMode === 'hiragana' ? hiragana : katakana;
    }
  },
  methods: {
    switchKanaMode() {
      this.kanaMode = this.kanaMode === 'hiragana' ? 'katakana' : 'hiragana';
      this.KANA = Object.keys(this.kanaMode === 'hiragana' ? hiragana : katakana);
      this.newTarget();
    },
    pushHistory(entry) {
      this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
      if (this.sessionHistory.length > HISTORY_LIMIT) {
        this.sessionHistory.length = HISTORY_LIMIT;
      }
    },
    setInputMode(value) {
      this.inputMode = value;
      localStorage.setItem('kana-keyboard-input-mode', value);
    },
    buildKanaOptions(correctKana) {
      const wrongPool = this.KANA.filter(k => k !== correctKana);
      const wrongs = shuffle(wrongPool).slice(0, 3);
      return shuffle([correctKana, ...wrongs]).map(k => ({ kana: k, romaji: this.kanaRomaji[k] }));
    },
    newTarget() {
      this.target = weightedPick('kana', this.KANA, k => k);
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
      resetProgress('kana');
      this.status = "Score and memory reset.";
      this.statusClass = "status";
      this.$nextTick(() => this.focusInput());
    },
    handleKana(kana) {
      this.last = kana;
      if (this.kanaMode === 'katakana') { 
        kana = kanaMap[kana];
      }
      const correct = kana === this.target;
      recordAnswer('kana', this.target, correct);

      this.pushHistory({
        type: 'kana',
        prompt: this.target,
        detail: '',
        chosen: kana,
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
        this.status = `Wrong: "${kana}"`;
        this.statusClass = "status bad";
      }
    },
    onInput(e) {
      const { data } = e;
      if (!data) return;
      let kana = [...data].at(-1);
      this.handleKana(kana);
      this.inputValue = data;
      e.target.value = '';
    },
    chooseKanaOption(option) {
      this.handleKana(option.kana);
    },
    focusInput() {
      this.$refs.capture && this.$refs.capture.focus();
    },
  },
  mounted() {
    this.newTarget();
    document.addEventListener("click", () => {
      if (this.inputMode === 'type') this.focusInput();
    });
  },
  template
}
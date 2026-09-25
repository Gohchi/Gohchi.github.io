import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import template from 'templates/HiraganaPractice.js';

import { hiragana } from 'data/kana-romaji.js';
import wordsData from 'data/words.js';
import { shuffle, normalizeReading } from 'tools';
import {
  MAX_MEMORY,
  getEntry,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

const HISTORY_LIMIT = 50;
const WORD_CORRECT_DELAY = 700; // ms before moving to the next word

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
    const inputMode = localStorage.getItem('hiragana-practice-input-mode') || 'type';
    const practiceMode = localStorage.getItem('hiragana-practice-mode') || 'kana';

    return {
      inputMode, // 'type' | 'choice' (characters practice only)
      practiceMode, // 'kana' | 'words'
      MAX_MEMORY,
      sessionHistory: [],

      KANA: Object.keys(hiragana),
      target: "",
      kanaOptions: [],
      score: 0,
      streak: 0,
      last: "-",
      status: "Click anywhere and start typing.",
      statusClass: "status",
      inputValue: "",

      // words practice
      words: wordsData.filter(({ type }) => type === 'hiragana'),
      targetWord: null,
      wordInputValue: "",
      wordStatus: "",
      wordStatusClass: "status",
      wordScore: 0,
      wordStreak: 0,
      wordRevealed: false, // answer was revealed, Enter goes to the next word
      wordLocked: false, // correct answer shown, waiting for the next word
      wordTimer: null,
      wordProgressVersion: 0, // bumped after each save so the memory bar/stats refresh
    }
  },
  computed: {
    kanaMemory() {
      return this.target ? getEntry('kana-hiragana', this.target).memory : 0;
    },
    kanaStats() {
      return getStats('kana-hiragana', this.KANA);
    },
    wordMemory() {
      this.wordProgressVersion; // reactive dependency, progress lives in localStorage
      return this.targetWord ? getEntry('words-hiragana', this.targetWord.word).memory : 0;
    },
    wordStats() {
      this.wordProgressVersion;
      return getStats('words-hiragana', this.words.map(({ word }) => word));
    },
    // Long words would overflow the card at the default size
    wordPromptStyle() {
      const length = this.targetWord ? [...this.targetWord.word].length : 0;
      const size = length > 7 ? 32 : length > 5 ? 40 : length > 3 ? 52 : 64;
      return { fontSize: size + 'px' };
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
      localStorage.setItem('hiragana-practice-input-mode', value);
      if (this.practiceMode === 'kana') this.newTarget();
    },
    setPracticeMode(value) {
      if (value === this.practiceMode) return;
      this.practiceMode = value;
      localStorage.setItem('hiragana-practice-mode', value);
      this.startPractice();
    },
    startPractice() {
      this.clearWordTimer();
      if (this.practiceMode === 'words') {
        this.newWordTarget();
      } else {
        this.newTarget();
      }
    },
    buildKanaOptions(correctKana) {
      const wrongPool = this.KANA.filter(k => k !== correctKana);
      const wrongs = shuffle(wrongPool).slice(0, 3);
      return shuffle([correctKana, ...wrongs]).map(k => ({ kana: k, romaji: hiragana[k] }));
    },
    newTarget() {
      this.target = weightedPick('kana-hiragana', this.KANA, k => k);
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
      resetProgress('kana-hiragana');
      this.status = "Score and memory reset.";
      this.statusClass = "status";
      this.$nextTick(() => this.focusInput());
    },
    handleKana(candidate) {
      this.last = candidate;
      const correct = candidate === this.target;
      recordAnswer('kana-hiragana', this.target, correct);

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
      const candidate = [...data].at(-1);
      this.handleKana(candidate);
      this.inputValue = data;
      e.target.value = '';
    },
    chooseKanaOption(option) {
      this.handleKana(option.kana);
    },

    // --- words practice ---
    clearWordTimer() {
      clearTimeout(this.wordTimer);
      this.wordTimer = null;
    },
    newWordTarget() {
      this.clearWordTimer();

      // avoid showing the same word twice in a row when there are other options
      const previous = this.targetWord?.word;
      const pool = this.words.length > 1
        ? this.words.filter(({ word }) => word !== previous)
        : this.words;

      const word = weightedPick('words-hiragana', pool, item => item.word);

      this.wordInputValue = '';
      this.wordRevealed = false;
      this.wordLocked = false;

      if (!word) {
        this.targetWord = null;
        this.wordStatus = 'No words available.';
        this.wordStatusClass = 'status bad';
        return;
      }

      this.targetWord = word;
      this.wordStatus = 'Type the answer and press Enter.';
      this.wordStatusClass = 'status';
      this.$nextTick(() => this.focusInput());
    },
    onWordEnter(e) {
      // Enter that confirms an IME composition must not check the answer
      if (e.isComposing || e.keyCode === 229) return;
      this.checkWordAnswer();
    },
    checkWordAnswer() {
      if (!this.targetWord || this.wordLocked) return;

      // answer was revealed: Enter moves on
      if (this.wordRevealed) {
        this.newWordTarget();
        return;
      }

      const value = this.wordInputValue.trim();
      if (!value) return;

      const { word, reading, meaning } = this.targetWord;
      const correct = normalizeReading(value) === normalizeReading(reading);

      recordAnswer('words-hiragana', word, correct);
      this.wordProgressVersion++;

      this.pushHistory({
        type: 'word',
        prompt: word,
        detail: meaning,
        chosen: value,
        correctAnswer: reading,
        isCorrect: correct,
      });

      if (correct) {
        this.wordScore++;
        this.wordStreak++;
        this.wordStatus = 'Correct! ' + reading;
        this.wordStatusClass = 'status ok';
        this.wordLocked = true;
        this.wordTimer = setTimeout(() => this.newWordTarget(), WORD_CORRECT_DELAY);
      } else {
        this.wordStreak = 0;
        this.wordStatus = 'Not quite, try again.';
        this.wordStatusClass = 'status bad';
        this.$nextTick(() => this.$refs.wordInput && this.$refs.wordInput.select());
      }
    },
    revealWordAnswer() {
      if (!this.targetWord || this.wordLocked) return;

      // giving up counts as a miss, once per word
      if (!this.wordRevealed) {
        const { word, reading, meaning } = this.targetWord;
        recordAnswer('words-hiragana', word, false);
        this.wordProgressVersion++;
        this.wordStreak = 0;
        this.pushHistory({
          type: 'word',
          prompt: word,
          detail: meaning,
          chosen: '(revealed)',
          correctAnswer: reading,
          isCorrect: false,
        });
      }

      this.wordRevealed = true;
      this.wordStatus = `Answer: ${this.targetWord.reading}. Press Enter for the next word.`;
      this.wordStatusClass = 'status';
      this.focusInput();
    },
    resetWordScore() {
      this.wordScore = 0;
      this.wordStreak = 0;
      resetProgress('words-hiragana');
      this.wordProgressVersion++;
      this.wordStatus = 'Score and memory reset.';
      this.wordStatusClass = 'status';
      this.$nextTick(() => this.focusInput());
    },

    focusInput() {
      if (this.practiceMode === 'words') {
        this.$refs.wordInput && this.$refs.wordInput.focus();
      } else if (this.inputMode === 'type') {
        this.$refs.capture && this.$refs.capture.focus();
      }
    },
    onDocumentClick() {
      if (this.practiceMode === 'words' || this.inputMode === 'type') this.focusInput();
    },
  },
  mounted() {
    this.startPractice();
    document.addEventListener("click", this.onDocumentClick);
  },
  beforeUnmount() {
    this.clearWordTimer();
    document.removeEventListener("click", this.onDocumentClick);
  },
  template
}
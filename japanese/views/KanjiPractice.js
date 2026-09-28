import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import template from 'templates/KanjiPractice.js';

import wordsData from 'data/words.js';
import { normalizeReading } from 'tools';
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
  data() {
    return {
      MAX_MEMORY,
      sessionHistory: [],

      words: wordsData.filter(({ type }) => type === 'kanji'),
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
    wordMemory() {
      this.wordProgressVersion; // reactive dependency, progress lives in localStorage
      return this.targetWord ? getEntry('words-kanji', this.targetWord.word).memory : 0;
    },
    wordStats() {
      this.wordProgressVersion;
      return getStats('words-kanji', this.words.map(({ word }) => word));
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

      const word = weightedPick('words-kanji', pool, item => item.word);

      this.wordInputValue = '';
      this.wordRevealed = false;
      this.wordLocked = false;

      if (!word) {
        this.targetWord = null;
        this.wordStatus = 'No kanji words available.';
        this.wordStatusClass = 'status bad';
        return;
      }

      this.targetWord = word;
      this.wordStatus = 'Type the reading in hiragana, or the word in kanji, then press Enter.';
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
      // Accept either the hiragana reading or the word written in kanji
      const correct = normalizeReading(value) === normalizeReading(reading) || value === word;

      recordAnswer('words-kanji', word, correct);
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
        recordAnswer('words-kanji', word, false);
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
      this.wordStatus = `Answer: ${this.targetWord.reading} (${this.targetWord.word}). Press Enter for the next word.`;
      this.wordStatusClass = 'status';
      this.focusInput();
    },
    resetWordScore() {
      this.wordScore = 0;
      this.wordStreak = 0;
      resetProgress('words-kanji');
      this.wordProgressVersion++;
      this.wordStatus = 'Score and memory reset.';
      this.wordStatusClass = 'status';
      this.$nextTick(() => this.focusInput());
    },
    focusInput() {
      this.$refs.wordInput && this.$refs.wordInput.focus();
    },
    onDocumentClick() {
      this.focusInput();
    },
  },
  mounted() {
    this.newWordTarget();
    document.addEventListener("click", this.onDocumentClick);
  },
  beforeUnmount() {
    this.clearWordTimer();
    document.removeEventListener("click", this.onDocumentClick);
  },
  template
}
import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';

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

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const LEVELS_KEY = 'hiragana-practice-levels';
const INPUT_MODE_KEY = 'hiragana-practice-input-mode';

// Progress is stored per mode, so "meaning" progress never mixes with typing progress
const CATEGORY_TYPE = 'words-hiragana';
const CATEGORY_MEANING = 'words-hiragana-meaning';

export default {
  components: {
    MainHeader,
    SessionHistory,
    WordCorner,
    FilterMenu,
  },
  setup() {
    const capture = ref(null);
    return { capture };
  },
  data() {
    const inputMode = localStorage.getItem(INPUT_MODE_KEY) || 'type';

    return {
      inputMode, // 'type' (write the word) | 'choice' (pick the meaning)
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
      wordOptions: [], // meanings shown in choice mode
      wrongOptions: [], // meanings already tried wrong for the current word
      wordInputValue: "",
      wordStatus: "",
      wordStatusClass: "status",
      wordScore: 0,
      wordStreak: 0,
      wordRevealed: false, // answer was revealed, Enter / Skip goes to the next word
      wordLocked: false, // correct answer shown, waiting for the next word
      wordTimer: null,
      wordProgressVersion: 0, // bumped after each save so the memory bar/stats refresh
      levelOptions: LEVELS.map(level => ({ key: level, label: level })),
      selectedLevels: loadSelection(LEVELS_KEY, LEVELS).filter(l => LEVELS.includes(l)),
    }
  },
  computed: {
    category() {
      return this.inputMode === 'choice' ? CATEGORY_MEANING : CATEGORY_TYPE;
    },
    kanaMemory() {
      return this.target ? getEntry('kana-hiragana', this.target).memory : 0;
    },
    kanaStats() {
      return getStats('kana-hiragana', this.KANA);
    },
    wordMemory() {
      this.wordProgressVersion; // reactive dependency, progress lives in localStorage
      return this.targetWord ? getEntry(this.category, this.targetWord.word).memory : 0;
    },
    wordStats() {
      this.wordProgressVersion;
      return getStats(this.category, this.filteredWords.map(({ word }) => word));
    },
    // Long words would overflow the card at the default size
    wordPromptStyle() {
      const length = this.targetWord ? [...this.targetWord.word].length : 0;
      const size = length > 7 ? 32 : length > 5 ? 40 : length > 3 ? 52 : 64;
      return { fontSize: size + 'px' };
    },
    // with every level selected nothing is filtered, so words without a level still show up
    filteredWords() {
      if (this.selectedLevels.length === LEVELS.length) return this.words;
      return this.words.filter(({ level }) => this.selectedLevels.includes(level));
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
      localStorage.setItem(INPUT_MODE_KEY, value);
      this.newWordTarget();
    },
    startPractice() {
      this.clearWordTimer();
      this.newWordTarget();
    },
    buildKanaOptions(correctKana) {
      const wrongPool = this.KANA.filter(k => k !== correctKana);
      const wrongs = shuffle(wrongPool).slice(0, 3);
      return shuffle([correctKana, ...wrongs]).map(k => ({ kana: k, romaji: hiragana[k] }));
    },
    newTarget() {
      this.target = weightedPick('kana-hiragana', this.KANA, k => k);
      this.kanaOptions = this.buildKanaOptions(this.target);
      this.status = "Type the kana shown above.";
      this.statusClass = "status";
      this.inputValue = "";
      this.$nextTick(() => this.focusInput());
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
    buildMeaningOptions(target) {
      // Distractors come from the other hiragana words' meanings (same script, so
      // nothing gives the answer away), taken from the whole list rather than the
      // current JLPT filter so there are always enough of them.
      const pool = [...new Set(
        this.words
          .filter(({ word, meaning }) => word !== target.word && meaning !== target.meaning)
          .map(({ meaning }) => meaning)
      )];
      return shuffle([target.meaning, ...shuffle(pool).slice(0, 3)]);
    },
    newWordTarget() {
      this.clearWordTimer();

      // avoid showing the same word twice in a row when there are other options
      const previous = this.targetWord?.word;
      const pool = this.filteredWords.length > 1
        ? this.filteredWords.filter(({ word }) => word !== previous)
        : this.filteredWords;

      const word = weightedPick(this.category, pool, item => item.word);

      this.wordInputValue = '';
      this.wordOptions = [];
      this.wrongOptions = [];
      this.wordRevealed = false;
      this.wordLocked = false;

      if (!word) {
        this.targetWord = null;
        this.wordStatus = 'No words available.';
        this.wordStatusClass = 'status bad';
        return;
      }

      this.targetWord = word;

      if (this.inputMode === 'choice') {
        this.wordOptions = this.buildMeaningOptions(word);
        this.wordStatus = 'Pick the meaning of this word.';
      } else {
        this.wordStatus = 'Type the answer and press Enter.';
      }
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

      recordAnswer(CATEGORY_TYPE, word, correct);
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
    chooseMeaning(option) {
      if (!this.targetWord || this.wordLocked || this.wordRevealed) return;
      if (this.wrongOptions.includes(option)) return;

      const { word, reading, meaning } = this.targetWord;
      const correct = option === meaning;

      recordAnswer(CATEGORY_MEANING, word, correct);
      this.wordProgressVersion++;

      this.pushHistory({
        type: 'word',
        prompt: word,
        detail: 'meaning',
        chosen: option,
        correctAnswer: meaning,
        isCorrect: correct,
      });

      if (correct) {
        this.wordScore++;
        this.wordStreak++;
        this.wordStatus = `Correct! ${meaning} (${reading})`;
        this.wordStatusClass = 'status ok';
        this.wordLocked = true;
        this.wordTimer = setTimeout(() => this.newWordTarget(), WORD_CORRECT_DELAY);
      } else {
        this.wordStreak = 0;
        this.wrongOptions.push(option);
        this.wordStatus = 'Not quite, try another one.';
        this.wordStatusClass = 'status bad';
      }
    },
    revealWordAnswer() {
      if (!this.targetWord || this.wordLocked) return;

      const { word, reading, meaning } = this.targetWord;
      const isChoice = this.inputMode === 'choice';

      // giving up counts as a miss, once per word
      if (!this.wordRevealed) {
        recordAnswer(this.category, word, false);
        this.wordProgressVersion++;
        this.wordStreak = 0;
        this.pushHistory({
          type: 'word',
          prompt: word,
          detail: isChoice ? 'meaning' : meaning,
          chosen: '(revealed)',
          correctAnswer: isChoice ? meaning : reading,
          isCorrect: false,
        });
      }

      this.wordRevealed = true;
      this.wordStatus = isChoice
        ? `Answer: ${meaning}. Press Skip for the next word.`
        : `Answer: ${reading}. Press Enter for the next word.`;
      this.wordStatusClass = 'status';
      this.focusInput();
    },
    resetWordScore() {
      this.wordScore = 0;
      this.wordStreak = 0;
      // only the current mode's progress is reset
      resetProgress(this.category);
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
    setLevels(levels) {
      this.selectedLevels = levels;
      saveSelection(LEVELS_KEY, levels);
      if (!this.targetWord || !this.filteredWords.includes(this.targetWord)) {
        this.newWordTarget();
      }
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
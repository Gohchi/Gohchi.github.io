import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import template from 'templates/KanaKeyboard.js';

import { hiragana, katakana, kanaMap } from 'data/kana-romaji.js';
import wordsData from 'data/words.js';
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
const WORD_CORRECT_DELAY = 700; // ms before moving to the next word

const WORD_TYPES = [
  { id: 'hiragana', label: 'ひらがな', hint: 'Write this word in hiragana' },
  { id: 'katakana', label: 'カタカナ', hint: 'Write this katakana word in hiragana' },
  { id: 'kanji', label: '漢字', hint: 'Write the reading of this kanji word in hiragana' },
];

// --- word answer checking ---------------------------------------------------

// Vowel (a/i/u/e/o) that each hiragana ends with, used to expand the long
// vowel mark: こーひー -> こおひい (the same thing an IME types for "koohii").
const VOWEL_ROWS = {
  'あ': 'ぁあかがさざただなはばぱまゃやらゎわ',
  'い': 'ぃいきぎしじちぢにひびぴみり',
  'う': 'ぅうくぐすずつづぬふぶぷむゅゆる',
  'え': 'ぇえけげせぜてでねへべぺめれ',
  'お': 'ぉおこごそぞとどのほぼぽもょよろを',
};
const VOWEL_OF = {};
for (const [vowel, chars] of Object.entries(VOWEL_ROWS)) {
  for (const char of chars) VOWEL_OF[char] = vowel;
}

const toHiragana = text => text.replace(
  /[\u30A1-\u30F6]/g,
  char => String.fromCharCode(char.charCodeAt(0) - 0x60)
);

const expandLongVowels = text => {
  let result = '';
  for (const char of text) {
    result += char === 'ー' ? (VOWEL_OF[result.slice(-1)] || char) : char;
  }
  return result;
};

// Katakana typed by mistake counts as hiragana, and both "ー" and the plain
// vowel are accepted for long sounds, on either side of the comparison.
const normalizeReading = text => expandLongVowels(toHiragana(text.replace(/\s+/g, '')));

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
    const practiceMode = localStorage.getItem('kana-keyboard-practice-mode') || 'kana';

    const kanaMode = localStorage.getItem('kana-keyboard-kana-mode') || 'hiragana';
    
    const kana = Object.keys(kanaMode === 'hiragana' ? hiragana : katakana);

    return {
      inputMode, // 'type' | 'choice' (kana practice only)
      practiceMode, // 'kana' | 'words'
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

      // words practice
      words: wordsData,
      wordTypes: WORD_TYPES,
      selectedWordTypes: WORD_TYPES.map(({ id }) => id),
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
      return this.target ? getEntry('kana', this.target).memory : 0;
    },
    kanaStats() {
      return getStats('kana', this.KANA);
    },
    kanaRomaji() {
      return this.kanaMode === 'hiragana' ? hiragana : katakana;
    },

    filteredWords() {
      return this.words.filter(({ type }) => this.selectedWordTypes.includes(type));
    },
    wordMemory() {
      this.wordProgressVersion; // reactive dependency, progress lives in localStorage
      return this.targetWord ? getEntry('words', this.targetWord.word).memory : 0;
    },
    wordStats() {
      this.wordProgressVersion;
      return getStats('words', this.filteredWords.map(({ word }) => word));
    },
    wordHint() {
      const type = this.wordTypes.find(({ id }) => id === this.targetWord?.type);
      return type ? type.hint : '';
    },
    // Long words (アイスクリーム) would overflow the card at the default size
    wordPromptStyle() {
      const length = this.targetWord ? [...this.targetWord.word].length : 0;
      const size = length > 7 ? 32 : length > 5 ? 40 : length > 3 ? 52 : 64;
      return { fontSize: size + 'px' };
    },
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
    setPracticeMode(value) {
      if (value === this.practiceMode) return;
      this.practiceMode = value;
      localStorage.setItem('kana-keyboard-practice-mode', value);
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

    // --- words practice ---
    clearWordTimer() {
      clearTimeout(this.wordTimer);
      this.wordTimer = null;
    },
    toggleWordType(type) {
      this.selectedWordTypes = this.selectedWordTypes.includes(type)
        ? this.selectedWordTypes.filter(t => t !== type)
        : [...this.selectedWordTypes, type];

      if (!this.targetWord || !this.selectedWordTypes.includes(this.targetWord.type)) {
        this.newWordTarget();
      } else {
        this.$nextTick(() => this.focusInput());
      }
    },
    newWordTarget() {
      this.clearWordTimer();

      // avoid showing the same word twice in a row when there are other options
      const previous = this.targetWord?.word;
      const pool = this.filteredWords.length > 1
        ? this.filteredWords.filter(({ word }) => word !== previous)
        : this.filteredWords;

      const word = weightedPick('words', pool, item => item.word);

      this.wordInputValue = '';
      this.wordRevealed = false;
      this.wordLocked = false;

      if (!word) {
        this.targetWord = null;
        this.wordStatus = 'No words match the selected types.';
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

      recordAnswer('words', word, correct);
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
        recordAnswer('words', word, false);
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
      resetProgress('words');
      this.wordProgressVersion++;
      this.wordStatus = 'Score and memory reset.';
      this.wordStatusClass = 'status';
      this.$nextTick(() => this.focusInput());
    },

    focusInput() {
      const input = this.practiceMode === 'words' ? this.$refs.wordInput : this.$refs.capture;
      input && input.focus();
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
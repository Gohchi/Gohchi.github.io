import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import PhraseToRuby from 'components/PhraseToRuby.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import KanjiPoolMenu from 'components/KanjiPoolMenu.js';
import InfoIcons from 'components/InfoIcons.js';

import template from 'templates/KanjiPractice.js';

import wordsData from 'data/words.js';
import { feedbackMixin } from 'data/feedback.js';
import { shuffle, normalizeReading, pickDistractors } from 'tools';
import {
  MAX_MEMORY,
  getEntry,
  getCategoryEntries,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

const HISTORY_LIMIT = 50;
const WORD_CORRECT_DELAY = 700; // ms before moving to the next word

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const LEVELS_KEY = 'kanji-practice-levels';
// Words the user turned off in the pool. Stored as "excluded" so new words are in the pool by default.
const EXCLUDED_KEY = 'kanji-practice-excluded';

// Progress is stored per mode, so "meaning" progress never mixes with reading progress
const CATEGORY_READING = 'words-kanji';
const CATEGORY_MEANING = 'words-kanji-meaning';

export default {
  mixins: [feedbackMixin],
  components: {
    MainHeader,
    SessionHistory,
    WordCorner,
    PhraseToRuby,
    FilterMenu,
    KanjiPoolMenu,
    InfoIcons,
  },
  data() {
    const inputMode = localStorage.getItem('kanji-practice-input-mode') || 'type';

    return {
      inputMode, // 'type' (reading / kanji) | 'choice' (pick the meaning)
      MAX_MEMORY,
      sessionHistory: [],

      words: wordsData.filter(({ type }) => type === 'kanji'),
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
      excludedWords: loadSelection(EXCLUDED_KEY, []),
    }
  },
  computed: {
    category() {
      return this.inputMode === 'choice' ? CATEGORY_MEANING : CATEGORY_READING;
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
    // Words that pass the JLPT filter. With every level selected nothing is filtered,
    // so words without a level still show up.
    levelWords() {
      if (this.selectedLevels.length === LEVELS.length) return this.words;
      return this.words.filter(({ level }) => this.selectedLevels.includes(level));
    },
    excludedSet() {
      return new Set(this.excludedWords);
    },
    // The practice pool: JLPT filter AND not turned off in the pool matrix
    filteredWords() {
      return this.levelWords.filter(({ word }) => !this.excludedSet.has(word));
    },
    // word -> memory for the current mode. One read of localStorage, not one per cell.
    memoryMap() {
      this.wordProgressVersion; // reactive dependency
      return Object.fromEntries(
        getCategoryEntries(this.category).map(([word, entry]) => [word, entry.memory])
      );
    },
    // What the pool matrix shows: every word of the selected JLPT levels
    poolItems() {
      return this.levelWords.map(({ word, reading, meaning }) => ({
        word,
        reading,
        meaning,
        memory: this.memoryMap[word] ?? 0,
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
      localStorage.setItem('kanji-practice-input-mode', value);
      this.newWordTarget();
    },
    clearWordTimer() {
      clearTimeout(this.wordTimer);
      this.wordTimer = null;
    },
    buildMeaningOptions(target) {
      // wrong answers: the practice pool first, then the selected JLPT levels, then every kanji word
      const meanings = list => list.map(({ meaning }) => meaning);
      const distractors = pickDistractors(target.meaning, [
        meanings(this.filteredWords),
        meanings(this.levelWords),
        meanings(this.words),
      ]);
      return shuffle([target.meaning, ...distractors]);
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
        this.wordStatus = 'No kanji words available.';
        this.wordStatusClass = 'status bad';
        return;
      }

      this.targetWord = word;

      if (this.inputMode === 'choice') {
        this.wordOptions = this.buildMeaningOptions(word);
        this.wordStatus = 'Pick the meaning of this word.';
      } else {
        this.wordStatus = 'Type the reading in hiragana, or the word in kanji, then press Enter.';
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
      // Accept either the hiragana reading or the word written in kanji
      const correct = normalizeReading(value) === normalizeReading(reading) || value === word;

      recordAnswer(CATEGORY_READING, word, correct);
      this.flash(correct, correct ? this.wordStreak + 1 : 0);
      this.wordProgressVersion++;

      this.pushHistory({
        type: 'word',
        prompt: word,
        detail: reading + ' | ' + meaning,
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
      this.flash(correct, correct ? this.wordStreak + 1 : 0);
      this.wordProgressVersion++;

      this.pushHistory({
        type: 'word',
        prompt: word,
        detail: reading,
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
        this.flash(false);
        this.pushHistory({
          type: 'word',
          prompt: word,
          detail: isChoice ? reading : meaning,
          chosen: '(revealed)',
          correctAnswer: isChoice ? meaning : reading,
          isCorrect: false,
        });
      }

      this.wordRevealed = true;
      this.wordStatus = isChoice
        ? `Answer: ${meaning} (${reading}). Press Skip for the next word.`
        : `Answer: ${reading} (${word}). Press Enter for the next word.`;
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
    // After a filter change, pick a new word only if the current one left the pool
    // (or if there was none because the pool was empty).
    refreshTargetIfNeeded() {
      if (!this.targetWord || !this.filteredWords.includes(this.targetWord)) {
        this.newWordTarget();
      }
    },
    setLevels(levels) {
      this.selectedLevels = levels;
      saveSelection(LEVELS_KEY, levels);
      this.refreshTargetIfNeeded();
    },
    setExcluded(words) {
      this.excludedWords = words;
      saveSelection(EXCLUDED_KEY, words);
      this.refreshTargetIfNeeded();
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
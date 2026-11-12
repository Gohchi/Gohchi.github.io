// One implementation for /hiragana-words and /katakana-words.
//   makeWordsPractice({ script: 'hiragana' })  words written in hiragana, answer: the word / its meaning
//   makeWordsPractice({ script: 'katakana' })  words written in katakana, answer: the reading in hiragana
// A word is practiced only once every kana it needs was answered correctly at least once
// (rules in data/progression.js, splitWords()); locked words are listed as teasers.
// Type mode: the reading is spelled kana by kana (components/KanaSpellInput.js), like hiragana-listen in Words mode.

import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import InfoIcons from 'components/InfoIcons.js';
import KanaSpellInput from 'components/KanaSpellInput.js';

import template from 'templates/WordsPractice.js';

import wordsData from 'data/words.js';
import { feedbackMixin } from 'data/feedback.js';
import { splitWords, markKana } from 'data/progression.js';
import { showLocked } from 'data/show-locked.js';
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
const WORD_CORRECT_DELAY = 700; // ms before moving to the next word
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export function makeWordsPractice({ script }) {
  const LEVELS_KEY = `${script}-practice-levels`;
  const INPUT_MODE_KEY = `${script}-practice-input-mode`;
  // Progress is stored per mode, so "meaning" progress never mixes with typing progress
  const CATEGORY_TYPE = `words-${script}`;
  const CATEGORY_MEANING = `words-${script}-meaning`;

  return {
    mixins: [feedbackMixin],
    components: { MainHeader, SessionHistory, WordCorner, FilterMenu, InfoIcons, KanaSpellInput },
    data() {
      const { unlocked, locked } = splitWords(wordsData.filter(({ type }) => type === script));

      return {
        script,
        lockedPref: showLocked, // Settings > Display
        title: `${script.toUpperCase()} WORDS`,
        kanaRoute: `/${script}-practice`,
        inputMode: localStorage.getItem(INPUT_MODE_KEY) || 'type', // 'type' | 'choice'
        MAX_MEMORY,
        sessionHistory: [],

        allWords: wordsData.filter(({ type }) => type === script), // distractors come from all of them
        words: unlocked,
        lockedWords: locked,
        showLocked: false,
        targetWord: null,
        wordOptions: [], // meanings shown in choice mode
        wrongOptions: [], // meanings already tried wrong for the current word
        spellRound: 0, // new value = the spelling input starts over
        wordStatus: '',
        wordStatusClass: 'status',
        wordScore: 0,
        wordStreak: 0,
        wordRevealed: false, // answer was revealed, Enter / Skip goes to the next word
        wordLocked: false, // correct answer shown, waiting for the next word
        wordTimer: null,
        wordProgressVersion: 0, // bumped after each save so the memory bar/stats refresh
        levelOptions: LEVELS.map(level => ({ key: level, label: level })),
        selectedLevels: loadSelection(LEVELS_KEY, LEVELS).filter(l => LEVELS.includes(l)),
      };
    },
    computed: {
      category() {
        return this.inputMode === 'choice' ? CATEGORY_MEANING : CATEGORY_TYPE;
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
      inputLabel() {
        if (this.inputMode === 'choice') return 'Pick the meaning';
        return script === 'hiragana' ? 'Spell the word in hiragana, kana by kana' : 'Spell the reading in hiragana, kana by kana';
      },
    },
    methods: {
      markKana,
      pushHistory(entry) {
        this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
        if (this.sessionHistory.length > HISTORY_LIMIT) this.sessionHistory.length = HISTORY_LIMIT;
      },
      setInputMode(value) {
        this.inputMode = value;
        localStorage.setItem(INPUT_MODE_KEY, value);
        this.newWordTarget();
      },
      clearWordTimer() {
        clearTimeout(this.wordTimer);
        this.wordTimer = null;
      },
      buildMeaningOptions(target) {
        // Distractors come from the other words' meanings of the same script, so nothing gives the
        // answer away; they use every word (not only the unlocked ones) so there are always enough.
        const pool = [...new Set(
          this.allWords
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

        this.spellRound++;
        this.wordOptions = [];
        this.wrongOptions = [];
        this.wordRevealed = false;
        this.wordLocked = false;

        if (!word) {
          this.targetWord = null;
          this.wordStatus = this.words.length
            ? 'No words for the selected levels.'
            : `No words unlocked yet. Answer ${script} characters correctly and words will open here.`;
          this.wordStatusClass = 'status bad';
          return;
        }

        this.targetWord = word;

        if (this.inputMode === 'choice') {
          this.wordOptions = this.buildMeaningOptions(word);
          this.wordStatus = 'Pick the meaning of this word.';
        } else {
          this.wordStatus = 'Type the word, kana by kana.';
        }
        this.wordStatusClass = 'status';
        this.$nextTick(() => this.focusInput());
      },

      // --- type mode: the spelling input reports every wrong kana and the finished word ---
      onMistake(typed) {
        this.wordStatus = `Wrong: "${typed}"`;
        this.wordStatusClass = 'status bad';
        this.flash(false, 0);
      },
      // one answer per word: right when no kana needed a second try
      onSpelled({ mistakes }) {
        if (!this.targetWord || this.wordLocked || this.wordRevealed) return;

        const { word, reading, meaning } = this.targetWord;
        const correct = mistakes === 0;

        recordAnswer(CATEGORY_TYPE, word, correct);
        this.flash(correct, correct ? this.wordStreak + 1 : 0);
        this.wordProgressVersion++;

        this.pushHistory({
          type: 'word',
          prompt: word,
          detail: meaning,
          chosen: correct ? reading : `${mistakes} wrong ${mistakes === 1 ? 'kana' : 'kana'}`,
          correctAnswer: reading,
          isCorrect: correct,
        });

        this.wordScore++;
        this.wordStreak = correct ? this.wordStreak + 1 : 0;
        this.wordStatus = `${correct ? 'Correct!' : 'Done.'} ${reading} = ${meaning}`;
        this.wordStatusClass = correct ? 'status ok' : 'status bad';
        this.wordLocked = true;
        this.wordTimer = setTimeout(() => this.newWordTarget(), WORD_CORRECT_DELAY * 2);
      },
      // the Check button
      checkWordAnswer() {
        if (this.$refs.wordInput) this.$refs.wordInput.submit();
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
            detail: isChoice ? 'meaning' : meaning,
            chosen: '(revealed)',
            correctAnswer: isChoice ? meaning : reading,
            isCorrect: false,
          });
        }

        this.wordRevealed = true;
        if (!isChoice && this.$refs.wordInput) this.$refs.wordInput.reveal();
        this.wordStatus = isChoice
          ? `Answer: ${meaning} (${reading}). Press Skip for the next word.`
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
        if (!this.targetWord || !this.filteredWords.includes(this.targetWord)) this.newWordTarget();
      },
    },
    mounted() {
      this.newWordTarget();
      document.addEventListener('click', this.onDocumentClick);
    },
    beforeUnmount() {
      this.clearWordTimer();
      document.removeEventListener('click', this.onDocumentClick);
    },
    template,
  };
}
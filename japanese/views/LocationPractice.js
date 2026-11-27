// /location-practice
// A scene shows an icon placed somewhere around another one (or between two). The sentence under it has a
// blank ("猫は箱の（　）にいます。") and the person answers with the location word:
//   choice mode  pick it among 4 (written in kanji or in hiragana, switch in the header)
//   type mode    write it in hiragana or in kanji (the meaning is shown to tell similar words apart)
// Progress is kept per word in the `location` category (key = the word, e.g. 隣).

import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import KanjiPoolMenu from 'components/KanjiPoolMenu.js';
import InfoIcons from 'components/InfoIcons.js';
import KanaSpellInput from 'components/KanaSpellInput.js';

import template from 'templates/LocationPractice.js';

import { LOCATIONS, SUBJECTS, REFS, CONTAINERS } from 'data/locations.js';
import { feedbackMixin } from 'data/feedback.js';
import { shuffle, alignFurigana } from 'tools';
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

const CATEGORY = 'location';
const HISTORY_LIMIT = 50;
const CORRECT_DELAY = 1100; // ms before moving to the next scene

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const LEVELS_KEY = 'location-practice-levels';
const INPUT_MODE_KEY = 'location-practice-input-mode';
const SCRIPT_KEY = 'location-practice-script';
// Words the user turned off in the pool. Stored as "excluded" so new words are in the pool by default.
const EXCLUDED_KEY = 'location-practice-excluded';

const pick = list => list[Math.floor(Math.random() * list.length)];

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
    return {
      inputMode: localStorage.getItem(INPUT_MODE_KEY) === 'type' ? 'type' : 'choice',
      script: localStorage.getItem(SCRIPT_KEY) === 'kana' ? 'kana' : 'kanji', // how the options are written
      MAX_MEMORY,
      sessionHistory: [],
      furiganaStore,

      locations: LOCATIONS,
      levelOptions: LEVELS.map(level => ({ key: level, label: level })),
      selectedLevels: loadSelection(LEVELS_KEY, LEVELS).filter(l => LEVELS.includes(l)),
      excludedWords: loadSelection(EXCLUDED_KEY, []),

      target: null,
      scene: null, // { layout, sub, refs }
      sentence: [], // [{ text, reading? } | { blank: true }]
      options: [],
      wrongOptions: [], // words already tried wrong for this scene
      spellRound: 0,
      status: '',
      statusClass: 'status',
      score: 0,
      streak: 0,
      revealed: false, // answer shown (counted as a miss)
      locked: false, // correct answer shown, waiting for the next scene
      timer: null,
      progressVersion: 0, // bumped after each save so the memory bar / stats / pool refresh
    };
  },
  computed: {
    // with every level selected nothing is filtered
    levelItems() {
      if (this.selectedLevels.length === LEVELS.length) return this.locations;
      return this.locations.filter(({ level }) => this.selectedLevels.includes(level));
    },
    excludedSet() {
      return new Set(this.excludedWords);
    },
    // The practice pool: JLPT filter AND not turned off in the pool matrix
    filteredItems() {
      return this.levelItems.filter(({ word }) => !this.excludedSet.has(word));
    },
    memory() {
      this.progressVersion; // reactive dependency, progress lives in localStorage
      return this.target ? getEntry(CATEGORY, this.target.word).memory : 0;
    },
    stats() {
      this.progressVersion;
      return getStats(CATEGORY, this.filteredItems.map(({ word }) => word));
    },
    poolItems() {
      this.progressVersion;
      const entries = Object.fromEntries(getCategoryEntries(CATEGORY));
      return this.levelItems.map(({ word, reading, meaning, level, group }) => ({
        word,
        reading,
        meaning,
        level,
        tags: [group],
        memory: entries[word]?.memory ?? 0,
      }));
    },
    sceneClass() {
      return this.scene?.layout.depth ? 'depth-' + this.scene.layout.depth : '';
    },
    answerText() {
      return this.target ? `${this.target.word} (${this.target.reading})` : '';
    },
  },
  methods: {
    pushHistory(entry) {
      this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
      if (this.sessionHistory.length > HISTORY_LIMIT) this.sessionHistory.length = HISTORY_LIMIT;
    },
    rubyParts(word, reading) {
      return alignFurigana(word, reading);
    },
    cell([column, row]) {
      return { '--c': column, '--r': row };
    },

    // --- settings ---
    setInputMode(value) {
      this.inputMode = value;
      localStorage.setItem(INPUT_MODE_KEY, value);
      this.newTarget();
    },
    toggleScript() {
      this.script = this.script === 'kanji' ? 'kana' : 'kanji';
      localStorage.setItem(SCRIPT_KEY, this.script);
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
    // After a filter change, pick a new scene only if the current word left the pool
    refreshTargetIfNeeded() {
      if (!this.target || !this.filteredItems.includes(this.target)) this.newTarget();
    },

    // --- building a scene ---
    buildScene(item) {
      const layout = pick(item.layouts);
      const sub = pick(SUBJECTS);
      const pool = item.group === 'container' ? REFS.filter(({ word }) => CONTAINERS.includes(word)) : REFS;
      const refs = shuffle(pool).slice(0, layout.refs.length);
      return { layout, sub, refs };
    },
    // 猫は箱の（　）にいます。 / 猫は箱と車の（　）にいます。
    buildSentence({ sub, refs }) {
      const noun = ({ word, reading }) => ({ text: word, reading });
      const tokens = [noun(sub), { text: 'は' }];
      refs.forEach((ref, i) => {
        if (i) tokens.push({ text: 'と' });
        tokens.push(noun(ref));
      });
      tokens.push({ text: 'の' }, { blank: true }, { text: 'に' }, { text: sub.animate ? 'います。' : 'あります。' });
      return tokens;
    },
    // Wrong options never come from the target's group (one picture can fit 隣 and 右), one per group.
    buildOptions(target) {
      const byGroup = new Map();
      shuffle(this.locations.filter(({ group }) => group !== target.group)).forEach(item => {
        if (!byGroup.has(item.group)) byGroup.set(item.group, item);
      });
      return shuffle([target, ...shuffle([...byGroup.values()]).slice(0, 3)]);
    },

    // --- flow ---
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    newTarget() {
      this.clearTimer();

      // avoid the same word twice in a row when there are other options
      const previous = this.target?.word;
      const pool = this.filteredItems.length > 1
        ? this.filteredItems.filter(({ word }) => word !== previous)
        : this.filteredItems;
      const item = weightedPick(CATEGORY, pool, entry => entry.word);

      this.spellRound++;
      this.options = [];
      this.wrongOptions = [];
      this.revealed = false;
      this.locked = false;

      if (!item) {
        this.target = null;
        this.scene = null;
        this.sentence = [];
        this.status = 'No location words in the selected pool.';
        this.statusClass = 'status bad';
        return;
      }

      this.target = item;
      this.scene = this.buildScene(item);
      this.sentence = this.buildSentence(this.scene);
      this.options = this.inputMode === 'choice' ? this.buildOptions(item) : [];
      this.status = this.inputMode === 'choice'
        ? 'Where is it? Pick the word.'
        : 'Spell the reading in hiragana, kana by kana.';
      this.statusClass = 'status';
      this.$nextTick(() => this.focusInput());
    },
    // one place for both modes: records, animates, writes the history and schedules the next scene
    grade(correct, chosen, correctAnswer) {
      const { word, reading, meaning } = this.target;

      recordAnswer(CATEGORY, word, correct);
      this.progressVersion++;
      this.flash(correct, correct ? this.streak + 1 : 0);
      this.pushHistory({
        type: 'location',
        prompt: this.sentence.map(token => (token.blank ? '（　）' : token.text)).join(''),
        detail: meaning,
        chosen,
        correctAnswer,
        isCorrect: correct,
      });

      if (correct) {
        this.score++;
        this.streak++;
        this.status = `Correct! ${word} (${reading}) = ${meaning}`;
        this.statusClass = 'status ok';
        this.locked = true;
        this.timer = setTimeout(() => this.newTarget(), CORRECT_DELAY);
      } else {
        this.streak = 0;
      }
    },
    chooseOption(option) {
      if (!this.target || this.locked || this.revealed) return;
      if (this.wrongOptions.includes(option.word)) return;

      const correct = option.word === this.target.word;
      const shown = this.script === 'kana' ? option.reading : option.word;
      const answer = this.script === 'kana' ? this.target.reading : this.target.word;
      this.grade(correct, shown, answer);

      if (!correct) {
        this.wrongOptions.push(option.word);
        this.status = 'Not quite, try another one.';
        this.statusClass = 'status bad';
      }
    },
    onMistake(typed) {
      this.status = `Wrong: "${typed}"`;
      this.statusClass = 'status bad';
      this.flash(false, 0);
    },
    onSpelled({ mistakes }) {
      if (!this.target || this.locked || this.revealed) return;

      const { reading, meaning } = this.target;
      const correct = mistakes === 0;
      this.grade(correct, correct ? reading : `${mistakes} wrong kana`, reading);
      this.status = `${correct ? 'Correct!' : 'Done.'} ${reading} = ${meaning}`;
      this.statusClass = correct ? 'status ok' : 'status bad';
    },
    checkTyped() {
      if (this.$refs.wordInput) this.$refs.wordInput.submit();
    },
    reveal() {
      if (!this.target || this.locked) return;
      const { word, reading, meaning } = this.target;

      // giving up counts as a miss, once per scene
      if (!this.revealed) {
        recordAnswer(CATEGORY, word, false);
        this.progressVersion++;
        this.streak = 0;
        this.flash(false);
        this.pushHistory({
          type: 'location',
          prompt: this.sentence.map(token => (token.blank ? '（　）' : token.text)).join(''),
          detail: meaning,
          chosen: '(revealed)',
          correctAnswer: reading,
          isCorrect: false,
        });
      }

      this.revealed = true;
      if (this.inputMode === 'type' && this.$refs.wordInput) this.$refs.wordInput.reveal();
      this.status = this.inputMode === 'choice'
        ? `Answer: ${word} (${reading}) = ${meaning}. Press Skip for the next one.`
        : `Answer: ${word} (${reading}) = ${meaning}. Press Enter for the next one.`;
      this.statusClass = 'status';
      this.focusInput();
    },
    resetScore() {
      this.score = 0;
      this.streak = 0;
      resetProgress(CATEGORY);
      this.progressVersion++;
      this.status = 'Score and memory reset.';
      this.statusClass = 'status';
      this.$nextTick(() => this.focusInput());
    },
    focusInput() {
      this.$refs.wordInput && this.$refs.wordInput.focus();
    },
    onDocumentClick() {
      if (this.inputMode === 'type') this.focusInput();
    },
  },
  mounted() {
    this.newTarget();
    document.addEventListener('click', this.onDocumentClick);
  },
  beforeUnmount() {
    this.clearTimer();
    document.removeEventListener('click', this.onDocumentClick);
  },
  template,
};
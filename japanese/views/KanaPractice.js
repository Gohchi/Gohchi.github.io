// One implementation for the four kana character routes:
//   /hiragana-practice  makeKanaPractice({ script: 'hiragana', mode: 'choice' })   pick the reading
//   /hiragana-keyboard  makeKanaPractice({ script: 'hiragana', mode: 'type' })     type the kana
//   /katakana-practice  and /katakana-keyboard: same with script 'katakana'
// Hiragana (or katakana) choice and typing share the progress category, so XP is never counted twice.

import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import InfoIcons from 'components/InfoIcons.js';

import template from 'templates/KanaPractice.js';

import { hiragana, katakana, kanaMap } from 'data/kana-romaji.js';
import { feedbackMixin } from 'data/feedback.js';
import { isRouteUnlocked } from 'data/progression.js';
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

export function makeKanaPractice({ script, mode }) {
  const table = script === 'hiragana' ? hiragana : katakana;
  const category = `kana-${script}`;
  const Script = script === 'hiragana' ? 'HIRAGANA' : 'KATAKANA';

  // the other way to practice the same kana: shown only when that route is unlocked
  const siblingRoute = `/${script}-${mode === 'type' ? 'practice' : 'keyboard'}`;

  return {
    mixins: [feedbackMixin],
    components: { MainHeader, SessionHistory, WordCorner, InfoIcons },
    data() {
      return {
        mode,
        MAX_MEMORY,
        sessionHistory: [],

        KANA: Object.keys(table),
        target: '',
        kanaOptions: [],
        score: 0,
        streak: 0,
        last: '-',
        status: 'Click anywhere and start typing.',
        statusClass: 'status',
        inputValue: '',
        progressVersion: 0, // bumped after each save so the memory bar/stats refresh
      };
    },
    computed: {
      title() {
        return `${Script} ${mode === 'type' ? 'KEYBOARD' : 'CHARACTERS'}`;
      },
      siblingTo() {
        return isRouteUnlocked(siblingRoute) ? siblingRoute : '';
      },
      siblingIcon() {
        return mode === 'type' ? 'check-icon' : 'keyboard-icon';
      },
      siblingTitle() {
        return mode === 'type' ? 'Options mode' : 'Type mode';
      },
      kanaMemory() {
        this.progressVersion; // reactive dependency
        return this.target ? getEntry(category, this.target).memory : 0;
      },
      kanaStats() {
        this.progressVersion; // reactive dependency
        return getStats(category, this.KANA);
      },
    },
    methods: {
      pushHistory(entry) {
        this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
        if (this.sessionHistory.length > HISTORY_LIMIT) this.sessionHistory.length = HISTORY_LIMIT;
      },
      buildKanaOptions(correctKana) {
        const wrongs = shuffle(this.KANA.filter(k => k !== correctKana)).slice(0, 3);
        return shuffle([correctKana, ...wrongs]).map(k => ({ kana: k, romaji: table[k] }));
      },
      newTarget() {
        this.target = weightedPick(category, this.KANA, k => k);
        this.kanaOptions = this.buildKanaOptions(this.target);
        this.status = mode === 'type' ? 'Type the kana shown above.' : 'Pick the reading that matches.';
        this.statusClass = 'status';
        this.inputValue = '';
        if (mode === 'type') this.$nextTick(() => this.focusInput());
      },
      resetScore() {
        this.score = 0;
        this.streak = 0;
        resetProgress(category);
        this.progressVersion++;
        this.status = 'Score and memory reset.';
        this.statusClass = 'status';
        this.$nextTick(() => this.focusInput());
      },
      handleKana(candidate) {
        this.last = candidate;
        const correct = candidate === this.target;
        recordAnswer(category, this.target, correct);
        this.flash(correct, correct ? this.streak + 1 : 0);
        this.progressVersion++;

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
          this.status = 'Correct!';
          this.statusClass = 'status ok';
          this.newTarget();
        } else {
          this.streak = 0;
          this.status = `Wrong: "${candidate}"`;
          this.statusClass = 'status bad';
        }
      },
      onInput(e) {
        const { data } = e;
        if (!data) return;
        // typing goes through a romaji->hiragana IME, so katakana needs the converted character
        const raw = [...data].at(-1);
        this.handleKana(script === 'katakana' ? (kanaMap[raw] || raw) : raw);
        this.inputValue = data;
        e.target.value = '';
      },
      chooseKanaOption(option) {
        this.handleKana(option.kana);
      },
      focusInput() {
        if (mode === 'type') this.$refs.capture && this.$refs.capture.focus();
      },
      onDocumentClick() {
        if (mode === 'type') this.focusInput();
      },
    },
    mounted() {
      this.newTarget();
      document.addEventListener('click', this.onDocumentClick);
    },
    beforeUnmount() {
      document.removeEventListener('click', this.onDocumentClick);
    },
    template,
  };
}

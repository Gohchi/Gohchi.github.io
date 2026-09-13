import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';
import template from 'templates/KanaKeyboard.js';

import verbsData from 'data/verbs.js';
import kanaRomaji from 'data/kana-romaji.js';
import { conjugateVerb, VERB_FORMS, FORM_LABELS } from 'data/conjugate.js';
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

export default {
  components: {
    MainHeader,
  },
  setup() {
    const capture = ref(null);
    const verbInput = ref(null);

    return { capture, verbInput };
  },
  data() {
    const inputMode = localStorage.getItem('kana-keyboard-input-mode') || 'type';

    return {
      mode: 'kana', // 'kana' | 'verbs'
      inputMode, // 'type' | 'choice'
      MAX_MEMORY,

      // --- kana practice ---
      showMenu: false,
      furigana: true,
      KANA: [
        "あ","い","う","え","お",
        "か","き","く","け","こ",
        "さ","し","す","せ","そ",
        "た","ち","つ","て","と",
        "な","に","ぬ","ね","の",
        "は","ひ","ふ","へ","ほ",
        "ま","み","む","め","も",
        "や","ゆ","よ",
        "ら","り","る","れ","ろ",
        "わ","を","ん"
      ],
      target: "",
      kanaOptions: [],
      score: 0,
      streak: 0,
      last: "-",
      status: "Click anywhere and start typing.",
      statusClass: "status",
      inputValue: "",

      // --- verb practice ---
      verbs: verbsData,
      verbForms: VERB_FORMS,
      verbLevels: ['N5', 'N4', 'N3', 'N2', 'N1'],
      selectedLevels: ['N5', 'N4'],
      selectedGroups: [1, 2, 3],
      targetVerb: null,
      targetForm: '',
      verbAnswer: '',
      verbOptions: [],
      verbInputValue: '',
      verbStatus: '',
      verbStatusClass: 'status',
      verbScore: 0,
      verbStreak: 0,
    }
  },
  computed: {
    filteredVerbs() {
      return this.verbs.filter(
        v => this.selectedLevels.includes(v.level) && this.selectedGroups.includes(v.group)
      );
    },
    formLabel() {
      return FORM_LABELS[this.targetForm] || '';
    },
    kanaMemory() {
      return this.target ? getEntry('kana', this.target).memory : 0;
    },
    verbMemoryKey() {
      return this.targetVerb ? `${this.targetVerb.dictionary}:${this.targetForm}` : null;
    },
    verbMemory() {
      return this.verbMemoryKey ? getEntry('verbs', this.verbMemoryKey).memory : 0;
    },
    kanaStats() {
      return getStats('kana', this.KANA);
    },
    verbStats() {
      const keys = [];
      this.filteredVerbs.forEach(v => this.verbForms.forEach(f => keys.push(`${v.dictionary}:${f}`)));
      return getStats('verbs', keys);
    },
  },
  methods: {
    // --- shared ---
    switchMode(mode) {
      this.mode = mode;
      if (mode === 'verbs' && !this.targetVerb) {
        this.newVerbTarget();
      }
      if (mode === 'kana') {
        this.$nextTick(() => this.focusInput());
      }
    },
    setInputMode(value) {
      this.inputMode = value;
      localStorage.setItem('kana-keyboard-input-mode', value);
      if (this.mode === 'kana') {
        this.newTarget();
      } else {
        this.newVerbTarget();
      }
    },

    // --- kana practice ---
    buildKanaOptions(correctKana) {
      const wrongPool = this.KANA.filter(k => k !== correctKana);
      const wrongs = shuffle(wrongPool).slice(0, 3);
      return shuffle([correctKana, ...wrongs]).map(k => ({ kana: k, romaji: kanaRomaji[k] }));
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
      const correct = kana === this.target;
      recordAnswer('kana', this.target, correct);

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
      const kana = [...data].at(-1);
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

    // --- verb practice ---
    toggleLevel(level) {
      this.selectedLevels = this.selectedLevels.includes(level)
        ? this.selectedLevels.filter(l => l !== level)
        : [...this.selectedLevels, level];
      this.refreshVerbTargetIfNeeded();
    },
    toggleGroup(group) {
      this.selectedGroups = this.selectedGroups.includes(group)
        ? this.selectedGroups.filter(g => g !== group)
        : [...this.selectedGroups, group];
      this.refreshVerbTargetIfNeeded();
    },
    refreshVerbTargetIfNeeded() {
      if (!this.targetVerb || !this.filteredVerbs.includes(this.targetVerb)) {
        this.newVerbTarget();
      }
    },
    buildVerbOptions(correctAnswer, form) {
      const otherVerbs = this.filteredVerbs.filter(v => v !== this.targetVerb);
      const distractors = shuffle(otherVerbs)
        .map(v => conjugateVerb(v.dictionary, v.group, form))
        .filter(answer => answer && answer !== correctAnswer);

      // dedupe, fall back to other forms of the same verb if the pool is too small
      const unique = [...new Set(distractors)];
      if (unique.length < 3 && this.targetVerb) {
        this.verbForms
          .filter(f => f !== form)
          .forEach(f => {
            const alt = conjugateVerb(this.targetVerb.dictionary, this.targetVerb.group, f);
            if (alt && alt !== correctAnswer && !unique.includes(alt)) unique.push(alt);
          });
      }

      return shuffle([correctAnswer, ...unique.slice(0, 3)]);
    },
    randomForm() {
      return this.verbForms[Math.floor(Math.random() * this.verbForms.length)];
    },
    newVerbTarget() {
      const verb = weightedPick('verbs', this.filteredVerbs, v => `${v.dictionary}:${this.randomForm()}`)
        || this.filteredVerbs[Math.floor(Math.random() * this.filteredVerbs.length)];

      if (!verb) {
        this.targetVerb = null;
        this.verbStatus = 'No verbs match the selected filters.';
        this.verbStatusClass = 'status bad';
        return;
      }

      this.targetVerb = verb;
      this.targetForm = this.randomForm();
      this.verbAnswer = conjugateVerb(verb.dictionary, verb.group, this.targetForm);
      this.verbOptions = this.inputMode === 'choice'
        ? this.buildVerbOptions(this.verbAnswer, this.targetForm)
        : [];
      this.verbInputValue = '';
      this.verbStatus = this.inputMode === 'type'
        ? 'Type the ' + this.formLabel + ' of this verb.'
        : 'Pick the ' + this.formLabel + ' of this verb.';
      this.verbStatusClass = 'status';
      if (this.inputMode === 'type') {
        this.$nextTick(() => this.focusVerbInput());
      }
    },
    checkVerbAnswer() {
      if (!this.targetVerb) return;
      const value = this.verbInputValue.trim();
      if (!value) return;
      this.gradeVerbAnswer(value);
    },
    chooseVerbOption(option) {
      this.gradeVerbAnswer(option);
    },
    gradeVerbAnswer(value) {
      const correct = value === this.verbAnswer;
      recordAnswer('verbs', this.verbMemoryKey, correct);

      if (correct) {
        this.verbScore++;
        this.verbStreak++;
        this.verbStatus = 'Correct! ' + this.verbAnswer;
        this.verbStatusClass = 'status ok';
        setTimeout(() => this.newVerbTarget(), 700);
      } else {
        this.verbStreak = 0;
        this.verbStatus = 'Not quite, try again.';
        this.verbStatusClass = 'status bad';
      }
    },
    revealAnswer() {
      if (!this.targetVerb) return;
      this.verbStatus = 'Answer: ' + this.verbAnswer;
      this.verbStatusClass = 'status';
    },
    resetVerbScore() {
      this.verbScore = 0;
      this.verbStreak = 0;
      resetProgress('verbs');
      this.$nextTick(() => this.focusVerbInput());
    },
    focusVerbInput() {
      this.$refs.verbInput && this.$refs.verbInput.focus();
    },
  },
  mounted() {
    this.newTarget();
    document.addEventListener("click", () => {
      if (this.mode === 'kana' && this.inputMode === 'type') this.focusInput();
    });
  },
  template
}
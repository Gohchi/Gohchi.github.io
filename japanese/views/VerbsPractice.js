import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import template from 'templates/VerbsPractice.js';

import verbsData from 'data/verbs.js';
import { conjugateVerb, buildVerbDistractors, VERB_FORMS, FORM_LABELS } from 'data/conjugate.js';
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
    return {};
  },
  data() {
    const inputMode = localStorage.getItem('verbs-practice-input-mode') || 'type';

    return {
      inputMode, // 'type' | 'choice'
      MAX_MEMORY,
      sessionHistory: [],

      verbs: verbsData,
      verbForms: VERB_FORMS,
      verbLevels: ['N5', 'N4', 'N3', 'N2', 'N1'],
      selectedLevels: ['N5', 'N4'],
      selectedGroups: [1, 2, 3],
      targetVerb: null,
      targetForm: '',
      verbAnswer: '',
      verbAnswerKana: '',
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
    verbMemoryKey() {
      return this.targetVerb ? `${this.targetVerb.dictionary}:${this.targetForm}` : null;
    },
    verbMemory() {
      return this.verbMemoryKey ? getEntry('verbs', this.verbMemoryKey).memory : 0;
    },
    verbStats() {
      const keys = [];
      this.filteredVerbs.forEach(v => this.verbForms.forEach(f => keys.push(`${v.dictionary}:${f}`)));
      return getStats('verbs', keys);
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
      localStorage.setItem('verbs-practice-input-mode', value);
      this.newVerbTarget();
    },
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
    buildVerbOptions(verb, form, correctAnswer) {
      const distractors = shuffle(buildVerbDistractors(verb, form)).slice(0, 3);
      return shuffle([correctAnswer, ...distractors]);
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
      this.verbAnswerKana = conjugateVerb(verb.reading, verb.group, this.targetForm);
      this.verbOptions = this.inputMode === 'choice'
        ? this.buildVerbOptions(verb, this.targetForm, this.verbAnswer)
        : [];
      this.verbInputValue = '';
      this.verbStatus = this.inputMode === 'type'
        ? 'Type the ' + this.formLabel + ' (kanji or hiragana are both fine).'
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
      if (!this.targetVerb) return;
      const correct = value === this.verbAnswer || value === this.verbAnswerKana;
      recordAnswer('verbs', this.verbMemoryKey, correct);

      this.pushHistory({
        type: 'verb',
        prompt: this.targetVerb.dictionary,
        detail: this.formLabel,
        chosen: value,
        correctAnswer: this.formattedAnswer(),
        isCorrect: correct,
      });

      if (correct) {
        this.verbScore++;
        this.verbStreak++;
        this.verbStatus = 'Correct! ' + this.formattedAnswer();
        this.verbStatusClass = 'status ok';
        setTimeout(() => this.newVerbTarget(), 700);
      } else {
        this.verbStreak = 0;
        this.verbStatus = 'Not quite, try again.';
        this.verbStatusClass = 'status bad';
      }
    },
    formattedAnswer() {
      return this.verbAnswerKana !== this.verbAnswer
        ? `${this.verbAnswer} (${this.verbAnswerKana})`
        : this.verbAnswer;
    },
    revealAnswer() {
      if (!this.targetVerb) return;
      this.verbStatus = 'Answer: ' + this.formattedAnswer();
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
    this.newVerbTarget();
  },
  template
}
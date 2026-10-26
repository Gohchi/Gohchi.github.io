import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import template from 'templates/VerbsPractice.js';
import InfoIcons from 'components/InfoIcons.js';

import verbsData from 'data/verbs.js';
import { conjugateVerb, buildVerbDistractors, VERB_FORMS, FORM_LABELS } from 'data/conjugate.js';
import { feedbackMixin } from 'data/feedback.js';
import {
  MAX_MEMORY,
  getEntry,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

import { furiganaStore } from 'store';

import { shuffle, alignFurigana } from 'tools'; // CHANGED: alignFurigana added

const HISTORY_LIMIT = 50;

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const GROUPS = [
  { key: 1, label: 'Group 1 · godan (う)' },
  { key: 2, label: 'Group 2 · ichidan (る)' },
  { key: 3, label: 'Group 3 · irregular' },
];
const FORMS = VERB_FORMS.map(key => ({ key, label: FORM_LABELS[key] }));

const LEVELS_KEY = 'verbs-practice-levels';
const GROUPS_KEY = 'verbs-practice-groups';
const FORMS_KEY = 'verbs-practice-forms';

export default {
  mixins: [feedbackMixin],
  components: {
    MainHeader,
    SessionHistory,
    FilterMenu,
    WordCorner,
    InfoIcons,
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
      levelOptions: LEVELS.map(level => ({ key: level, label: level })),
      groupOptions: GROUPS,
      formOptions: FORMS,
      selectedLevels: loadSelection(LEVELS_KEY, ['N5', 'N4']).filter(l => LEVELS.includes(l)),
      selectedGroups: loadSelection(GROUPS_KEY, [1, 2, 3]).filter(g => GROUPS.some(o => o.key === g)),
      selectedForms: loadSelection(FORMS_KEY, VERB_FORMS).filter(f => VERB_FORMS.includes(f)),
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

      furiganaStore,
    }
  },
  computed: {
    filteredVerbs() {
      return this.verbs.filter(
        v => this.selectedLevels.includes(v.level) && this.selectedGroups.includes(v.group)
      );
    },
    // every (verb, form) combination allowed by the filters
    candidates() {
      const list = [];
      this.filteredVerbs.forEach(verb => {
        this.selectedForms.forEach(form => list.push({ verb, form }));
      });
      return list;
    },
    // NEW: [{ text, rt? }] the reading only goes over the kanji (教える -> 教(おし) + える)
    promptParts() {
      if (!this.targetVerb) return [];
      const { dictionary, reading } = this.targetVerb;
      return alignFurigana(dictionary, reading);
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
      const keys = this.candidates.map(({ verb, form }) => `${verb.dictionary}:${form}`);
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
    setLevels(levels) {
      this.selectedLevels = levels;
      saveSelection(LEVELS_KEY, levels);
      this.refreshVerbTargetIfNeeded();
    },
    setGroups(groups) {
      this.selectedGroups = groups;
      saveSelection(GROUPS_KEY, groups);
      this.refreshVerbTargetIfNeeded();
    },
    setForms(forms) {
      this.selectedForms = forms;
      saveSelection(FORMS_KEY, forms);
      this.refreshVerbTargetIfNeeded();
    },
    refreshVerbTargetIfNeeded() {
      if (
        !this.targetVerb
        || !this.filteredVerbs.includes(this.targetVerb)
        || !this.selectedForms.includes(this.targetForm)
      ) {
        this.newVerbTarget();
      }
    },
    buildVerbOptions(verb, form, correctAnswer) {
      const distractors = shuffle(buildVerbDistractors(verb, form)).slice(0, 3);
      return shuffle([correctAnswer, ...distractors]);
    },
    newVerbTarget() {
      const pick = weightedPick('verbs', this.candidates, c => `${c.verb.dictionary}:${c.form}`);

      if (!pick) {
        this.targetVerb = null;
        this.targetForm = '';
        this.verbStatus = this.filteredVerbs.length
          ? 'Select at least one form.'
          : 'No verbs match the selected filters.';
        this.verbStatusClass = 'status bad';
        return;
      }

      const { verb, form } = pick;
      this.targetVerb = verb;
      this.targetForm = form;
      this.verbAnswer = conjugateVerb(verb.dictionary, verb.group, form);
      this.verbAnswerKana = conjugateVerb(verb.reading, verb.group, form);
      this.verbOptions = this.inputMode === 'choice'
        ? this.buildVerbOptions(verb, form, this.verbAnswer)
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
      const { dictionary, reading } = this.targetVerb;
      const correct = value === this.verbAnswer || value === this.verbAnswerKana;
      recordAnswer('verbs', this.verbMemoryKey, correct);
      this.flash(correct, correct ? this.verbStreak + 1 : 0);

      this.pushHistory({
        type: 'verb',
        prompt: dictionary,
        detail: reading + ' | ' + this.formLabel,
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
        this.verbStatus = 'Not quite, try another one.';
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
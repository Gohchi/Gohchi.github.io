import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';
import template from 'templates/KanaKeyboard.js';

import verbsData from 'data/verbs.js';
import { conjugateVerb, VERB_FORMS, FORM_LABELS } from 'data/conjugate.js';

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
    return {
      mode: 'kana', // 'kana' | 'verbs'

      // --- kana practice (unchanged) ---
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
  },
  methods: {
    // --- kana practice ---
    randomKana() {
      return this.KANA[Math.floor(Math.random() * this.KANA.length)];
    },
    newTarget() {
      this.target = this.randomKana();
      this.status = "Type the kana shown above.";
      this.statusClass = "status";
      this.inputValue = "";
      this.$nextTick(() => this.focusInput());
    },
    resetScore() {
      this.score = 0;
      this.streak = 0;
      this.status = "Score reset.";
      this.statusClass = "status";
      this.$nextTick(() => this.focusInput());
    },
    handleKana(kana) {
      this.last = kana;
      if (kana === this.target) {
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
    focusInput() {
      this.$refs.capture.focus();
    },

    // --- verb practice ---
    switchMode(mode) {
      this.mode = mode;
      if (mode === 'verbs' && !this.targetVerb) {
        this.newVerbTarget();
      }
      if (mode === 'kana') {
        this.$nextTick(() => this.focusInput());
      }
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
    randomVerb() {
      const list = this.filteredVerbs;
      if (!list.length) return null;
      return list[Math.floor(Math.random() * list.length)];
    },
    randomForm() {
      return this.verbForms[Math.floor(Math.random() * this.verbForms.length)];
    },
    newVerbTarget() {
      const verb = this.randomVerb();
      if (!verb) {
        this.targetVerb = null;
        this.verbStatus = 'No verbs match the selected filters.';
        this.verbStatusClass = 'status bad';
        return;
      }
      this.targetVerb = verb;
      this.targetForm = this.randomForm();
      this.verbAnswer = conjugateVerb(verb.dictionary, verb.group, this.targetForm);
      this.verbInputValue = '';
      this.verbStatus = 'Type the ' + this.formLabel + ' of this verb.';
      this.verbStatusClass = 'status';
      this.$nextTick(() => this.focusVerbInput());
    },
    checkVerbAnswer() {
      if (!this.targetVerb) return;
      const value = this.verbInputValue.trim();
      if (!value) return;

      if (value === this.verbAnswer) {
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
      this.$nextTick(() => this.focusVerbInput());
    },
    focusVerbInput() {
      this.$refs.verbInput && this.$refs.verbInput.focus();
    },
  },
  mounted() {
    this.newTarget();
    document.addEventListener("click", () => {
      if (this.mode === 'kana') this.focusInput();
    });
  },
  template
}
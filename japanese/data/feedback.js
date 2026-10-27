// Shared right/wrong feedback for the practice views.
//
//   mixins: [feedbackMixin]
//   template:  <div class="card choice-card" :class="feedbackClass">
//   code:      this.flash(isCorrect, newStreak)
//
// The CSS lives in practice.css. This file only toggles the classes, and
// restarts the animation when the same result happens twice in a row.

const DURATION = 900; // ms the feedback class stays on the card

export const feedbackMixin = {
  data() {
    return {
      feedback: '', // '' | 'ok' | 'bad'
      feedbackBig: false, // streak milestone
    };
  },
  computed: {
    feedbackClass() {
      return {
        'feedback-ok': this.feedback === 'ok',
        'feedback-bad': this.feedback === 'bad',
        'feedback-streak': this.feedbackBig,
      };
    },
  },
  created() {
    this.feedbackInternals = { raf: 0, timer: 0 };
  },
  methods: {
    flash(isCorrect, streak = 0) {
      const state = this.feedbackInternals;
      clearTimeout(state.timer);
      cancelAnimationFrame(state.raf);

      // a tapped option keeps :focus / :active on touch screens; drop them so the next word starts clean
      const active = document.activeElement;
      if (active?.classList?.contains('choice-button')) active.blur();

      // remove the class first, then add it two frames later: that restarts the animation
      this.feedback = '';
      this.feedbackBig = false;

      state.raf = requestAnimationFrame(() => {
        state.raf = requestAnimationFrame(() => {
          this.feedback = isCorrect ? 'ok' : 'bad';
          this.feedbackBig = isCorrect && streak > 0 && streak % 5 === 0;
          state.timer = setTimeout(() => {
            this.feedback = '';
            this.feedbackBig = false;
          }, DURATION);
        });
      });

      try {
        navigator.vibrate?.(isCorrect ? 15 : [40, 30, 40]);
      } catch (e) {
        // ignore: not supported / blocked
      }
    },

    // 1-9 click the matching choice button (only when not typing in a field)
    onChoiceKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!/^[1-9]$/.test(e.key)) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
      if (document.querySelector('dialog[open]')) return;

      const button = document.querySelectorAll('.choice-grid .choice-button')[Number(e.key) - 1];
      if (button && !button.disabled) {
        e.preventDefault();
        button.click();
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onChoiceKey);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onChoiceKey);
    clearTimeout(this.feedbackInternals.timer);
    cancelAnimationFrame(this.feedbackInternals.raf);
  },
};

export default feedbackMixin;
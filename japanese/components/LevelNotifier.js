// Level-up / unlock notifier (no UI of its own). Rendered once inside MainHeader.
// recordAnswer() (data/progress.js) fires a `jp-answer` window event after every saved answer;
// here we compare the XP snapshot before and after and add level-ups and newly opened sections to the notifications (profile icon).

import { notificationStore } from 'data/notifications.js';
import { getSnapshot, diffSnapshots, unlockContext, wordStatus } from 'data/progression.js';

export default {
  data() {
    return { before: getSnapshot(), words: [], wordsBefore: 0 };
  },
  mounted() {
    window.addEventListener('jp-answer', this.onAnswer);
    // loaded on demand: the word list is only needed to announce newly unlocked words
    import('data/words.js').then(module => {
      this.words = module.default;
      this.wordsBefore = this.countOpenWords();
    });
  },
  beforeUnmount() {
    window.removeEventListener('jp-answer', this.onAnswer);
  },
  methods: {
    countOpenWords() {
      const ctx = unlockContext();
      return this.words.filter(item => !wordStatus(item, ctx).locked).length;
    },
    onAnswer() {
      const after = getSnapshot();
      const { levelUps, newlyOpen } = diffSnapshots(this.before, after);
      this.before = after;

      const openWords = this.words.length ? this.countOpenWords() : 0;
      const newWords = openWords - this.wordsBefore;
      this.wordsBefore = openWords;

      for (const u of levelUps) notificationStore.add({ icon: '⬆', text: `${u.label} reached Lv ${u.level}`, to: '/progress' });
      for (const u of newlyOpen) notificationStore.add({ icon: '🔓', text: `Unlocked: ${u.label}`, to: u.to });
      if (newWords > 0) notificationStore.addWords(newWords);
    },
  },
  render() {
    return null;
  },
};

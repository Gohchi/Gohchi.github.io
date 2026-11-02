// Level-up / unlock notifier. Rendered once inside MainHeader: adds a notification (profile icon)
// and shows a short toast in the bottom-right corner.
// recordAnswer() (data/progress.js) fires a `jp-answer` window event after every saved answer;
// here we compare the XP snapshot before and after and add level-ups and newly opened sections to the notifications (profile icon).

import { notificationStore } from 'data/notifications.js';
import { getSnapshot, diffSnapshots, unlockContext, wordStatus } from 'data/progression.js';

const SHOW_MS = 4500;

export default {
  data() {
    return { before: getSnapshot(), words: [], wordsBefore: 0, messages: [], timer: null };
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
    clearTimeout(this.timer);
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

      const messages = [
        ...levelUps.map(u => ({ id: 'lv-' + u.category + u.level, icon: '⬆', text: `${u.label} reached Lv ${u.level}`, to: '/progress' })),
        ...newlyOpen.map(u => ({ id: 'un-' + u.id, icon: '🔓', text: `Unlocked: ${u.label}`, to: u.to })),
      ];
      messages.forEach(({ icon, text, to }) => notificationStore.add({ icon, text, to }));
      if (newWords > 0) {
        notificationStore.addWords(newWords);
        messages.push({ id: 'words-' + openWords, icon: '🔓', text: `${newWords} new ${newWords === 1 ? 'word' : 'words'} unlocked` });
      }
      if (!messages.length) return;

      this.messages = messages;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { this.messages = []; }, SHOW_MS);
    },
  },
  template: /*html*/`
    <div class="level-toast" v-if="messages.length" role="status" aria-live="polite" @click="messages = []">
      <div v-for="m in messages" :key="m.id" class="level-toast-item">
        <span aria-hidden="true">{{ m.icon }}</span>
        <span>{{ m.text }}</span>
      </div>
    </div>
  `,
};

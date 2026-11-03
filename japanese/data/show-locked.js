// Settings > Display: show or hide what is still locked (kanji / words that need more kana first).
// Hidden = the Pool menu lists only open words and the "N locked" notes disappear.
// Locked words stay out of the practice either way. On by default; remembered in this browser.

import { reactive } from 'vue';

const KEY = 'show-locked';

export const showLocked = reactive({
  on: (() => {
    try {
      return localStorage.getItem(KEY) !== 'false';
    } catch {
      return true;
    }
  })(),

  set(value) {
    this.on = Boolean(value);
    try {
      localStorage.setItem(KEY, String(this.on));
    } catch {
      // ignore privacy-mode errors
    }
  },
});

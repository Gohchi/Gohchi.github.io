// "Auto" next to the Listen button (components/WordCorner.js): read words aloud automatically.
// One setting shared by every practice section, remembered in this browser.

import { reactive } from 'vue';

const KEY = 'auto-listen';

export const autoListen = reactive({
  on: (() => {
    try {
      return localStorage.getItem(KEY) === 'true';
    } catch {
      return false;
    }
  })(),

  toggle() {
    this.on = !this.on;
    try {
      localStorage.setItem(KEY, String(this.on));
    } catch {
      // ignore privacy-mode errors
    }
    return this.on;
  },
});

// Notifications shown from the profile icon in the header (level-ups, unlocked sections and words).
// Stored in localStorage (this device only) and reactive, so every header shows the same badge.
//   { id, ts, icon, text, to?, read }

import { reactive } from 'vue';

const KEY = 'jp-notifications';
const LIMIT = 50; // keep the newest ones

function load() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

export const notificationStore = reactive({
  items: load(), // newest first

  get unread() {
    return this.items.filter(item => !item.read).length;
  },

  add({ icon = '🔔', text, to = '' }) {
    this.items.unshift({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 6), ts: Date.now(), icon, text, to, read: false });
    if (this.items.length > LIMIT) this.items.length = LIMIT;
    this.save();
  },

  // "N new words unlocked" is merged into the latest one while you keep practicing (10 min window),
  // so a session does not fill the list with one line per word.
  addWords(count) {
    const latest = this.items[0];
    if (latest?.kind === 'words' && Date.now() - latest.ts < 10 * 60000) {
      latest.count += count;
      latest.text = `${latest.count} new ${latest.count === 1 ? 'word' : 'words'} unlocked`;
      latest.ts = Date.now();
      latest.read = false;
      this.save();
      return;
    }
    this.add({ icon: '🔓', text: `${count} new ${count === 1 ? 'word' : 'words'} unlocked` });
    this.items[0].kind = 'words';
    this.items[0].count = count;
    this.save();
  },

  markAllRead() {
    if (!this.unread) return;
    this.items.forEach(item => { item.read = true; });
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.items)); } catch (e) { /* ignore */ }
  },
});

// "2 min ago", "yesterday"... for the list
export function timeAgo(ts, now = Date.now()) {
  const minutes = Math.round((now - ts) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

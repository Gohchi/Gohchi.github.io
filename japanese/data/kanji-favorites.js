// Favorite kanji / words, saved from the kanji dialog (★) and listed in the profile.
//
// Stored as a plain list of written forms (['人', '二時間', '4人']), in the order they were added.
// The profile resolves the reading and meanings again with tokenize(), so nothing else is saved.
// Synced like the other lists: see `kanjiFavorites` in data/sync.js.

import { reactive } from 'vue';

import { markDirty } from 'data/sync.js';

const STORAGE_KEY = 'jp-kanji-favorites';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed.filter(word => typeof word === 'string' && word) : [];
  } catch {
    return [];
  }
}

export const kanjiFavorites = reactive({
  list: load(),

  has(word) {
    return this.list.includes(word);
  },

  // -> true when the word is now a favorite
  toggle(word) {
    const index = this.list.indexOf(word);
    if (index === -1) {
      this.list.push(word);
    } else {
      this.list.splice(index, 1);
    }
    this.save();
    return index === -1;
  },

  remove(word) {
    const index = this.list.indexOf(word);
    if (index === -1) return;
    this.list.splice(index, 1);
    this.save();
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list));
    } catch {
      // ignore quota / privacy-mode errors
    }
    markDirty('kanjiFavorites');
  },

  reload() {
    this.list = load();
  },
});

// favorites merged from the cloud after sign in
window.addEventListener('jp-sync-applied', () => kanjiFavorites.reload());

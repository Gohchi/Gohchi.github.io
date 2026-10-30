// Word list for the speech practice, built from the other data files (nothing is listed here by hand):
//   - data/words.js default export: hiragana words, katakana words and every kanji entry of data/kanji.js
//   - data/words.js `words` export: full word forms with okurigana (お母さん, 食べる, 買い物...)
//
// Each item: { word, reading, meaning, level, type }
//   type = 'hiragana' | 'katakana' | 'kanji', detected from `word`
//
// To make the recognizer accept another written form of a word (帽子 for ぼうし),
// add it to the `words` dictionary in data/words.js. The view picks up every form
// that shares a reading automatically.

import wordsData, { words as wordForms } from './words.js';

// Readings shorter than this are skipped. 1 = use everything; 2 skips one-syllable words
// (the recognizer mishears those a lot).
const MIN_READING_LENGTH = 1;

const KANJI_RE = /[\u4E00-\u9FFF々〆]/;
const KATAKANA_RE = /[\u30A0-\u30FF]/;

export const typeOf = word => (
  KANJI_RE.test(word) ? 'kanji' : KATAKANA_RE.test(word) ? 'katakana' : 'hiragana'
);

// data/words.js default export (hiragana, katakana, and the kanji dictionary)
const fromWordsList = wordsData.map(({ word, reading, meaning, level, type }) => ({
  word, reading, meaning, level, type,
}));

// data/words.js `words` export (full forms with okurigana / prefixes)
const fromWordForms = Object.entries(wordForms).map(([word, entry]) => ({
  word,
  reading: entry.furigana,
  meaning: (entry.eng || []).join(', '),
  level: entry.JLPT_level,
  type: typeOf(word),
}));

// one item per written word; the full forms win over the kanji-only dictionary
const merged = new Map();
[...fromWordsList, ...fromWordForms].forEach(item => {
  if (!item.word || !item.reading) return;
  if ([...item.reading].length < MIN_READING_LENGTH) return;
  merged.set(item.word, { ...item, type: item.type || typeOf(item.word) });
});

export const speechWords = [...merged.values()];

export default speechWords;
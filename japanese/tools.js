import {
  voiceStore
} from 'store';

// ---------------------------------------------------------------------------
// Existing helpers (unchanged)
// ---------------------------------------------------------------------------

export const extractKanji = phrase => {
  if (!phrase) return [];
  const kanjiList = [];
  let kanjiGroup = '';
  for (let i = 0; i < phrase.length; i++) {
    const unicodeCode = phrase.charCodeAt(i);
    if (unicodeCode >= 0x4E00 && unicodeCode <= 0x9FFF) {
      kanjiGroup += phrase[i];
    } else {
      if (kanjiGroup !== '') {
        kanjiList.push(kanjiGroup);
        kanjiGroup = '';
      }
    }
  }
  if (kanjiGroup !== '') {
    kanjiList.push(kanjiGroup);
  }
  return kanjiList;
};

export const splitByKanji = (sentence, kanjiList) => {
  let result = [];
  let currentIndex = 0;
  for (let i = 0; i < kanjiList.length; i++) {
    const kanji = kanjiList[i];
    const index = sentence.indexOf(kanji, currentIndex);
    if (index !== -1) {
      result.push(sentence.substring(currentIndex, index));
      result.push(kanji);
      currentIndex = index + kanji.length;
    }
  }
  result.push(sentence.substring(currentIndex));
  return result;
};

export const showRefsDialog = refs => {
  if (!refs) { // If no references are provided, do nothing
    return;
  }

  const dialog = document.getElementById('dialog-refs');
  if (dialog) {
    const content = dialog.querySelector('.content');
    content.innerHTML = ''; // Clear previous content
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      const p = document.createElement('p');
      p.textContent = `${'*'.repeat(i + 1)} ${ref}`;
      content.appendChild(p); // Add each reference as a paragraph
    }

    dialog.showModal();
  }
};

export const showDialog = id => {
  const dialog = document.getElementById(id);
  if (dialog) {
    dialog.showModal();
  }
};

export const closeDialog = id => {
  const dialog = document.getElementById(id);
  if (dialog) {
    dialog.close();
  }
};

export const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.voice = voiceStore.selectedVoice;
  window.speechSynthesis.speak(utterance);
}

export const getVoices = async () => {
  // Wait for voices to be loaded if not available yet
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    await new Promise(resolve => {
      const handler = () => {
        speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve();
      };
      speechSynthesis.addEventListener('voiceschanged', handler);
      // In case voices are already loaded
      if (speechSynthesis.getVoices().length) {
        speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve();
      }
    });
  }
  // Filter voices by ja-JP language
  return window.speechSynthesis.getVoices().filter(({ lang }) => ['ja-JP', 'ja_JP'].includes(lang));
}

// ---------------------------------------------------------------------------
// Context-aware furigana
// ---------------------------------------------------------------------------

const KANJI_RUN = /[\u4E00-\u9FFF々〆]+|[^\u4E00-\u9FFF々〆]+/g;
const isKanji = char => /[\u4E00-\u9FFF々〆]/.test(char);
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Shared helpers for the hiragana/katakana/kanji practice views.

export function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Vowel (a/i/u/e/o) that each hiragana ends with, used to expand the long
// vowel mark: こーひー -> こおひい (the same thing an IME types for "koohii").
const VOWEL_ROWS = {
  'あ': 'ぁあかがさざただなはばぱまゃやらゎわ',
  'い': 'ぃいきぎしじちぢにひびぴみり',
  'う': 'ぅうくぐすずつづぬふぶぷむゅゆる',
  'え': 'ぇえけげせぜてでねへべぺめれ',
  'お': 'ぉおこごそぞとどのほぼぽもょよろを',
};
const VOWEL_OF = {};
for (const [vowel, chars] of Object.entries(VOWEL_ROWS)) {
  for (const char of chars) VOWEL_OF[char] = vowel;
}

// katakana -> hiragana, 1:1 per character so string lengths are preserved
export const toHiragana = str => str.replace(
  /[\u30A1-\u30F6]/g,
  char => String.fromCharCode(char.charCodeAt(0) - 0x60)
);

export const expandLongVowels = text => {
  let result = '';
  for (const char of text) {
    result += char === 'ー' ? (VOWEL_OF[result.slice(-1)] || char) : char;
  }
  return result;
};

// Katakana typed by mistake counts as hiragana, and both "ー" and the plain
// vowel are accepted for long sounds, on either side of the comparison.
export const normalizeReading = text => expandLongVowels(toHiragana(text.replace(/\s+/g, '')));

/**
 * Splits a word into parts and puts the reading only over the kanji.
 *
 *   alignFurigana('お父さん', 'おとうさん')
 *   -> [{ text: 'お' }, { text: '父', rt: 'とう' }, { text: 'さん' }]
 *
 * The kana of the surface (prefixes / okurigana / suffixes) act as anchors
 * inside the reading; whatever is left between them belongs to the kanji.
 * If the anchors can't be found (typo in the data, irregular word) it falls
 * back to one ruby over the whole word, which makes the problem visible.
 * `parts` ([[text, rt?], ...]) is an optional manual override.
 */
export const alignFurigana = (surface, reading, parts) => {
  if (parts?.length) {
    return parts.map(([text, rt]) => (rt ? { text, rt } : { text }));
  }

  const whole = [{ text: surface, rt: reading }];
  const runs = surface.match(KANJI_RUN) || [];

  // All kanji (e.g. 先生): nothing to align.
  if (runs.length === 1 && isKanji(runs[0][0])) return whole;

  const pattern = runs
    .map(run => (isKanji(run[0]) ? '(.+?)' : escapeRegExp(toHiragana(run))))
    .join('');
  const match = toHiragana(reading).match(new RegExp(`^${pattern}$`));
  if (!match) return whole;

  let group = 1;
  let position = 0;
  return runs.map(run => {
    if (isKanji(run[0])) {
      const length = match[group++].length;
      const rt = reading.slice(position, position + length);
      position += length;
      return { text: run, rt };
    }
    position += run.length;
    return { text: run };
  });
};

// Longest surface length in a dictionary, cached per dictionary object.
const maxLengthCache = new WeakMap();
const getMaxLength = dictionary => {
  if (!maxLengthCache.has(dictionary)) {
    const lengths = Object.keys(dictionary).map(key => key.length);
    maxLengthCache.set(dictionary, lengths.length ? Math.max(...lengths) : 0);
  }
  return maxLengthCache.get(dictionary);
};

/**
 * Tokenizes a phrase into [{ surface, entry? }].
 * `entry` is present when the token has furigana ({ furigana, JLPT_level, eng, parts? }).
 *
 * At each position:
 *  1. Longest match in `words` (full surface, okurigana included): お父さん beats 父.
 *  2. Legacy lookup of the whole kanji run in `ruby` (e.g. 一日間), as before.
 *  The longer candidate wins; on a tie `words` wins because it is context-aware.
 *  Otherwise the character is emitted as plain text and merged with its neighbours.
 */
export const tokenize = (text, { ruby = {}, words = {} } = {}) => {
  if (!text) return [];

  const maxLength = getMaxLength(words);
  const tokens = [];

  const pushPlain = surface => {
    const last = tokens[tokens.length - 1];
    if (last && !last.entry) {
      last.surface += surface;
    } else {
      tokens.push({ surface });
    }
  };

  let index = 0;
  while (index < text.length) {
    let match = null;

    for (let length = Math.min(maxLength, text.length - index); length > 0; length--) {
      const surface = text.slice(index, index + length);
      if (Object.hasOwn(words, surface)) {
        match = { surface, entry: words[surface] };
        break;
      }
    }

    if (isKanji(text[index])) {
      let end = index;
      while (end < text.length && isKanji(text[end])) end++;
      const run = text.slice(index, end);

      if (Object.hasOwn(ruby, run) && (!match || run.length > match.surface.length)) {
        match = { surface: run, entry: ruby[run] };
      }
    }

    if (match) {
      tokens.push(match);
      index += match.surface.length;
    } else {
      pushPlain(text[index]);
      index += 1;
    }
  }

  return tokens;
};
// Settings > Typing: let a plain QWERTY keyboard write kana. "sa" becomes さ (or サ in the katakana sections).
// romajiToKana() always answers in hiragana; the practices already compare katakana through hiragana.
// Remembered in this browser, off by default (phone keyboards and IMEs already type kana).

import { reactive } from 'vue';

const KEY = 'romaji-input';

export const romajiInput = reactive({
  on: (() => {
    try {
      return localStorage.getItem(KEY) === 'true';
    } catch {
      return false;
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

const ROMAJI = {};
const add = (romaji, kana) => { ROMAJI[romaji] = kana; };

// plain syllables: consonant + a i u e o
const rows = {
  '': 'あいうえお', k: 'かきくけこ', s: 'さしすせそ', t: 'たちつてと', n: 'なにぬねの', h: 'はひふへほ',
  m: 'まみむめも', r: 'らりるれろ', g: 'がぎぐげご', z: 'ざじずぜぞ', d: 'だぢづでど', b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ',
};
for (const [consonant, kana] of Object.entries(rows)) {
  [...'aiueo'].forEach((vowel, i) => add(consonant + vowel, kana[i]));
}
add('ya', 'や'); add('yu', 'ゆ'); add('yo', 'よ');
add('wa', 'わ'); add('wo', 'を'); add('nn', 'ん'); add("n'", 'ん');
add('vu', 'ゔ');

// spelling variants of the same syllables
Object.entries({
  shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ', ji: 'じ', si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ', di: 'ぢ', du: 'づ',
}).forEach(([romaji, kana]) => add(romaji, kana));

// combos (kya, sha, cha, ja ...) and their alternative spellings
const combos = {
  ky: 'き', sh: 'し', ch: 'ち', ny: 'に', hy: 'ひ', my: 'み', ry: 'り', gy: 'ぎ', j: 'じ', by: 'び', py: 'ぴ',
  sy: 'し', ty: 'ち', cy: 'ち', dy: 'ぢ', zy: 'じ', jy: 'じ',
};
const small = { a: 'ゃ', u: 'ゅ', o: 'ょ' };
for (const [prefix, kana] of Object.entries(combos)) {
  for (const [vowel, smallKana] of Object.entries(small)) add(prefix + vowel, kana + smallKana);
}
// sh / ch / j followed by e: しぇ ちぇ じぇ
add('she', 'しぇ'); add('che', 'ちぇ'); add('je', 'じぇ');

// small kana and sokuon typed by hand
add('xtu', 'っ'); add('ltu', 'っ'); add('xtsu', 'っ'); add('ltsu', 'っ');
add('xya', 'ゃ'); add('xyu', 'ゅ'); add('xyo', 'ょ'); add('lya', 'ゃ'); add('lyu', 'ゅ'); add('lyo', 'ょ');
add('-', 'ー');

const KEYS = Object.keys(ROMAJI);
const MAX_LENGTH = Math.max(...KEYS.map(key => key.length));
const isPrefix = text => KEYS.some(key => key.startsWith(text));
const VOWELS = 'aiueo';

// "kyou" -> "きょう". What cannot be a kana yet stays as letters at the end ("ka" + "s" -> "かs").
// final: the person is done typing, so a lone n at the end is ん.
export function romajiToKana(text, { final = false } = {}) {
  const input = text.toLowerCase();
  let out = '';
  let i = 0;

  while (i < input.length) {
    const rest = input.slice(i);

    // longest syllable first
    let matched = false;
    for (let length = Math.min(MAX_LENGTH, rest.length); length >= 1; length--) {
      const kana = ROMAJI[rest.slice(0, length)];
      if (kana) {
        out += kana;
        i += length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const ch = rest[0];
    const next = rest[1];

    // n before a consonant is ん (kanto -> かんと); before a vowel / y it is the start of na, nya ...
    if (ch === 'n' && next && !VOWELS.includes(next) && next !== 'y' && next !== "'" && next !== 'n') {
      out += 'ん';
      i += 1;
      continue;
    }
    // doubled consonant (kka, ssa, tchi) -> small tsu
    if (next && ch === next && /[bcdfghjklmpqrstvwxyz]/.test(ch)) {
      out += 'っ';
      i += 1;
      continue;
    }
    if (ch === 't' && rest.startsWith('tch')) {
      out += 'っ';
      i += 1;
      continue;
    }
    // still on its way to a kana (s, sh, ky ...): keep the letters
    if (/^[a-z']$/.test(ch) && isPrefix(rest)) {
      if (final && rest === 'n') out += 'ん';
      else out += rest;
      break;
    }
    if (final && rest === 'n') {
      out += 'ん';
      break;
    }
    // anything else is not romaji: leave it
    out += ch;
    i += 1;
  }
  return out;
}

// the letters waiting at the end of the text ("かs" -> "s")
export const romajiTail = text => (text.match(/[a-z']+$/i) || [''])[0];

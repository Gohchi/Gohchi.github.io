// Number + counter furigana: 4人 -> よにん, 3本 -> さんぼん, 20日 -> はつか, 二十分 -> にじゅっぷん ...
//
// Used by tokenize() in tools.js. To support another counter add it to COUNTERS:
//   gloss   English noun for the dialog ("4 people")
//   shi     4 is read し (only 4月):         しがつ
//   yo      4 is read よ (not よん):        よにん, よじ, よねん, よえん
//   shichi  7 is read しち (not なな):      しちじ, しちがつ
//   ku      9 is read く (not きゅう):      くじ, くがつ
//   sokuon  [plain, after-sokuon, after-3]  rendaku/sokuon forms:  ほん / ぽん / ぼん
//   hatsu   the "sokuon" numbers (1, 6, 8, 10) get a small っ but keep the plain form: いっかい, ろっこ
//   fn      fully custom reading: (n) => hiragana string (or null to fall back to the default rules)

const DIGITS = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const KANJI_DIGITS = { '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };

// "12" / "１２" / "十二" -> 12 (null when it is not a number we can read)
export const parseNumber = text => {
  if (/^[0-9０-９]+$/.test(text)) {
    const n = Number(text.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)));
    return n >= 1 && n < 10000 && !/^0/.test(text) ? n : null;
  }
  if (!/^[〇一二三四五六七八九十百千]+$/.test(text)) return null;
  let total = 0;
  let current = 0;
  const units = { '十': 10, '百': 100, '千': 1000 };
  for (const ch of text) {
    if (ch in units) {
      total += (current || 1) * units[ch];
      current = 0;
    } else if (ch in KANJI_DIGITS) {
      current = current * 10 + KANJI_DIGITS[ch];
    }
  }
  const n = total + current;
  return n >= 1 && n < 10000 ? n : null;
};

// Reading of a plain number, with optional overrides for 4, 7 and 9 on the LAST digit only.
const numberReading = (n, { yo, shi, shichi, ku } = {}) => {
  const lastDigit = n % 10;
  const thousands = Math.floor(n / 1000);
  const hundreds = Math.floor(n / 100) % 10;
  const tens = Math.floor(n / 10) % 10;
  let out = '';

  if (thousands) {
    out += thousands === 1 ? 'せん'
      : thousands === 3 ? 'さんぜん'
      : thousands === 8 ? 'はっせん'
      : DIGITS[thousands] + 'せん';
  }
  if (hundreds) {
    out += hundreds === 1 ? 'ひゃく'
      : hundreds === 3 ? 'さんびゃく'
      : hundreds === 6 ? 'ろっぴゃく'
      : hundreds === 8 ? 'はっぴゃく'
      : DIGITS[hundreds] + 'ひゃく';
  }
  if (tens) out += (tens === 1 ? '' : DIGITS[tens]) + 'じゅう';
  if (lastDigit) {
    out += lastDigit === 4 && shi ? 'し'
      : lastDigit === 4 && yo ? 'よ'
      : lastDigit === 7 && shichi ? 'しち'
      : lastDigit === 9 && ku ? 'く'
      : DIGITS[lastDigit];
  }
  return out;
};

// Small っ before k/s/t/h/p counters: いち -> いっ, ろく -> ろっ, はち -> はっ, じゅう -> じゅっ
const geminate = text => text
  .replace(/いち$/, 'いっ')
  .replace(/ろく$/, 'ろっ')
  .replace(/はち$/, 'はっ')
  .replace(/じゅう$/, 'じゅっ')
  .replace(/([ひびぴ])ゃく$/, '$1ゃっ');

// the last digit decides the sound change (1, 6, 8 and round tens/hundreds are "sokuon" numbers)
const lastSound = n => {
  if (n % 100 === 0 && n % 1000 !== 0) return 0;
  if (n % 10 === 0 && n % 100 !== 0) return 0;
  return n % 10;
};

const SOKUON_DIGITS = [0, 1, 6, 8];

const pbCounter = (plain, p, b) => ({
  sokuon: [plain, p, b],
  fn(n) {
    const sound = lastSound(n);
    const base = numberReading(n);
    if (SOKUON_DIGITS.includes(sound) && n < 1000) return geminate(base) + p;
    if (sound === 3) return base + b;
    return base + plain;
  },
});

const hatsuCounter = (kana, voiced) => ({
  hatsu: true,
  fn(n) {
    const sound = lastSound(n);
    const base = numberReading(n);
    if (SOKUON_DIGITS.includes(sound) && n < 1000) return geminate(base) + kana;
    if (voiced && sound === 3) return base + voiced;
    return base + kana;
  },
});

const plainCounter = (kana, opts = {}) => ({ fn: n => numberReading(n, opts) + kana, ...opts });

// day of the month / number of days: ついたち ふつか みっか よっか ... はつか ... にち
const DAYS = { 1: 'ついたち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', 14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか' };
const dayReading = n => DAYS[n] ?? numberReading(n, { shichi: true, ku: true }) + 'にち';

export const COUNTERS = {
  '人': { gloss: 'people', fn: n => (n === 1 ? 'ひとり' : n === 2 ? 'ふたり' : numberReading(n, { yo: true }) + 'にん') },
  '日': { gloss: 'days', fn: dayReading },
  '日間': { gloss: 'days', fn: n => (n === 1 ? 'いちにちかん' : dayReading(n) + 'かん') },
  '週間': { gloss: 'weeks', ...hatsuCounter('しゅうかん') },
  '時間': { gloss: 'hours', fn: n => numberReading(n, { yo: true, shichi: true, ku: true }) + 'じかん' },
  '年': { gloss: 'years', fn: n => numberReading(n, { yo: true, shichi: true, ku: true }) + 'ねん' },
  '月': { gloss: 'months', fn: n => numberReading(n, { shi: true, shichi: true, ku: true }) + 'がつ' },
  '時': { gloss: "o'clock", fn: n => numberReading(n, { yo: true, shichi: true, ku: true }) + 'じ' },
  '分': { gloss: 'minutes', ...pbCounter('ふん', 'ぷん', 'ぷん') },
  '歳': { gloss: 'years old', fn: n => (n === 20 ? 'はたち' : hatsuCounter('さい').fn(n)) },
  '円': plainCounter('えん', { gloss: 'yen', yo: true }),
  '本': { gloss: 'long things', ...pbCounter('ほん', 'ぽん', 'ぼん') },
  '匹': { gloss: 'small animals', ...pbCounter('ひき', 'ぴき', 'びき') },
  '杯': { gloss: 'cups', ...pbCounter('はい', 'ぱい', 'ばい') },
  '回': { gloss: 'times', ...hatsuCounter('かい') },
  '階': { gloss: 'floors', ...hatsuCounter('かい', 'がい') },
  '個': { gloss: 'pieces', ...hatsuCounter('こ') },
  '冊': { gloss: 'books', ...hatsuCounter('さつ') },
  '枚': { gloss: 'flat things', ...plainCounter('まい') },
  '台': { gloss: 'machines', ...plainCounter('だい') },
};

// longest counters first so 時間 wins over 時
export const COUNTER_KEYS = Object.keys(COUNTERS).sort((a, b) => b.length - a.length);

// -> { surface, entry } or null. `text` starts with the number.
export const matchCounter = (text, index) => {
  const numberMatch = text.slice(index).match(/^(?:[0-9０-９]+|[〇一二三四五六七八九十百千]+)/);
  if (!numberMatch) return null;

  const numberText = numberMatch[0];
  const counterKey = COUNTER_KEYS.find(key => text.startsWith(key, index + numberText.length));
  if (!counterKey) return null;

  const value = parseNumber(numberText);
  if (value === null) return null;

  const reading = COUNTERS[counterKey].fn(value);
  if (!reading) return null;

  return {
    surface: numberText + counterKey,
    entry: {
      reading,
      JLPT_level: 'N5',
      eng: [`${value} ${COUNTERS[counterKey].gloss}`],
    },
  };
};

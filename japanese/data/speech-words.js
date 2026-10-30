// Word list for the speech practice.
//   word    = what is shown on the card
//   reading = hiragana reading (also accepted as an answer; kanji forms with the
//             same reading are accepted automatically, see acceptedForms in the view)
//   type    = 'hiragana' | 'katakana' | 'kanji'   (detected from `word` when missing)
//   accept  = optional extra written forms that count as correct
//
// To add words, append to `curated`. Hiragana / katakana words from data/words.js are
// added automatically; set INCLUDE_WORDS_JS to false to use only the curated list.

import wordsData from './words.js';

const INCLUDE_WORDS_JS = true;
const MIN_READING_LENGTH = 2; // one-syllable words are too easy to mishear

const KANJI_RE = /[\u4E00-\u9FFF々〆]/;
const KATAKANA_RE = /[\u30A0-\u30FF]/;

export const typeOf = word => (
  KANJI_RE.test(word) ? 'kanji' : KATAKANA_RE.test(word) ? 'katakana' : 'hiragana'
);

const curated = [
  // --- original test words ---
  { word: 'ありがとう', reading: 'ありがとう', meaning: 'thank you', level: 'N5' },
  { word: 'こんにちは', reading: 'こんにちは', meaning: 'hello', level: 'N5' },
  { word: 'おはよう', reading: 'おはよう', meaning: 'good morning', level: 'N5' },
  { word: 'さようなら', reading: 'さようなら', meaning: 'goodbye', level: 'N5' },
  { word: 'ねこ', reading: 'ねこ', meaning: 'cat', level: 'N5' },
  { word: 'さかな', reading: 'さかな', meaning: 'fish', level: 'N5' },
  { word: 'コーヒー', reading: 'こーひー', meaning: 'coffee', level: 'N5' },
  { word: 'ラーメン', reading: 'らーめん', meaning: 'ramen', level: 'N5' },
  { word: 'ホテル', reading: 'ほてる', meaning: 'hotel', level: 'N5' },

  // --- kanji words ---
  // N5
  { word: '学校', reading: 'がっこう', meaning: 'school', level: 'N5' },
  { word: '先生', reading: 'せんせい', meaning: 'teacher', level: 'N5' },
  { word: '電車', reading: 'でんしゃ', meaning: 'train', level: 'N5' },
  { word: '日本語', reading: 'にほんご', meaning: 'Japanese language', level: 'N5' },
  { word: '友達', reading: 'ともだち', meaning: 'friend', level: 'N5' },
  { word: '家族', reading: 'かぞく', meaning: 'family', level: 'N5' },
  { word: '今日', reading: 'きょう', meaning: 'today', level: 'N5' },
  { word: '明日', reading: 'あした', meaning: 'tomorrow', level: 'N5' },
  { word: '昨日', reading: 'きのう', meaning: 'yesterday', level: 'N5' },
  { word: '毎日', reading: 'まいにち', meaning: 'every day', level: 'N5' },
  { word: '時間', reading: 'じかん', meaning: 'time', level: 'N5' },
  { word: '天気', reading: 'てんき', meaning: 'weather', level: 'N5' },
  { word: '映画', reading: 'えいが', meaning: 'movie', level: 'N5' },
  { word: '音楽', reading: 'おんがく', meaning: 'music', level: 'N5' },
  { word: '電話', reading: 'でんわ', meaning: 'telephone', level: 'N5' },
  { word: '図書館', reading: 'としょかん', meaning: 'library', level: 'N5' },
  { word: '病院', reading: 'びょういん', meaning: 'hospital', level: 'N5' },
  { word: '会社', reading: 'かいしゃ', meaning: 'company', level: 'N5' },
  { word: '勉強', reading: 'べんきょう', meaning: 'study', level: 'N5' },
  { word: '旅行', reading: 'りょこう', meaning: 'travel', level: 'N5' },
  // N4
  { word: '空港', reading: 'くうこう', meaning: 'airport', level: 'N4' },
  { word: '趣味', reading: 'しゅみ', meaning: 'hobby', level: 'N4' },
  { word: '授業', reading: 'じゅぎょう', meaning: 'class, lesson', level: 'N4' },
  { word: '全然', reading: 'ぜんぜん', meaning: 'not at all', level: 'N4' },
  { word: '簡単', reading: 'かんたん', meaning: 'easy, simple', level: 'N4' },
  { word: '時代', reading: 'じだい', meaning: 'era, period', level: 'N4' },
  // N3
  { word: '予報', reading: 'よほう', meaning: 'forecast', level: 'N3' },
  { word: '真実', reading: 'しんじつ', meaning: 'truth', level: 'N3' },
  { word: '小説', reading: 'しょうせつ', meaning: 'novel', level: 'N3' },
  { word: '伝説', reading: 'でんせつ', meaning: 'legend', level: 'N3' },
  { word: '記録', reading: 'きろく', meaning: 'record', level: 'N3' },
  { word: '暴力', reading: 'ぼうりょく', meaning: 'violence', level: 'N3' },
  // N2
  { word: '翻訳', reading: 'ほんやく', meaning: 'translation', level: 'N2' },
  { word: '独学', reading: 'どくがく', meaning: 'self-study', level: 'N2' },
  { word: '原作', reading: 'げんさく', meaning: 'original work', level: 'N2' },
  { word: '治安', reading: 'ちあん', meaning: 'public order', level: 'N2' },
  { word: '自尊心', reading: 'じそんしん', meaning: 'self-respect', level: 'N2' },
  // N1
  { word: '熟練', reading: 'じゅくれん', meaning: 'skill, expertise', level: 'N1' },
  { word: '信仰', reading: 'しんこう', meaning: 'faith, belief', level: 'N1' },
  { word: '戦乱', reading: 'せんらん', meaning: 'war, turmoil', level: 'N1' },
];

// Hiragana / katakana words already in data/words.js (clean readings, with JLPT level)
const fromWordsJs = INCLUDE_WORDS_JS
  ? wordsData
    .filter(({ type, reading }) => (type === 'hiragana' || type === 'katakana')
      && [...reading].length >= MIN_READING_LENGTH)
    .map(({ word, reading, meaning, level, type }) => ({ word, reading, meaning, level, type }))
  : [];

// curated first, so its entries (and any `accept`) win over duplicates
const merged = new Map();
[...curated, ...fromWordsJs].forEach(item => {
  if (!merged.has(item.word)) merged.set(item.word, { ...item, type: item.type || typeOf(item.word) });
});

export const speechWords = [...merged.values()];

export default speechWords;
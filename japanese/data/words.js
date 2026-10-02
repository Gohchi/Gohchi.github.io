// Words for the "words" mode in the kana keyboard.
// The answer is ALWAYS the reading written in hiragana (`reading`).
//   - hiragana words: the word is shown in hiragana, the user writes it down (reading === word)
//   - katakana words: the word is shown in katakana, the user writes it in hiragana
//   - kanji words:    the word is shown with kanji, the user writes its reading in hiragana
// A long vowel mark (ー) in a reading is also matched by the vowel it stands for
// (こーひー = こおひい), see normalizeReading() in views/KanaKeyboard.js.

// JLPT level for hiragana / katakana words (approximate, JLPT has no official vocabulary lists)
const KANA_WORD_LEVELS = {
  'ありがとう': 'N5', 'おはよう': 'N5', 'こんにちは': 'N5', 'さようなら': 'N5',
  'さくら': 'N4', 'はな': 'N5', 'ほし': 'N4', 'ねこ': 'N5', 'いぬ': 'N5', 'さかな': 'N5',
  'みず': 'N5', 'やま': 'N5', 'うみ': 'N5', 'そら': 'N4', 'ゆき': 'N4', 'あめ': 'N5',
  'くるま': 'N5', 'いす': 'N5', 'つくえ': 'N5', 'かばん': 'N5', 'ぼうし': 'N5', 'たまご': 'N5',
  'とけい': 'N4', 'ひこうき': 'N4', 'おかね': 'N5', 'おにぎり': 'N4',
  'おかあさん': 'N5', 'おとうさん': 'N5',

  'コーヒー': 'N5', 'ビール': 'N5', 'ジュース': 'N5', 'ミルク': 'N4', 'ケーキ': 'N5',
  'チョコレート': 'N5', 'アイスクリーム': 'N5', 'ハンバーガー': 'N5', 'ラーメン': 'N5',
  'テレビ': 'N5', 'パソコン': 'N4', 'スマホ': 'N4', 'カメラ': 'N5', 'ゲーム': 'N4',
  'アニメ': 'N4', 'ピアノ': 'N4', 'サッカー': 'N4', 'テニス': 'N5', 'ホテル': 'N5',
  'レストラン': 'N5', 'バス': 'N5', 'タクシー': 'N5', 'ドア': 'N5', 'ノート': 'N5',
  'ペン': 'N5', 'テスト': 'N5', 'シャワー': 'N5', 'トイレ': 'N5',
};

const hiraganaWords = [
  ['ありがとう', 'thank you'],
  ['おはよう', 'good morning'],
  ['こんにちは', 'hello'],
  ['さようなら', 'goodbye'],
  ['さくら', 'cherry blossom'],
  ['はな', 'flower'],
  ['ほし', 'star'],
  ['ねこ', 'cat'],
  ['いぬ', 'dog'],
  ['さかな', 'fish'],
  ['みず', 'water'],
  ['やま', 'mountain'],
  ['うみ', 'sea'],
  ['そら', 'sky'],
  ['ゆき', 'snow'],
  ['あめ', 'rain'],
  ['くるま', 'car'],
  ['いす', 'chair'],
  ['つくえ', 'desk'],
  ['かばん', 'bag'],
  ['ぼうし', 'hat'],
  ['たまご', 'egg'],
  ['とけい', 'clock, watch'],
  ['ひこうき', 'airplane'],
  ['おかね', 'money'],
  ['おにぎり', 'rice ball'],
  ['おかあさん', 'mother'],
  ['おとうさん', 'father'],
].map(([word, meaning]) => ({ word, reading: word, meaning, level: KANA_WORD_LEVELS[word], type: 'hiragana' }));

const katakanaWords = [
  ['コーヒー', 'こーひー', 'coffee'],
  ['ビール', 'びーる', 'beer'],
  ['ジュース', 'じゅーす', 'juice'],
  ['ミルク', 'みるく', 'milk'],
  ['ケーキ', 'けーき', 'cake'],
  ['チョコレート', 'ちょこれーと', 'chocolate'],
  ['アイスクリーム', 'あいすくりーむ', 'ice cream'],
  ['ハンバーガー', 'はんばーがー', 'hamburger'],
  ['ラーメン', 'らーめん', 'ramen'],
  ['テレビ', 'てれび', 'television'],
  ['パソコン', 'ぱそこん', 'personal computer'],
  ['スマホ', 'すまほ', 'smartphone'],
  ['カメラ', 'かめら', 'camera'],
  ['ゲーム', 'げーむ', 'game'],
  ['アニメ', 'あにめ', 'anime'],
  ['ピアノ', 'ぴあの', 'piano'],
  ['サッカー', 'さっかー', 'soccer'],
  ['テニス', 'てにす', 'tennis'],
  ['ホテル', 'ほてる', 'hotel'],
  ['レストラン', 'れすとらん', 'restaurant'],
  ['バス', 'ばす', 'bus'],
  ['タクシー', 'たくしー', 'taxi'],
  ['ドア', 'どあ', 'door'],
  ['ノート', 'のーと', 'notebook'],
  ['ペン', 'ぺん', 'pen'],
  ['テスト', 'てすと', 'test'],
  ['シャワー', 'しゃわー', 'shower'],
  ['トイレ', 'といれ', 'toilet'],
].map(([word, reading, meaning]) => ({ word, reading, meaning, level: KANA_WORD_LEVELS[word], type: 'katakana' }));

const KANJI_LEVELS = {
  '学校': 'N5', '先生': 'N5', '学生': 'N5', '日本語': 'N5', '教室': 'N4',
  '友達': 'N5', '家族': 'N5', '大人': 'N4', '一人': 'N5',
  '今日': 'N5', '明日': 'N5', '昨日': 'N5', '毎日': 'N5', '誕生日': 'N5', '水曜日': 'N5',
  '時間': 'N5', '午後': 'N5', '天気': 'N5', '元気': 'N5',
  '食べ物': 'N5', '飲み物': 'N5', '果物': 'N4', '料理': 'N5', '買い物': 'N5',
  '電車': 'N5', '駅': 'N5', '空港': 'N4', '旅行': 'N5',
  '図書館': 'N5', '病院': 'N5', '会社': 'N5',
  '電話': 'N5', '映画': 'N5', '音楽': 'N5', '写真': 'N5', '新聞': 'N5',
};

const kanjiWords = [
  ['学校', 'がっこう', 'school'],
  ['先生', 'せんせい', 'teacher'],
  ['学生', 'がくせい', 'student'],
  ['日本語', 'にほんご', 'Japanese language'],
  ['教室', 'きょうしつ', 'classroom'],
  ['友達', 'ともだち', 'friend'],
  ['家族', 'かぞく', 'family'],
  ['大人', 'おとな', 'adult'],
  ['一人', 'ひとり', 'one person'],
  ['今日', 'きょう', 'today'],
  ['明日', 'あした', 'tomorrow'],
  ['昨日', 'きのう', 'yesterday'],
  ['毎日', 'まいにち', 'every day'],
  ['誕生日', 'たんじょうび', 'birthday'],
  ['月曜日', 'げつようび', 'Monday'],
  ['火曜日', 'かようび', 'Tuesday'],
  ['水曜日', 'すいようび', 'Wednesday'],
  ['木曜日', 'もくようび', 'Thursday'],
  ['金曜日', 'きんようび', 'Friday'],
  ['土曜日', 'どようび', 'Saturday'],
  ['日曜日', 'にちようび', 'Sunday'],
  ['時間', 'じかん', 'time'],
  ['午後', 'ごご', 'afternoon, PM'],
  ['天気', 'てんき', 'weather'],
  ['元気', 'げんき', 'healthy, well'],
  ['食べ物', 'たべもの', 'food'],
  ['飲み物', 'のみもの', 'drink'],
  ['果物', 'くだもの', 'fruit'],
  ['料理', 'りょうり', 'cooking, dish'],
  ['買い物', 'かいもの', 'shopping'],
  ['電車', 'でんしゃ', 'train'],
  ['駅', 'えき', 'station'],
  ['空港', 'くうこう', 'airport'],
  ['旅行', 'りょこう', 'trip, travel'],
  ['図書館', 'としょかん', 'library'],
  ['病院', 'びょういん', 'hospital'],
  ['会社', 'かいしゃ', 'company'],
  ['電話', 'でんわ', 'telephone'],
  ['映画', 'えいが', 'movie'],
  ['音楽', 'おんがく', 'music'],
  ['写真', 'しゃしん', 'photograph'],
  ['新聞', 'しんぶん', 'newspaper'],
].map(([word, reading, meaning]) => ({ word, reading, meaning, level: KANJI_LEVELS[word], type: 'kanji' }));

export default [
  ...hiraganaWords,
  ...katakanaWords,
  ...kanjiWords,
];

// Word-level furigana dictionary.
//
// Unlike `ruby` in kanji.js (keyed by a run of kanji only), keys here are the
// FULL surface form as written in text, okurigana / prefixes / suffixes included.
// `furigana` is the reading of the WHOLE word. The kanji-only part (e.g. 父 = とう
// inside お父さん) is computed automatically by alignFurigana() in tools.js.
//
// Longest match wins, so お父さん is picked before 父 when both could apply.
//
// Optional `parts` overrides the automatic alignment for irregular words:
//   parts: [['一', 'いっ'], ['日', 'ぴ']]   // [text, rt?]
export const words = {
  // family
  '父': { furigana: 'ちち', JLPT_level: 'N5', eng: ['(my) father'] },
  'お父さん': { furigana: 'おとうさん', JLPT_level: 'N5', eng: ['father', 'dad'] },
  '母': { furigana: 'はは', JLPT_level: 'N5', eng: ['(my) mother'] },
  'お母さん': { furigana: 'おかあさん', JLPT_level: 'N5', eng: ['mother', 'mom'] },
  '兄': { furigana: 'あに', JLPT_level: 'N5', eng: ['(my) older brother'] },
  'お兄さん': { furigana: 'おにいさん', JLPT_level: 'N5', eng: ['older brother'] },
  '姉': { furigana: 'あね', JLPT_level: 'N5', eng: ['(my) older sister'] },
  'お姉さん': { furigana: 'おねえさん', JLPT_level: 'N5', eng: ['older sister'] },

  // okurigana examples: the reading of 食 here is た (not the whole たべる)
  '食べる': { furigana: 'たべる', JLPT_level: 'N5', eng: ['to eat'] },
  '飲む': { furigana: 'のむ', JLPT_level: 'N5', eng: ['to drink'] },
  '食べ物': { furigana: 'たべもの', JLPT_level: 'N5', eng: ['food'] },
  '買い物': { furigana: 'かいもの', JLPT_level: 'N5', eng: ['shopping'] },
  '飲み物': { furigana: 'のみもの', JLPT_level: 'N5', eng: ['drink', 'beverage'] },
  '水曜日': { furigana: 'すいようび', JLPT_level: 'N5', eng: ['Wednesday'] },
};
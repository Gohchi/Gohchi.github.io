// Basic romaji reading for each kana, used to build multiple-choice options
export const hiragana = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'wo','ん':'n',
};

export const katakana = {
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'wo','ン':'n',
  // 'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go',
  // 'ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
  // 'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do',
  // 'バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo',
  // 'パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po',
};

export const kanaMap = {
  'あ':'ア','い':'イ','う':'ウ','え':'エ','お':'オ',
  'か':'カ','き':'キ','く':'ク','け':'ケ','こ':'コ',
  'さ':'サ','し':'シ','す':'ス','せ':'セ','そ':'ソ',
  'た':'タ','ち':'チ','つ':'ツ','て':'テ','と':'ト',
  'な':'ナ','に':'ニ','ぬ':'ヌ','ね':'ネ','の':'ノ',
  'は':'ハ','ひ':'ヒ','ふ':'フ','へ':'ヘ','ほ':'ホ',
  'ま':'マ','み':'ミ','む':'ム','め':'メ','も':'モ',
  'や':'ヤ','ゆ':'ユ','よ':'ヨ',
  'ら':'ラ','り':'リ','る':'ル','れ':'レ','ろ':'ロ',
  'わ':'ワ','を':'ヲ','ん':'ン',

  'ア':'あ','イ':'い','ウ':'う','エ':'え','オ':'お',
  'カ':'か','キ':'き','ク':'く','ケ':'け','コ':'こ',
  'サ':'さ','シ':'し','ス':'す','セ':'せ','ソ':'そ',
  'タ':'た','チ':'ち','ツ':'つ','テ':'て','ト':'と',
  'ナ':'な','ニ':'に','ヌ':'ぬ','ネ':'ね','ノ':'の',
  'ハ':'は','ヒ':'ひ','フ':'ふ','ヘ':'へ','ホ':'ほ',
  'マ':'ま','ミ':'み','ム':'む','メ':'め','モ':'も',
  'ヤ':'や','ユ':'ゆ','ヨ':'よ',
  'ラ':'ら','リ':'り','ル':'る','レ':'れ','ロ':'ろ',
  'ワ':'わ','ヲ':'を','ン':'ん',
};

// Dakuten (゛) and handakuten (゜) pairs, hiragana + katakana combined,
// used to modify the last character typed into the word builder.
export const DAKUTEN_MAP = {
  'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
  'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
  'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
  'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ',
  'う': 'ゔ',
  'カ': 'ガ', 'キ': 'ギ', 'ク': 'グ', 'ケ': 'ゲ', 'コ': 'ゴ',
  'サ': 'ザ', 'シ': 'ジ', 'ス': 'ズ', 'セ': 'ゼ', 'ソ': 'ゾ',
  'タ': 'ダ', 'チ': 'ヂ', 'ツ': 'ヅ', 'テ': 'デ', 'ト': 'ド',
  'ハ': 'バ', 'ヒ': 'ビ', 'フ': 'ブ', 'ヘ': 'ベ', 'ホ': 'ボ',
  'ウ': 'ヴ',
};

export const HANDAKUTEN_MAP = {
  'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ',
  'ハ': 'パ', 'ヒ': 'ピ', 'フ': 'プ', 'ヘ': 'ペ', 'ホ': 'ポ',
};

// Voiced kana -> the base kana that has to be learned first (が needs か, ぱ needs は)
const BASE_KANA = {};
for (const [base, voiced] of Object.entries({ ...DAKUTEN_MAP, ...HANDAKUTEN_MAP })) BASE_KANA[voiced] = base;
for (const [base, voiced] of Object.entries(HANDAKUTEN_MAP)) BASE_KANA[voiced] = base;
export const baseKana = ch => BASE_KANA[ch] || ch;


// ---------------------------------------------------------------------------
// Extra kana: dakuten, handakuten, sokuon and combos (kana practice, keyboard and listen)
// ---------------------------------------------------------------------------

// hiragana -> katakana for any kana (が -> ガ, ゃ -> ャ, ゔ -> ヴ); everything else is left as it is
export const toKatakana = text => [...text].map(ch => {
  const code = ch.charCodeAt(0);
  return code >= 0x3041 && code <= 0x3096 ? String.fromCharCode(code + 0x60) : ch;
}).join('');

// katakana -> hiragana, 1:1 per character
export const toHiraganaText = text => [...text].map(ch => {
  const code = ch.charCodeAt(0);
  return code >= 0x30A1 && code <= 0x30F6 ? String.fromCharCode(code - 0x60) : ch;
}).join('');

const EXTRA_HIRAGANA = {
  dakuten: {
    'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
    'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
    'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
    'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  },
  handakuten: {
    'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  },
  sokuon: {
    'っ':'small tsu',
  },
  combo: {
    'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
    'しゃ':'sha','しゅ':'shu','しょ':'sho',
    'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
    'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
    'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
    'みゃ':'mya','みゅ':'myu','みょ':'myo',
    'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
    'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
    'じゃ':'ja','じゅ':'ju','じょ':'jo',
    'びゃ':'bya','びゅ':'byu','びょ':'byo',
    'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  },
};

// The groups the kana practices can mix in (Basic is what the rest of the app uses)
export const KANA_GROUPS = [
  { key: 'basic', label: 'Basic' },
  { key: 'dakuten', label: 'Dakuten ゛' },
  { key: 'handakuten', label: 'Handakuten ゜' },
  { key: 'sokuon', label: 'Sokuon っ' },
  { key: 'combo', label: 'Combos きゃ' },
];

// { kana: romaji } for the chosen groups of a script, in a stable order
export function kanaTable(script, groups = ['basic']) {
  const katakanaScript = script === 'katakana';
  const table = {};

  for (const { key } of KANA_GROUPS) {
    if (!groups.includes(key)) continue;
    const source = key === 'basic' ? (katakanaScript ? katakana : hiragana) : EXTRA_HIRAGANA[key];
    for (const [kana, romaji] of Object.entries(source)) {
      table[key !== 'basic' && katakanaScript ? toKatakana(kana) : kana] = romaji;
    }
  }
  return table;
}

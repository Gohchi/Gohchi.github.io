const defaultValues = { type: 'standard' };

export const topics = [
  {
    type: 'list',
    title: 'Counters',
    subtitle: 'A list of common counters in Japanese.',
    items: [
      { kanji: '人', kana: 'にん', meaning: 'people', notes: 'ひとり and ふたり are used for one and two people' },
      { kanji: '個', kana: 'こ', meaning: 'small, general objects' },
      { kanji: 'つ', kana: 'つ', meaning: 'general objects, especially native Japanese counting' },
      { kanji: '本', kana: 'ほん', meaning: 'long, cylindrical objects', notes: 'The pronunciation changes to ぽん or ぼん in some numbers' },
      { kanji: '枚', kana: 'まい', meaning: 'flat, thin objects' },
      { kanji: '冊', kana: 'さつ', meaning: 'bound books and magazines' },
      { kanji: '台', kana: 'だい', meaning: 'machines and vehicles' },
      { kanji: '匹', kana: 'ひき', meaning: 'small animals', notes: 'The pronunciation changes to ぴき or びき in some numbers' },
      { kanji: '頭', kana: 'とう', meaning: 'large animals' },
      { kanji: '羽', kana: 'わ', meaning: 'birds and rabbits' },
      { kanji: '杯', kana: 'はい', meaning: 'cups and glasses of liquid', notes: 'The pronunciation changes to ぱい or ばい in some numbers' },
      { kanji: '軒', kana: 'けん', meaning: 'houses and buildings' },
      { kanji: '階', kana: 'かい', meaning: 'floor or story of a building', notes: 'The pronunciation changes to がい in some numbers' },
      { kanji: '回', kana: 'かい', meaning: 'number of times' },
      { kanji: '度', kana: 'ど', meaning: 'number of times or occurrences' },
      { kanji: '歳', kana: 'さい', meaning: 'age in years', notes: '才 is also commonly used' },
      { kanji: '円', kana: 'えん', meaning: 'yen' },
      { kanji: '番', kana: 'ばん', meaning: 'number in a sequence or order', notes: '"The number one" and "The best" are 一番 (いちばん)' },
    ],
  },
  {
    type: 'list',
    title: 'Numbers',
    subtitle: 'A list of numbers in Japanese.',
    items: [
      { kanji: '一', kana: 'いち', meaning: 'one', notes: '' },
      { kanji: '二', kana: 'に', meaning: 'two' },
      { kanji: '三', kana: 'さん', meaning: 'three' },
      { kanji: '四', kana: 'よん', meaning: 'four', notes: 'し is also used' },
      { kanji: '五', kana: 'ご', meaning: 'five' },
      { kanji: '六', kana: 'ろく', meaning: 'six' },
      { kanji: '七', kana: 'なな', meaning: 'seven', notes: 'しち is also used' },
      { kanji: '八', kana: 'はち', meaning: 'eight' },
      { kanji: '九', kana: 'きゅう', meaning: 'nine', notes: 'く is also used' },
      { kanji: '十', kana: 'じゅう', meaning: 'ten' },
      { kanji: '十一', kana: 'じゅういち', meaning: 'eleven' },
      { kanji: '十二', kana: 'じゅうに', meaning: 'twelve' },
      { kanji: '十三', kana: 'じゅうさん', meaning: 'thirteen' },
      { kanji: '十四', kana: 'じゅうよん', meaning: 'fourteen' },
      { kanji: '十五', kana: 'じゅうご', meaning: 'fifteen' },
      { kanji: '十六', kana: 'じゅうろく', meaning: 'sixteen' },
      { kanji: '十七', kana: 'じゅうなな', meaning: 'seventeen' },
      { kanji: '十八', kana: 'じゅうはち', meaning: 'eighteen' },
      { kanji: '十九', kana: 'じゅうきゅう', meaning: 'nineteen' },
      { kanji: '二十', kana: 'にじゅう', meaning: 'twenty' },
      { kanji: '百', kana: 'ひゃく', meaning: 'one hundred' },
      { kanji: '千', kana: 'せん', meaning: 'one thousand' },
      { kanji: '一万', kana: 'いちまん', meaning: 'ten thousand' },
      { kanji: '十万', kana: 'じゅうまん', meaning: 'one hundred thousand' },
      { kanji: '百万', kana: 'ひゃくまん', meaning: 'one million' },
      { kanji: '千万', kana: 'せんまん', meaning: 'ten million' },
      { kanji: '一億', kana: 'いちおく', meaning: 'one hundred million' },
      { kanji: '零', kana: 'れい', meaning: 'zero', notes: 'ゼロ is also commonly used' },
      { kanji: '〇', kana: 'まる', meaning: 'zero', notes: '〇 is also used to represent zero' },
    ],
    sources: []
  },
  {
    type: 'list',
    title: 'Days of week',
    subtitle: 'A list of the days of the week.',
    items: [
      {
        kanji: '月曜日',
        kana: 'げつようび',
        meaning: 'Monday',
        notes: '月 means moon',
      },
      {
        kanji: '火曜日',
        kana: 'かようび',
        meaning: 'Tuesday',
        notes: '火 means fire',
      },
      {
        kanji: '水曜日',
        kana: 'すいようび',
        meaning: 'Wednesday',
        notes: '水 means water'
      },
      {
        kanji: '木曜日',
        kana: 'もくようび',
        meaning: 'Thursday',
        notes: '木 means tree'
      },
      {
        kanji: '金曜日',
        kana: 'きんようび',
        meaning: 'Friday',
        notes: '金 means gold'
      },
      {
        kanji: '土曜日',
        kana: 'どようび',
        meaning: 'Saturday',
        notes: '土 means soil'
      },
      {
        kanji: '日曜日',
        kana: 'にちようび',
        meaning: 'Sunday',
        notes: '日 means sun'
      },
      {
        kanji: '毎日',
        kana: 'まいにち',
        meaning: 'every day',
        notes: '毎 means every'
      },
      {
        kanji: '何曜日',
        kana: 'なにようび',
        meaning: 'what day of the week',
        notes: '何 means what'
      }
    ],
    sources: []
  },
  {
    type: 'list',
    title: 'Months of year',
    subtitle: 'A list of the months of the year.',
    items: [
      {
        kanji: '一月',
        kana: 'いちがつ',
        meaning: 'January',
        notes: '一 means one'
      },
      {
        kanji: '二月',
        kana: 'にがつ',
        meaning: 'February',
        notes: '二 means two'
      },
      {
        kanji: '三月',
        kana: 'さんがつ',
        meaning: 'March',
        notes: '三 means three'
      },
      {
        kanji: '四月',
        kana: 'しがつ',
        meaning: 'April',
        notes: '四 means four'
      },
      {
        kanji: '五月',
        kana: 'ごがつ',
        meaning: 'May',
        notes: '五 means five'
      },
      {
        kanji: '六月',
        kana: 'ろくがつ',
        meaning: 'June',
        notes: '六 means six'
      },
      {
        kanji: '七月',
        kana: 'しちがつ',
        meaning: 'July',
        notes: '七 means seven'
      },
      {
        kanji: '八月',
        kana: 'はちがつ',
        meaning: 'August',
        notes: '八 means eight'
      },
      {
        kanji: '九月',
        kana: 'きゅうがつ',
        meaning: 'September',
        notes: '九 means nine'
      },
      {
        kanji: '十月',
        kana: 'じゅうがつ',
        meaning: 'October',
        notes:'十 means ten'
      },
      {
        kanji:'十一月',
        kana:'じゅういちがつ',
        meaning:'November',
        notes:'十一 means eleven'
      },
      {
        kanji:'十二月',
        kana:'じゅうにがつ',
        meaning:'December',
        notes:'十二 means twelve'
      },
      {
        kanji:'毎月',
        kana:'まいつき',
        meaning:'every month',
        notes:'毎 means every'
      },
      {
        kanji:'何月',
        kana:'なんがつ',
        meaning:'what month',
        notes:'何 means what',
      }
    ],
  },
  {
    ...defaultValues,
    title: '回 vs 回目',
    subtitle: '回 is the total number of the turn, 回目 is the number of the turn.',
    sources: [
      { title: 'hinative', url: 'https://hinative.com/questions/19985295#featured_answer_46769428' }
    ]
  },
  {
    ...defaultValues,
    title: '等しい vs 同じ',
    subtitle: '同じ=exactly the same | 同様=about the same, similar | 等しい=equal',
    sources: [
      { title: 'hinative', url: 'https://hinative.com/questions/25933058#answer-58675440' }
    ]
  },
  {
    ...defaultValues,
    title: 'さけ vs しゃけ',
    subtitle: 'Both are 鮭, salmon.',
    content: [
      {
        heading: 'Standard vs Colloquial Reading',
        text: 'さけ is the standard reading of 鮭, while しゃけ is a more colloquial reading. Both refer to salmon, but しゃけ is often used in casual conversation or in certain dialects.'
      },
      {
        heading: 'Regional Usage',
        text: 'Maybe to avoid confusion with alcohol 酒 (さけ), しゃけ is used in some regions.'
      }
    ],
    sources: [
      { title: 'stackexchange', url: 'https://japanese.stackexchange.com/questions/1217/whats-the-difference-between-%e3%81%95%e3%81%91-sake-and-%e3%81%97%e3%82%83%e3%81%91-shake' }
    ]
  },
  {
    type: 'resource',
    title: 'Remembering the Kanji 1, 6th Edition (2200 Kanji)',
    subtitle: 'This is a deck including all 2200 kanji of the book Remembering the Kanji 1, 6th Edition, by James W. Heisig.',
    sources: [
      { title: 'ankiweb', url: 'https://ankiweb.net/shared/info/1654787298' }
    ]
  },
  {
    type: 'resource',
    title: 'Onomatopoeia',
    content: 'Onomatopoeia is a significant part of the Japanese language, used to describe sounds, actions, and states. It can be categorized into two main types: giseigo (擬声語) for sounds made by living things and giongo (擬音語) for sounds made by inanimate objects or nature. Additionally, there are gitaigo (擬態語) which describe states or conditions, and giyougo (擬容語) which describe movements or actions. These expressions are often used in everyday conversation, literature, and media to convey vivid imagery and emotions.',
    sources: [
      { site: 'Tofugu', title: 'Japanese Onomatopoeia: The Definitive Guide', url: 'https://www.tofugu.com/japanese/japanese-onomatopoeia/' }
    ]
  },
];
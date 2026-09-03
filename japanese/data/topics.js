const defaultValues = { type: 'standard' };

export const topics = [
  {
    ...defaultValues,
    title: 'Time — 時間',
    subtitle: 'Words used to talk about when something happens.',
    content: [
      {
        heading: '今 — now',
        text: '今 means "now" or "the present moment." It refers to the current time or the immediate moment.',
        example: '今、勉強します。 (I will study now.)'
      },
      {
        heading: '今日 — today',
        text: '今日 means "today." It refers to the current day.',
        example: '今日は暑いです。 (It is hot today.)'
      },
      {
        heading: '明日 — tomorrow',
        text: '明日 means "tomorrow." It refers to the day after today.',
        example: '明日、学校へ行きます。 (I will go to school tomorrow.)'
      },
      {
        heading: '昨日 — yesterday',
        text: '昨日 means "yesterday." It refers to the day before today.',
        example: '昨日、映画を見ました。 (I watched a movie yesterday.)'
      },
      {
        heading: '～時 — o’clock / hour',
        text: '時 is used after a number to indicate a specific hour.',
        example: '三時です。 (It is three o’clock.) | 三時に行きます。 (I will go at three o’clock.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'AM and PM — 午前・午後',
    subtitle: 'Words used to specify whether a time is before or after noon.',
    content: [
      {
        heading: '午前 — AM',
        text: '午前 means "AM" or "before noon." It is placed before the hour.',
        example: '午前八時に学校へ行きます。 (I go to school at 8 AM.)'
      },
      {
        heading: '午後 — PM',
        text: '午後 means "PM" or "after noon." It is placed before the hour.',
        example: '午後三時に帰ります。 (I will go home at 3 PM.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'Duration — ～間',
    subtitle: '間 is used to express how long something lasts.',
    content: [
      {
        heading: '二日間 — for two days',
        text: '二日間 means "for two days." The suffix 間 indicates a duration of time.',
        example: '二日間、日本にいました。 (I was in Japan for two days.)'
      },
      {
        heading: '～間 — for a period of time',
        text: '間 can be added to a period of time to express its duration.',
        example: '三日間、日本にいました。 (I was in Japan for three days.) | 一年間、日本語を勉強しました。 (I studied Japanese for one year.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'From... to... — から・まで',
    subtitle: 'から and まで mark the beginning and ending points of a time or range.',
    content: [
      {
        heading: 'から — from',
        text: 'から indicates the starting point of a time, place, or range.',
        example: '九時から働きます。 (I work from 9 o’clock.)'
      },
      {
        heading: 'まで — until / to',
        text: 'まで indicates the ending point of a time, place, or range.',
        example: '五時まで働きます。 (I work until 5 o’clock.)'
      },
      {
        heading: '～から～まで — from... to...',
        text: 'から and まで can be combined to express a complete range, such as a period of time or a route.',
        example: '九時から五時まで働きます。 (I work from 9 to 5.) | 東京から大阪まで行きます。 (I go from Tokyo to Osaka.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'Location — 場所',
    subtitle: 'These expressions describe the position of something relative to another place or object.',
    content: [
      {
        heading: 'Nの前 — in front of / before',
        text: 'Nの前 means "in front of N" when talking about location. It can also mean "before N" when talking about time or order.',
        example: '学校の前にコンビニがあります。 (There is a convenience store in front of the school.) | 食事の前に手を洗います。 (I wash my hands before eating.)'
      },
      {
        heading: 'Nの後 — after',
        text: 'Nの後 means "after N," especially when talking about time or events.',
        example: '学校の後で勉強します。 (I study after school.)'
      },
      {
        heading: 'Nの近く — near',
        text: 'Nの近く means "near N" or "close to N." It indicates general proximity.',
        example: '駅の近くにレストランがあります。 (There is a restaurant near the station.)'
      },
      {
        heading: 'Nの隣 — next to',
        text: 'Nの隣 means "next to N" or "beside N." It indicates that something is immediately beside another thing.',
        example: '田中さんの隣に座ります。 (I sit next to Tanaka.)'
      },
      {
        heading: 'Nの中 — inside',
        text: 'Nの中 means "inside N" or "within N."',
        example: '箱の中に猫がいます。 (There is a cat inside the box.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'Ago — ～前',
    subtitle: '前 can be used after a period of time to say how long ago something happened.',
    content: [
      {
        heading: '十年前 — ten years ago',
        text: 'When 前 follows a period of time, it means "ago." No の is used in this structure.',
        example: '十年前、日本に行きました。 (I went to Japan ten years ago.)'
      },
      {
        heading: 'Time + 前 — ... ago',
        text: 'A quantity of time followed by 前 expresses how long ago something happened.',
        example: '三日前、映画を見ました。 (I watched a movie three days ago.) | 二時間前に帰りました。 (I went home two hours ago.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'Existence — います・あります',
    subtitle: 'These verbs express that someone or something exists or is located somewhere.',
    content: [
      {
        heading: 'います — to be / exist',
        text: 'います is mainly used for living things such as people and animals.',
        example: '猫がいます。 (There is a cat.) | 先生がいます。 (There is a teacher.)'
      },
      {
        heading: 'あります — to be / exist',
        text: 'あります is mainly used for objects, places, and other non-living things.',
        example: '本があります。 (There is a book.) | 学校があります。 (There is a school.)'
      },
      {
        heading: 'Place + に + が + います／あります',
        text: 'This pattern is used to say that a person, animal, or thing exists in a particular place.',
        example: '部屋に猫がいます。 (There is a cat in the room.) | 部屋に机があります。 (There is a desk in the room.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'Good — いい',
    subtitle: 'いい is a common adjective meaning "good."',
    content: [
      {
        heading: 'いい — good',
        text: 'いい means "good" and can describe people, things, situations, weather, and more.',
        example: 'この本はいいです。 (This book is good.) | いい人です。 (He/She is a good person.)'
      },
      {
        heading: 'よくない — not good',
        text: 'The negative form of いい is irregular. It changes to よくない rather than いくない.',
        example: 'これはよくないです。 (This is not good.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'Also / Too — も',
    subtitle: 'も is a particle used to say that something is also true or applies to another person or thing.',
    content: [
      {
        heading: 'も — also / too',
        text: 'も usually replaces particles such as は or が when saying that someone or something is also included.',
        example: '私は学生です。田中さんも学生です。 (I am a student. Tanaka is also a student.)'
      },
      {
        heading: 'Quantity + も — as many as / as much as',
        text: 'After a quantity, も can emphasize that the amount is surprisingly large or significant.',
        example: '二人もいます。 (There are as many as two people.)'
      }
    ],
  },

  {
    ...defaultValues,
    title: 'Nominalizing Actions — こと',
    subtitle: 'こと can turn an action or verb phrase into a noun-like concept.',
    content: [
      {
        heading: 'Verb + こと — doing...',
        text: 'こと can be placed after a verb in its dictionary form to talk about the action as a concept, similar to "doing..." or "the act of..." in English.',
        example: '日本語を勉強することは楽しいです。 (Studying Japanese is fun.)'
      },
      {
        heading: '～ことができます — can do...',
        text: 'The pattern Verb + ことができます means "can do something" or "be able to do something."',
        example: '日本語を話すことができます。 (I can speak Japanese.)'
      }
    ],
  },
  {
    type: 'list',
    title: 'Colors',
    subtitle: 'A list of common colors in Japanese.',
    items: [
      { kanji: '赤', kana: 'あか', meaning: 'red' },
      { kanji: '青', kana: 'あお', meaning: 'blue' },
      { kanji: '白', kana: 'しろ', meaning: 'white' },
      { kanji: '黒', kana: 'くろ', meaning: 'black' },
      { kanji: '黄色', kana: 'きいろ', meaning: 'yellow' },
      { kanji: '緑', kana: 'みどり', meaning: 'green' },
      { kanji: '茶色', kana: 'ちゃいろ', meaning: 'brown' },
      { kanji: '紫', kana: 'むらさき', meaning: 'purple' },
      { kanji: '桃色', kana: 'ももいろ', meaning: 'pink' },
      { kanji: '橙色', kana: 'だいだいいろ', meaning: 'orange' },
      
    ]
  },
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
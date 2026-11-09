const defaultValues = { type: 'standard' };

export const topics = [
  {
    ...defaultValues,
    title: 'Grab someone’s attention',
    subtitle: 'These expressions are used to get someone’s attention in Japanese.',
    content: [
      {
        heading: 'ねえ / ねぇ / ねー',
        text: 'A casual attention-getter used to call someone’s attention, usually before asking a question or making a comment. It can sound friendly, impatient, or dramatic depending on tone.',
        example: 'ねえ、今何してる？ (Hey, what are you doing right now?)',
        JLPT_level: 'N5'
      },
      {
        heading: 'あの / あのう / あのね / あのさ',
        text: 'A filler phrase used to get attention, soften a request, or begin a sentence when the speaker is thinking. あのさ is especially common in casual spoken Japanese.',
        example: 'あの、ちょっといいですか。 (Um, can I ask you something?) | あのさ、さっきの話なんだけど… (Hey, about what we were talking about earlier…)',
        JLPT_level: 'N5'
      },
      {
        heading: 'さあ',
        text: 'Used to encourage action, begin something, or mark a sudden shift. It can mean “come on,” “well then,” or “let’s do it,” depending on context.',
        example: 'さあ、始めましょう。 (Alright, let’s begin.)',
        JLPT_level: 'N5'
      },
      {
        heading: 'ちょっとさ',
        text: 'A casual conversational filler used to preface a complaint, explanation, or a request. It often adds a slightly casual or exasperated tone.',
        example: 'ちょっとさ、待ってよ。 (Hey, wait a second.)',
        JLPT_level: 'N5'
      },
      {
        heading: 'ていうか',
        text: 'A colloquial way of saying “I mean,” “like,” or “rather than that,” often used to correct, clarify, or emphasize what someone is saying.',
        example: 'ていうか、行きたくない。 (I mean, I don’t want to go.)',
        JLPT_level: 'N5'
      }
    ],
  },
  {
    ...defaultValues,
    title: 'ところで',
    subtitle: 'ところで is a Japanese expression used to change the topic of conversation or introduce a new subject. It can be translated as "by the way" or "incidentally."',
    JLPT_level: 'N3',
    content: [
      {
        heading: 'Changing the Topic',
        text: 'It is placed at the beginning of a sentence or clause to abruptly or smoothly shift the conversation to an unrelated new topic, question, or thought.'
      },
      {
        heading: 'Not for Related Additions',
        text: 'Unlike ちなみに (which means "by the way" in the sense of adding extra details to the current topic), tokorode pivots away from what you were just talking about.'
      },
      {
        heading: '〜たところで',
        text: 'When combined with the past tense of a verb, 〜たところで expresses that even if something has just happened, it will not change the outcome or situation. It can be translated as "even if" or "even though."',
        example: '今さら謝ったところで、もう遅い。 (Even if you apologize now, it’s already too late.)',
      }
    ]
  },
  {
    ...defaultValues,
    title: 'KOSOADO',
    subtitle: 'こそあど — (this / that / over there / which) words are Japanese demonstratives used to point to things, places, or directions relative to the speaker, listener, or a third person.',
    JLPT_level: 'N5',
    content: [
      {
        heading: 'これ, それ, あれ, and どれ',
        text: 'These are demonstrative pronouns for “this,” “that,” “that over there,” and “which.” They point to objects or people depending on distance and context.',
        example: 'これをください。 (Please give me this.) | それは高いですね。 (That is expensive.) | あれは何ですか。 (What is that over there?) | どれが好きですか。 (Which one do you like?)',
        JLPT_level: 'N5'
      },
      {
        heading: 'ここ, そこ, あそこ, and どこ',
        text: 'These are demonstrative words for places: “here,” “there,” “over there,” and “where.” They are used to indicate location or ask about location.',
        example: 'ここは駅です。 (This is the station.) | そこに座ってください。 (Please sit there.) | あそこにレストランがあります。 (There is a restaurant over there.) | どこに行きますか。 (Where are you going?)',
        JLPT_level: 'N5'
      },
      {
        heading: 'こちら, そちら, あちら, and どちら',
        text: 'These are the polite and formal versions of the kosoado set, often used with people, places, or directions in respectful speech. They can also mean “this way” or “that way” in a more formal tone.',
        example: 'こちらが私の家です。 (This is my house.) | そちらへ行きましょう。 (Let’s go that way.) | あちらは駅です。 (Over there is the station.) | どちらに行きますか。 (Which way are you going?)',
        JLPT_level: 'N5'
      },
      {
        heading: 'こっち, そっち, あっち, and どっち',
        text: 'These are the casual spoken forms of the same ideas, usually used in everyday conversation for directions and choices. They can mean “this way,” “that way,” “over there,” or “which way / which one.”',
        example: 'こっちに来て。 (Come this way.) | そっちのほうが早い。 (That way is faster.) | あっちにあるよ。 (It’s over there.) | どっちがいい？ (Which one is better?)',
        JLPT_level: 'N5'
      }
    ],
  },
  {
    ...defaultValues,
    title: 'なんか, なんて and など',
    subtitle: 'These expressions are used to indicate examples, emphasis, or a sense of "such as" in Japanese. They can be used in various contexts to convey different nuances.',
    content: [
      {
        heading: 'なんか (casual / spoken) — Attaches to Nouns or acts as a sentence-starter',
        text: 'なんか is often used to give examples or to express a casual or dismissive tone. It can be used to indicate that something is not particularly important or to downplay the significance of what is being mentioned.',
        example: '映画なんか見ない。 (I don’t watch movies.)',
        JLPT_level: 'N3'
      },
      {
        heading: 'なんて (casual / spoken) — Attaches to Nouns, Verbs, or full clauses',
        text: 'なんて is used to express surprise, disbelief, or emphasis. It can also be used to introduce an example in a more formal or literary context.',
        example: '彼がそんなことを言うなんて信じられない。 (I can’t believe he would say such a thing.)',
        JLPT_level: 'N3'
      },
      {
        heading: 'など (formal / written) — Attaches to Nouns',
        text: 'など is used to indicate that there are other similar items or examples, often in a more formal or written context. It can be used to list items or to suggest that the list is not exhaustive.',
        example: '本や雑誌などを読む。 (I read books, magazines, and so on.)',
        JLPT_level: 'N4'
      }
    ],
  },
  {
    ...defaultValues,
    title: 'Honorifics — 敬語',
    subtitle: '敬語 is a system of honorific speech in Japanese that shows respect and politeness. It is used to convey social hierarchy, humility, and formality in communication.',
    content: [
      {
        heading: '尊敬語 — Respectful Language',
        text: '尊敬語 is used to show respect towards the actions or status of others. It often involves using special verbs or verb forms to elevate the subject of the sentence.',
        example: '先生がいらっしゃいます。 (The teacher is here.)'
      },
      {
        heading: '家族の呼び方 — Family Members',
        text: 'Family members have specific ways of addressing each other in Japanese, which reflect the social hierarchy and relationships within the family.',
        example: 'お父さん (father) | お母さん (mother) | お兄さん (older brother) | お姉さん (older sister) | 弟 (younger brother) | 妹 (younger sister)'
      }
    ],
  },
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
    ...defaultValues,
    title: 'Kanji basics — 漢字',
    subtitle: 'A quick reference for common kanji-related symbols, notation, and writing conventions you may see while studying Japanese.',
    content: [
      {
        heading: 'Radical — 部首',
        text: 'A radical is the core component or key element of a kanji. In practice, radicals help organize kanji by shape and meaning, and they are often used as a study shortcut in dictionaries and drills.',
        example: '部首 is a dictionary grouping method; knowing a radical can help you find and remember a kanji more easily.'
      },
      {
        heading: 'Repetition mark — 々',
        text: 'The kanji repetition mark is used to show that a previous kanji or word is repeated without writing it again. It is common in older texts and some formal writing, although modern writing often avoids it in casual contexts.',
        example: '時々 (sometimes)'
      },
      {
        heading: '〆 — 締め — conclusion / ending',
        text: 'This entry reminds us that Japanese writing uses small symbols and vocabulary to indicate closure, conclusion, or summary. It is useful when reading headings, chapter endings, or formal prose that marks a logical finish.',
        example: '締めくくり (closing remarks) | 締め (ending, finish)'
      },
      {
        heading: 'Zero — 〇 / ゼロ / 0',
        text: 'Zero is commonly written as ゼロ in Japanese, especially in spoken or technical contexts, but the numeric symbol 0 is also widely used. It is a useful example of how Japanese often mixes native readings, borrowed readings, and numeric notation.',
        example: 'ゼロから始める (to start from zero)'
      },
      {
        heading: 'っ/ッ — Sokuon',
        text: 'The small っ is not a separate vowel sound; it functions as a strong pause that forces the following consonant to be pronounced more sharply.',
        example: 'ネット (net) | もっと (more; even more; longer; further)'
      },
      {
        heading: '長音符 — long vowel mark',
        text: 'The long vowel mark ー is used in Japanese writing to indicate that a vowel sound is held longer than usual. It is especially common in katakana and in loanwords, but it also appears in stylized or emphatic writing in other contexts.',
        example: 'スーパー (super) | キー (key)'
      },
      {
        heading: 'ダッシュ — dash',
        text: 'A dash is a straight or horizontal punctuation mark used to separate ideas, create emphasis, or add a pause in writing. In Japanese typography, it can serve a similar role to an em dash in English, especially in titles, notes, and dramatic text.',
        example: '私のことは――忘れない。 (I will not forget about it.)'
      },
      {
        heading: '波ダッシュ — wave dash',
        text: 'The wave dash 〜 is commonly used as a Japanese tilde-like symbol. It often stands for a range, a pause, or an approximate value, and it is widely used in writing to indicate “around,” “from...to...,” or a slight stylistic break.',
        example: '3〜4人 (about three to four people) | 10時〜11時 (from 10 to 11)'
      }
    ],
    sources: [
      { title: 'Japanese typographic symbols', url: 'https://en.wikipedia.org/wiki/List_of_Japanese_typographic_symbols' },
      { title: 'Unicode Japanese symbols', url: 'https://unicodes.jessetane.com/' },
      { title: 'Free Japanese fonts', url: 'https://www.freejapanesefont.com/category/calligraphy-2/' }
    ]
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
    title: 'Slang',
    subtitle: 'A list of common slang words in Japanese.',
    items: [
      {
        kanji: 'やばい',
        kana: 'やばい',
        meaning: 'dangerous, risky, or awesome',
      },
      {
        kanji: '教えて君',
        kana: 'おしえてくん',
        meaning: 'a person who constantly asks for help or information',
        notes: 'This term is often used in online communities to describe someone who frequently asks questions without trying to find answers on their own.'
      }
    ],
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
    content: 'Onomatopoeia is a significant part of the Japanese language, used to describe sounds, actions, and states. It can be categorized into two main types: 擬声語 for sounds made by living things and 擬音語 for sounds made by inanimate objects or nature. Additionally, there are 擬態語 which describe states or conditions, and 擬容語 which describe movements or actions. These expressions are often used in everyday conversation, literature, and media to convey vivid imagery and emotions.',
    sources: [
      { site: 'Tofugu', title: 'Japanese Onomatopoeia: The Definitive Guide', url: 'https://www.tofugu.com/japanese/japanese-onomatopoeia/' }
    ]
  },
];

// Route slug + relation tags for each topic, in the same order they appear above.
// Tags double as JLPT level markers (N5–N1) and as the grouping used for "related topics".
const TOPIC_META = [
  { id: 'honorifics',           tags: ['grammar', 'keigo', 'politeness', 'N4'] },
  { id: 'time',                 tags: ['grammar', 'time', 'vocabulary', 'N5'] },
  { id: 'am-pm',                tags: ['grammar', 'time', 'N5'] },
  { id: 'duration',             tags: ['grammar', 'time', 'particles', 'N4'] },
  { id: 'from-to',              tags: ['grammar', 'particles', 'time', 'N5'] },
  { id: 'location',             tags: ['grammar', 'particles', 'location', 'N5'] },
  { id: 'ago',                  tags: ['grammar', 'time', 'particles', 'N4'] },
  { id: 'existence',            tags: ['grammar', 'verbs', 'N5'] },
  { id: 'good',                 tags: ['grammar', 'adjectives', 'N5'] },
  { id: 'also-too',             tags: ['grammar', 'particles', 'N5'] },
  { id: 'nominalizing-actions', tags: ['grammar', 'verbs', 'N4'] },
  { id: 'kanji-basics',         tags: ['kanji', 'writing', 'vocabulary', 'N5'] },
  { id: 'colors',                tags: ['vocabulary', 'list', 'N5'] },
  { id: 'counters',              tags: ['vocabulary', 'list', 'grammar', 'N5'] },
  { id: 'numbers',               tags: ['vocabulary', 'list', 'N5'] },
  { id: 'days-of-week',          tags: ['vocabulary', 'list', 'time', 'N5'] },
  { id: 'months-of-year',        tags: ['vocabulary', 'list', 'time', 'N5'] },
  { id: 'kai-vs-kaime',          tags: ['grammar', 'counters', 'nuance', 'N3'] },
  { id: 'hitoshii-vs-onaji',     tags: ['grammar', 'nuance', 'N3'] },
  { id: 'sake-vs-shake',         tags: ['vocabulary', 'nuance', 'N3'] },
  { id: 'rtk-deck',              tags: ['resource', 'kanji'] },
  { id: 'onomatopoeia',          tags: ['resource', 'vocabulary', 'N2'] },
];

// Mutate the array entries in place (const only locks the binding, not the contents),
// so nothing above needs to be touched when you add/reorder topics later —
// just keep TOPIC_META in the same order as the entries above it.
topics.forEach((topic, index) => Object.assign(topic, TOPIC_META[index] || {}));
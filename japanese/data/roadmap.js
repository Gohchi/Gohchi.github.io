// Suggested path through the Japanese app, roughly in learning order.
//
// To add a new stage later (e.g. once a new section ships), just push another
// object onto this array — nothing else needs to change to display it.
//
// Each step can:
//  - link to an existing route:  links: [{ label, route: { name, params? } }]
//  - link outside the site:      links: [{ label, href: 'https://...' }]
//  - have no link at all, and just be a plain checklist item: links: []
//
// Set `comingSoon: true` on a step whose section doesn't exist on the site yet.
// It will render without a link instead of pointing at a route that 404s.

export const roadmap = [
  {
    id: 'foundations',
    title: 'Stage 1 — Drop the romaji',
    subtitle: 'Romaji is a crutch. Every day you keep reading it is a day you\'re not reading Japanese.',
    steps: [
      {
        id: 'learn-hiragana',
        title: 'Learn Hiragana',
        description: 'All 46 base characters, plus dakuten/handakuten and combo sounds. Drill until recognizing them is instant, not a translation step.',
        links: [
          { label: 'Kana Keyboard', route: { name: 'kana-keyboard' } },
          { label: 'Handwriting worksheets', route: { name: 'print-practice' } },
        ],
      },
      {
        id: 'learn-katakana',
        title: 'Learn Katakana',
        description: 'Same shapes to learn, different job: foreign words, names, sound effects. Easy to neglect since it shows up less at first — don\'t.',
        links: [
          { label: 'Kana Keyboard', route: { name: 'kana-keyboard' } },
          { label: 'Handwriting worksheets', route: { name: 'print-practice' } },
        ],
      },
      {
        id: 'no-more-romaji',
        title: 'Stop reading romaji, starting now',
        description: 'From here on, treat romaji as a last resort, not a reading aid. Everything else on this site is built kana-first on purpose.',
        links: [],
      },
    ],
  },
  {
    id: 'phrases-grammar',
    title: 'Stage 2 — Everyday phrases & grammar base',
    subtitle: 'Enough vocabulary and structure to recognize patterns instead of guessing.',
    steps: [
      {
        id: 'common-phrases',
        title: 'Learn common phrases by JLPT level',
        description: 'Start at N5. Favorite the ones you actually use so they\'re easy to find again.',
        links: [
          { label: 'Common Phrases', route: { name: 'common-phrases' } },
        ],
      },
      {
        id: 'core-grammar',
        title: 'Work through the grammar & vocab topics',
        description: 'Particles, time expressions, existence (います／あります), counters, numbers — the connective tissue that makes sentences make sense.',
        links: [
          { label: 'Topics', route: { name: 'topics' } },
        ],
      },
    ],
  },
  {
    id: 'verbs-adjectives',
    title: 'Stage 3 — Verbs & adjectives',
    subtitle: 'Once these conjugate without thinking, sentences stop being a puzzle.',
    steps: [
      {
        id: 'verb-conjugation',
        title: 'Practice verb conjugation',
        description: 'Godan, ichidan, and the irregulars. ます／て／ない／た forms, drilled by group and JLPT level.',
        links: [
          { label: 'Verb Practice', route: { name: 'verbs-practice' } },
        ],
      },
      {
        id: 'adjective-conjugation',
        title: 'Practice い-adjectives and な-adjectives',
        description: 'How they conjugate and combine with nouns and verbs.',
        comingSoon: true,
        links: [],
      },
    ],
  },
  {
    id: 'kanji-basics',
    title: 'Stage 4 — Basic Kanji',
    subtitle: 'Start with N5 kanji. Recognition first, stroke order second, meaning always attached.',
    steps: [
      {
        id: 'kanji-handwriting',
        title: 'Practice writing N5 kanji',
        description: 'Print worksheets with stroke-order guides, filtered by JLPT level.',
        links: [
          { label: 'Print Practice', route: { name: 'print-practice' } },
        ],
      },
      {
        id: 'kanji-in-context',
        title: 'Look kanji up as you read',
        description: 'Any kanji across the site is clickable — tap it for furigana and meaning instead of skipping past it.',
        links: [
          { label: 'Topics', route: { name: 'topics' } },
          { label: 'Common Phrases', route: { name: 'common-phrases' } },
        ],
      },
    ],
  },
  {
    id: 'real-reading',
    title: 'Stage 5 — Read real Japanese',
    subtitle: 'Everything above exists to get you here.',
    steps: [
      {
        id: 'read-translations',
        title: 'Read a translated novel side-by-side',
        description: 'Start with the translation toggle on, lean on it less over time.',
        links: [
          { label: 'Translations', route: { name: 'translations' } },
        ],
      },
      {
        id: 'read-without-translation',
        title: 'Turn the translation off',
        description: 'Switch it off once you can follow a page without checking English every line.',
        links: [
          { label: 'Translations', route: { name: 'translations' } },
        ],
      },
    ],
  },
  {
    id: 'keep-going',
    title: 'Stage 6 — Keep the loop going',
    subtitle: 'This is maintenance, not a finish line.',
    steps: [
      {
        id: 'daily-review',
        title: 'Review a little every day',
        description: 'Kana Keyboard and Verb Practice both track memory per item and weight toward what you\'re weakest at — a few minutes a day compounds.',
        links: [
          { label: 'Kana Keyboard', route: { name: 'kana-keyboard' } },
          { label: 'Verb Practice', route: { name: 'verbs-practice' } },
        ],
      },
    ],
  },
];

export default roadmap;
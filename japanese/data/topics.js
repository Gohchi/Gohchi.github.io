const defaultValues = { type: 'standard' };

export const topics = [
  {
    ...defaultValues,
    title: '回 vs 回目',
    subtitle: '回 is the total number of the turn, 回目 is the number of the turn.',
    sources: [
      'https://hinative.com/questions/19985295#featured_answer_46769428'
    ]
  },
  {
    ...defaultValues,
    title: '等しい vs 同じ',
    subtitle: '同じ=exactly the same | 同様=about the same, similar | 等しい=equal',
    sources: [
      'https://hinative.com/questions/25933058#answer-58675440'
    ]
  },
  {
    ...defaultValues,
    title: 'さけ vs しゃけ',
    subtitle: 'Both are 鮭, salmon. Maybe to avoid confusion with alcohol (sake)',
    sources: [
      'https://japanese.stackexchange.com/questions/1217/whats-the-difference-between-%e3%81%95%e3%81%91-sake-and-%e3%81%97%e3%82%83%e3%81%91-shake'
    ]
  },
  {
    type: 'resource',
    title: 'Remembering the Kanji 1, 6th Edition (2200 Kanji)',
    subtitle: 'This is a deck including all 2200 kanji of the book Remembering the Kanji 1, 6th Edition, by James W. Heisig.',
    sources: [
      'https://ankiweb.net/shared/info/1654787298'
    ]
  }
];
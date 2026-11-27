// Words for the location practice (/location-practice).
//
// Each location has one or more `layouts`: where the subject (the icon that "is" somewhere) and the
// reference icon(s) sit in a 5 x 5 grid, as [column, row] (1..5). The view picks one at random and
// draws it with a random subject / reference from SUBJECTS and REFS.
//
// Layout flags:
//   box     draws a box (中 / 外): the reference becomes the big faded container behind the subject
//   ring    draws a dashed "near" area around the reference (近く)
//   depth   'front' | 'behind': subject and reference share the center cell and overlap (前 / 後ろ)
//   viewer  adds 👀 at the bottom, so "in front" means "closer to you"
//
// `group` = what the scene looks like. Wrong options in choice mode never come from the same group
// as the answer, because two words of one group can describe the same picture (隣 vs 右).

const L = (word, reading, meaning, level, group, layouts) => ({
  word, reading, meaning, level, group, layouts,
});

export const LOCATION_GROUPS = [
  { key: 'vertical', label: 'Up / down', short: 'Vertical' },
  { key: 'depth', label: 'Front / behind', short: 'Depth' },
  { key: 'side', label: 'Sides / near', short: 'Side' },
  { key: 'container', label: 'Inside / outside', short: 'Container' },
  { key: 'between', label: 'Between', short: 'Between' },
];

export const LOCATIONS = [
  L('上', 'うえ', 'above, on top of', 'N5', 'vertical', [
    { sub: [3, 2], refs: [[3, 3]] },
  ]),
  L('下', 'した', 'below, under', 'N5', 'vertical', [
    { sub: [3, 4], refs: [[3, 3]] },
  ]),
  L('前', 'まえ', 'in front of', 'N5', 'depth', [
    { sub: [3, 3], refs: [[3, 3]], depth: 'front', viewer: true },
  ]),
  L('後ろ', 'うしろ', 'behind', 'N4', 'depth', [
    { sub: [3, 3], refs: [[3, 3]], depth: 'behind', viewer: true },
  ]),
  L('右', 'みぎ', 'right', 'N5', 'side', [
    { sub: [5, 3], refs: [[3, 3]] },
  ]),
  L('左', 'ひだり', 'left', 'N5', 'side', [
    { sub: [1, 3], refs: [[3, 3]] },
  ]),
  L('隣', 'となり', 'next to', 'N4', 'side', [
    { sub: [4, 3], refs: [[3, 3]] },
    { sub: [2, 3], refs: [[3, 3]] },
  ]),
  L('近く', 'ちかく', 'near', 'N4', 'side', [
    { sub: [4, 2], refs: [[3, 3]], ring: true },
    { sub: [2, 2], refs: [[3, 3]], ring: true },
    { sub: [4, 4], refs: [[3, 3]], ring: true },
    { sub: [2, 4], refs: [[3, 3]], ring: true },
  ]),
  L('中', 'なか', 'inside', 'N5', 'container', [
    { sub: [3, 3], refs: [[3, 3]], box: true },
  ]),
  L('外', 'そと', 'outside', 'N5', 'container', [
    { sub: [1, 1], refs: [[3, 3]], box: true },
    { sub: [5, 1], refs: [[3, 3]], box: true },
    { sub: [1, 5], refs: [[3, 3]], box: true },
    { sub: [5, 5], refs: [[3, 3]], box: true },
  ]),
  L('間', 'あいだ', 'between', 'N4', 'between', [
    { sub: [3, 3], refs: [[2, 3], [4, 3]] },
  ]),
];

// The one that is somewhere. `word` / `reading` are used to build the sentence.
export const SUBJECTS = [
  { emoji: '🐱', word: '猫', reading: 'ねこ', animate: true },
  { emoji: '🐶', word: '犬', reading: 'いぬ', animate: true },
  { emoji: '🐦', word: '鳥', reading: 'とり', animate: true },
  { emoji: '📖', word: '本', reading: 'ほん', animate: false },
  { emoji: '🌸', word: '花', reading: 'はな', animate: false },
];

// What it is somewhere relative to.
export const REFS = [
  { emoji: '📦', word: '箱', reading: 'はこ' },
  { emoji: '🚗', word: '車', reading: 'くるま' },
  { emoji: '🌳', word: '木', reading: 'き' },
  { emoji: '⛰️', word: '山', reading: 'やま' },
  { emoji: '🚉', word: '駅', reading: 'えき' },
  { emoji: '🏪', word: '店', reading: 'みせ' },
  { emoji: '📺', word: 'テレビ', reading: 'てれび' },
];

// References that make sense as a "container" (箱の中, 車の外...)
export const CONTAINERS = ['箱', '車', '駅', '店'];
// ALL leveling / XP / unlock mechanics live in this file. To retune the game, edit here only.
//
//   1. XP tuning        STAGE_SHARE, LEVEL_CURVE, CATEGORIES
//   2. Levels           levelInfo(), getSnapshot()
//   3. Menu + unlocks   MENU (tree of groups and sections), buildMenu(), isRouteUnlocked()
//
// XP is DERIVED from the practice progress (data/progress.js), never stored on its own:
// every item pays XP the first time it reaches a new memory stage (its best stage, `best`),
// so a wrong answer never takes XP away, and retuning the numbers below re-levels everybody.

import { getAllProgress } from 'data/progress.js';
import { hiragana, katakana, baseKana } from 'data/kana-romaji.js';
import { ruby } from 'data/kanji.js';
import verbsData from 'data/verbs.js';
import adjectivesData from 'data/adjectives.js';
import { VERB_FORMS } from 'data/conjugate.js';

// ---------------------------------------------------------------------------
// 1. XP tuning
// ---------------------------------------------------------------------------

// Cumulative share of an item's XP once its best memory stage is n (0..5).
// Same as 10 / 15 / 20 / 25 / 30 XP per stage for a 100 XP item.
export const STAGE_SHARE = [0, 0.10, 0.25, 0.45, 0.70, 1];

// Cumulative share of a category's total XP needed for Lv 1..10 (Lv 10 = everything mastered).
export const LEVEL_CURVE = [0, 0.03, 0.08, 0.14, 0.24, 0.37, 0.51, 0.67, 0.85, 1];

// One entry per XP category.
//   store      progress category in data/progress.js
//   stores     OR several [[store, share], ...] when one item is practiced in several modes
//   xpPerItem  XP of an item mastered (stage 5)
//   items()    keys of the items that count
export const CATEGORIES = {
  hiragana: { label: 'Hiragana', store: 'kana-hiragana', xpPerItem: 100, items: () => Object.keys(hiragana) },
  katakana: { label: 'Katakana', store: 'kana-katakana', xpPerItem: 100, items: () => Object.keys(katakana) },
  // A kanji is worth 100 XP: 50% for the reading mode, 50% for the meaning mode.
  // Only kanji with a group tag count (compounds and text-specific entries are free extras).
  kanji: {
    label: 'Kanji', xpPerItem: 100,
    stores: [['words-kanji', 0.5], ['words-kanji-meaning', 0.5]],
    items: () => TAGGED_KANJI,
  },
  // A verb is worth 60 XP, split between its forms (keys `dictionary:form`).
  verbs: {
    label: 'Verbs', store: 'verbs', xpPerItem: 60 / VERB_FORMS.length,
    items: () => verbsData.flatMap(verb => VERB_FORMS.map(form => `${verb.dictionary}:${form}`)),
  },
  adjectives: { label: 'Adjectives', store: 'adjectives', xpPerItem: 40, items: () => adjectivesData.map(a => a.dictionary) },
};

// ---------------------------------------------------------------------------
// 2. Levels
// ---------------------------------------------------------------------------

const TAGGED_KANJI = Object.keys(ruby).filter(key => ruby[key].tags?.length);

const MAX_STAGE = STAGE_SHARE.length - 1;

// Highest stage the item ever reached. `best` is written by recordAnswer();
// older entries without it fall back to their current memory.
const bestStage = entry => Math.min(MAX_STAGE, Math.max(entry?.best ?? 0, entry?.memory ?? 0));

export function levelInfo(xp, cap) {
  const thresholds = LEVEL_CURVE.map(share => Math.round(share * cap));
  const maxLevel = thresholds.length;
  if (cap <= 0) return { level: 1, maxLevel, xp, cap, floor: 0, next: null, toNext: 0, progress: 0, maxed: false };

  let level = 1;
  thresholds.forEach((threshold, index) => { if (xp >= threshold) level = index + 1; });

  const maxed = level >= maxLevel;
  const floor = thresholds[level - 1];
  const next = maxed ? null : thresholds[level];

  return {
    level,
    maxLevel,
    xp,
    cap,
    floor,
    next,
    toNext: maxed ? 0 : next - xp,
    progress: maxed ? 1 : (xp - floor) / (next - floor),
    maxed,
  };
}

// "Show everything" switch for people who already know the basics (a Settings toggle can call setUnlockAll).
const UNLOCK_ALL_KEY = 'jp-unlock-all';
export const isUnlockAll = () => {
  try { return localStorage.getItem(UNLOCK_ALL_KEY) === '1'; } catch (e) { return false; }
};
export const setUnlockAll = on => {
  try { localStorage.setItem(UNLOCK_ALL_KEY, on ? '1' : '0'); } catch (e) { /* ignore */ }
};

// Everything the menu / pages need, computed from ONE read of the progress store.
export function getSnapshot(all = getAllProgress()) {
  const categories = {};

  for (const [id, config] of Object.entries(CATEGORIES)) {
    const keys = config.items();
    const stores = config.stores || [[config.store, 1]];
    const xp = keys.reduce((sum, key) => sum + config.xpPerItem * stores.reduce(
      (acc, [store, share]) => acc + share * STAGE_SHARE[bestStage(all[store]?.[key])], 0), 0);
    categories[id] = { id, label: config.label, ...levelInfo(Math.round(xp), keys.length * config.xpPerItem) };
  }

  return { categories, unlockAll: isUnlockAll() };
}

// ---------------------------------------------------------------------------
// 3. Menu + unlocks
// ---------------------------------------------------------------------------
//
// MENU is a tree. A node with `to` is a section (leaf); a node with `children` is a group.
//   requires  { categoryId: minLevel, ... }  all must be met. A group's requirement applies to its children.
//   soft      hidden from the menu until unlocked, but the route stays reachable (reference content).
//             Without `soft` the route is locked too (see isRouteUnlocked, used by the router guard).
//   practice  chopsticks style chip
//   primary   (in a group) the child that the group chip stands for when it is the only one visible
//
// A group with a single visible child is shown as a plain chip, so new users see "HIRAGANA"
// and the sublist only appears once there is something else inside.
export const MENU = [
  { id: 'home', to: '/', label: 'HOME' },
  { id: 'roadmap', to: '/roadmap', label: 'ROADMAP' },
  { id: 'progress', to: '/progress', label: 'PROGRESS' },

  {
    id: 'hiragana', label: 'HIRAGANA', practice: true,
    children: [
      { id: 'hiragana-practice', to: '/hiragana-practice', label: 'CHARACTERS', primary: true },
      { id: 'hiragana-keyboard', to: '/hiragana-keyboard', label: 'KEYBOARD', requires: { hiragana: 2 } },
      { id: 'hiragana-words', to: '/hiragana-words', label: 'WORDS', requires: { hiragana: 3 } },
    ],
  },
  {
    id: 'katakana', label: 'KATAKANA', practice: true, requires: { hiragana: 5 },
    children: [
      { id: 'katakana-practice', to: '/katakana-practice', label: 'CHARACTERS', primary: true },
      { id: 'katakana-keyboard', to: '/katakana-keyboard', label: 'KEYBOARD', requires: { katakana: 2 } },
      { id: 'katakana-words', to: '/katakana-words', label: 'WORDS', requires: { katakana: 3 } },
    ],
  },
  {
    id: 'kanji', label: 'KANJI', practice: true, requires: { hiragana: 6 },
    children: [
      { id: 'kanji-meaning', to: '/kanji-meaning', label: 'MEANING', primary: true },
      { id: 'kanji-reading', to: '/kanji-reading', label: 'READING' },
    ],
  },
  {
    id: 'verbs', label: 'VERB', practice: true, requires: { hiragana: 6 },
    children: [
      { id: 'verbs-practice', to: '/verbs-practice', label: 'PRACTICE', primary: true },
    ],
  },
  {
    id: 'adjectives', label: 'ADJECTIVE', practice: true, requires: { hiragana: 6 },
    children: [
      { id: 'adjectives-practice', to: '/adjectives-practice', label: 'PRACTICE', primary: true },
    ],
  },
  { id: 'speech', to: '/speech-practice', label: 'SPEECH', practice: true, requires: { hiragana: 4 } },
  { id: 'print', to: '/print-practice', label: 'PRINT', practice: true },

  // Reference content: hidden until it makes sense, never blocked.
  {
    id: 'more', label: 'MORE',
    children: [
      { id: 'topics', to: '/topics', label: 'TOPICS', practice: true, soft: true, requires: { hiragana: 2 } },
      { id: 'common-phrases', to: '/common-phrases', label: 'COMMON PHRASES', practice: true, soft: true, requires: { hiragana: 3 } },
      { id: 'translations', to: '/translations', label: 'TRANSLATIONS', soft: true, requires: { hiragana: 5 } },
    ],
  },

  { id: 'settings', to: '/settings', label: 'SETTINGS' },
  { id: 'admin', to: '/admin', label: 'ADMIN', admin: true },
  { id: 'donate', to: '/donate', label: 'DONATE ♥' },
];

// AND of two requirements (the higher level wins per category)
const mergeRequires = (a = {}, b = {}) => {
  const result = { ...a };
  for (const [id, level] of Object.entries(b)) result[id] = Math.max(result[id] ?? 1, level);
  return result;
};

// A leaf with everything inherited from its group
const describe = (node, parent = {}) => ({
  ...node,
  requires: mergeRequires(parent.requires, node.requires),
  soft: node.soft ?? parent.soft ?? false,
  practice: node.practice ?? parent.practice ?? false,
  groupId: parent.id ?? null,
  groupLabel: parent.label ?? null,
});

const allLeaves = () => MENU.flatMap(node => (
  node.children ? node.children.map(child => describe(child, node)) : [describe(node)]
));

const meets = (requires, snapshot) => (
  snapshot.unlockAll
  || Object.entries(requires || {}).every(([id, level]) => (snapshot.categories[id]?.level ?? 1) >= level)
);

export const describeRequirement = requires => Object.entries(requires || {})
  .map(([id, level]) => `${CATEGORIES[id]?.label ?? id} Lv ${level}`)
  .join(' + ');

const matchesPath = (to, path) => (to === '/' ? path === '/' : path === to || path.startsWith(to + '/'));

// What the header menu renders:
//   [{ type: 'link', id, to, label, practice, selected }
//    { type: 'group', id, label, practice, selected, children: [link, ...] }]
// Locked sections are not in the list at all.
export function buildMenu({ snapshot = getSnapshot(), path = '/', isAdmin = false } = {}) {
  const toLink = leaf => ({
    type: 'link',
    id: leaf.id,
    to: leaf.to,
    label: leaf.label,
    practice: leaf.practice,
    selected: matchesPath(leaf.to, path),
  });

  const menu = [];

  for (const node of MENU) {
    if (node.admin && !isAdmin) continue;

    if (node.to) {
      if (meets(describe(node).requires, snapshot)) menu.push(toLink(describe(node)));
      continue;
    }

    const visible = node.children
      .map(child => describe(child, node))
      .filter(leaf => meets(leaf.requires, snapshot));

    if (!visible.length) continue;

    if (visible.length === 1) {
      const [leaf] = visible;
      menu.push({ ...toLink(leaf), label: leaf.primary ? node.label : leaf.label });
      continue;
    }

    const children = visible.map(toLink);
    menu.push({
      type: 'group',
      id: node.id,
      label: node.label,
      practice: Boolean(node.practice),
      selected: children.some(child => child.selected),
      children,
    });
  }

  return menu;
}

// false = locked sections are only hidden from the menu, typing the URL still works (no redirect).
export const HARD_LOCKS = true;

// Router guard: hard-locked sections redirect, soft ones and unknown routes always pass.
export function isRouteUnlocked(path, snapshot = getSnapshot()) {
  if (!HARD_LOCKS) return true;
  const leaf = allLeaves().find(({ to }) => to !== '/' && matchesPath(to, path));
  if (!leaf || leaf.soft) return true;
  return meets(leaf.requires, snapshot);
}

// Sections still locked, with what they need. For the "unlocks at..." teasers on Progress / Home.
export function lockedUnits(snapshot = getSnapshot()) {
  return allLeaves()
    .filter(leaf => !meets(leaf.requires, snapshot))
    .map(({ id, to, label, groupLabel, requires }) => ({
      id,
      to,
      label: groupLabel && groupLabel !== label ? `${groupLabel} · ${label}` : label,
      needs: describeRequirement(requires),
    }));
}

// ---------------------------------------------------------------------------
// 4. Level-up / unlock detection (used by components/LevelToast.js)
// ---------------------------------------------------------------------------

// What changed between two snapshots: categories that gained a level and sections that opened.
export function diffSnapshots(before, after) {
  const levelUps = Object.values(after.categories)
    .filter(c => c.level > (before.categories[c.id]?.level ?? 1))
    .map(c => ({ category: c.id, label: c.label, level: c.level }));

  const stillLocked = new Set(lockedUnits(after).map(u => u.id));
  const newlyOpen = lockedUnits(before).filter(u => !stillLocked.has(u.id));

  return { levelUps, newlyOpen };
}

// Sum of all categories, for the "total" bar on the Progress page.
export function totalXp(snapshot) {
  const cats = Object.values(snapshot.categories);
  return { xp: cats.reduce((s, c) => s + c.xp, 0), cap: cats.reduce((s, c) => s + c.cap, 0) };
}

// ---------------------------------------------------------------------------
// 5. Kanji groups (#tags): which kanji may be practiced
// ---------------------------------------------------------------------------

export const KANJI_GROUPS = [
  'numbers', 'week', 'time', 'people', 'body', 'direction', 'nature',
  'motion', 'daily', 'description', 'colors', 'school', 'places', 'things',
  'animals-plants', 'misc',
];

// Kana cap: how many groups the player may open, by hiragana level. [min hiragana level, groups allowed]
export const KANJI_GROUP_CAP = [[6, 2], [7, 4], [8, 8], [9, 12], [10, 16]];

export const GROUP_PASS_SHARE = 0.7; // the next group opens when 70% of the previous one...
export const GROUP_PASS_STAGE = 3;   // ...reached memory stage 3 (best stage, in either mode)

const KANJI_STORES = ['words-kanji', 'words-kanji-meaning'];
const KANJI_CHAR = /[\u3400-\u9fff々]/;
const EXTRA = '*'; // kanji without a group tag

const groupOfKanji = ch => ruby[ch]?.tags?.[0] ?? EXTRA;

const kanjiBest = (all, key) => Math.max(...KANJI_STORES.map(store => bestStage(all[store]?.[key])));

// Group ids that are open: the 70% chain, limited by the hiragana level (kana cap).
export function availableKanjiGroups(snapshot = getSnapshot(), all = getAllProgress()) {
  if (snapshot.unlockAll) return [...KANJI_GROUPS];

  let chain = 1;
  while (chain < KANJI_GROUPS.length) {
    const members = TAGGED_KANJI.filter(key => groupOfKanji(key) === KANJI_GROUPS[chain - 1]);
    const passed = members.filter(key => kanjiBest(all, key) >= GROUP_PASS_STAGE).length;
    if (!members.length || passed / members.length < GROUP_PASS_SHARE) break;
    chain++;
  }

  const level = snapshot.categories.hiragana?.level ?? 1;
  const allowed = KANJI_GROUP_CAP.reduce((n, [min, groups]) => (level >= min ? groups : n), 0);
  return KANJI_GROUPS.slice(0, Math.min(chain, allowed));
}

// Why a group is closed, for the dimmed cells of the pool.
export function describeGroupLock(group, snapshot = getSnapshot(), all = getAllProgress()) {
  const index = KANJI_GROUPS.indexOf(group);
  if (index <= 0) return '';
  const open = availableKanjiGroups(snapshot, all);
  if (open.includes(group)) return '';

  const level = snapshot.categories.hiragana?.level ?? 1;
  const allowed = KANJI_GROUP_CAP.reduce((n, [min, groups]) => (level >= min ? groups : n), 0);
  if (index >= allowed) {
    const needed = KANJI_GROUP_CAP.find(([, groups]) => groups > index);
    return needed ? `Hiragana Lv ${needed[0]}` : '';
  }
  return `70% of #${KANJI_GROUPS[index - 1]} at stage ${GROUP_PASS_STAGE}`;
}

// ---------------------------------------------------------------------------
// 6. Words unlock by the kana already answered correctly
// ---------------------------------------------------------------------------

// The practiced kana a text needs (voiced kana map to their base kana; ー, っ, ゃ... are free).
export function wordRequirements(text, script = 'hiragana') {
  const table = script === 'katakana' ? katakana : hiragana;
  return [...new Set([...text].map(baseKana).filter(ch => table[ch]))];
}

export function isWordUnlocked(text, script = 'hiragana', all = getAllProgress()) {
  return missingKana(text, script, all).length === 0;
}

const missingKana = (text, script, all) => {
  const bucket = all[script === 'katakana' ? 'kana-katakana' : 'kana-hiragana'] || {};
  return wordRequirements(text, script).filter(kana => !((bucket[kana]?.correct || 0) > 0));
};

// Everything the practice pages need to filter words, from ONE read of the progress store.
export function unlockContext() {
  const all = getAllProgress();
  const snapshot = getSnapshot(all);
  return { all, snapshot, openGroups: new Set(availableKanjiGroups(snapshot, all)) };
}

// word: an entry of data/words.js ({ word, reading, type: 'hiragana' | 'katakana' | 'kanji' })
// -> { locked, missing: [kana], groups: [closed #groups], needs: 'text for the dimmed cell' }
export function wordStatus({ word, reading, type }, ctx = unlockContext()) {
  if (ctx.snapshot.unlockAll) return { locked: false, missing: [], groups: [], needs: '' };

  // katakana words are read from the katakana, hiragana and kanji words from the hiragana reading
  const missing = type === 'katakana'
    ? missingKana(word, 'katakana', ctx.all)
    : missingKana(reading, 'hiragana', ctx.all);

  const groups = [];
  if (type === 'kanji') {
    // A word needs every GROUPED kanji it contains to be open. Words made only of kanji without a
    // group (text-specific vocabulary) open once every group is open.
    const chars = [...word].filter(c => KANJI_CHAR.test(c));
    const grouped = chars.filter(c => groupOfKanji(c) !== EXTRA);
    if (grouped.length) {
      for (const c of grouped) {
        const group = groupOfKanji(c);
        if (!ctx.openGroups.has(group) && !groups.includes(group)) groups.push(group);
      }
    } else if (chars.length && ctx.openGroups.size < KANJI_GROUPS.length) {
      groups.push(EXTRA);
    }
  }

  const needs = [
    missing.length ? `needs: ${missing.join(', ')}` : '',
    ...groups.map(group => (group === EXTRA ? 'after every kanji group' : `#${group} locked`)),
  ].filter(Boolean).join(' · ');

  return { locked: Boolean(missing.length || groups.length), missing, groups, needs };
}

// Splits a word into characters flagged as missing (red) or not (green) for the locked-words list.
// A voiced kana (が) is missing when its base kana (か) is.
export function markKana(text, missing) {
  return [...text].map(ch => ({ ch, missing: missing.includes(baseKana(ch)) }));
}

// words.filter(...) helper: [{ unlocked: [...], locked: [{ ...word, needs }] }]
export function splitWords(words, ctx = unlockContext()) {
  const unlocked = [];
  const locked = [];
  for (const entry of words) {
    const status = wordStatus(entry, ctx);
    (status.locked ? locked : unlocked).push(status.locked ? { ...entry, needs: status.needs, missing: status.missing } : entry);
  }
  return { unlocked, locked };
}

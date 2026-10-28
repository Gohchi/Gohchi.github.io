// Registry of every practice pool. The Settings page is built from this list,
// so a new pool = one more entry in POOLS (and the same storageKey in its practice view).
//
// Each pool stores the words the user turned OFF (same keys the practice views already use),
// so words added to the data later are in the pool by default.
//
// getItems() returns plain rows: { key, word, reading, meaning, level, facet, facetShort,
//   search, memory (0-5), state ('new' | 'learning' | 'mastered'), detail }

import wordsData from 'data/words.js';
import verbsData from 'data/verbs.js';
import adjectivesData from 'data/adjectives.js';
import { VERB_FORMS, FORM_LABELS } from 'data/conjugate.js';
import { MAX_MEMORY, getCategoryEntries } from 'data/progress.js';
import { loadSelection, saveSelection } from 'components/FilterMenu.js';

const entriesOf = category => Object.fromEntries(getCategoryEntries(category));
const answered = entry => (entry?.correct || 0) + (entry?.wrong || 0) > 0;

// parts: [[label, entry], ...]. One progress entry per mode / form the item is practiced in.
// memory = average of the parts (what the bar shows); mastered = every part is maxed.
function memoryOf(parts) {
  const values = parts.map(([, entry]) => entry?.memory ?? 0);
  const memory = Math.round(values.reduce((sum, value) => sum + value, 0) / parts.length);
  const state = !parts.some(([, entry]) => answered(entry))
    ? 'new'
    : values.every(value => value >= MAX_MEMORY) ? 'mastered' : 'learning';
  const detail = parts.map(([label], i) => `${label} ${values[i]}/${MAX_MEMORY}`).join(' · ');
  return { memory, state, detail };
}

function makeItem({ key, word, reading, meaning, level, facet = '', facets = [], parts }) {
  return {
    key,
    word,
    reading,
    meaning: meaning || '',
    level: level || '',
    facet,
    facetShort: facets.find(f => f.key === facet)?.short || '',
    search: `${word} ${reading} ${meaning || ''}`.toLowerCase(),
    ...memoryOf(parts),
  };
}

const VERB_GROUPS = [
  { key: '1', label: 'Group 1 · godan', short: 'Group 1' },
  { key: '2', label: 'Group 2 · ichidan', short: 'Group 2' },
  { key: '3', label: 'Group 3 · irregular', short: 'Group 3' },
];

const ADJECTIVE_TYPES = [
  { key: 'i', label: 'い-adjectives', short: 'い' },
  { key: 'na', label: 'な-adjectives', short: 'な' },
];

export const POOLS = [
  {
    id: 'kanji',
    label: 'Kanji',
    route: '/kanji-practice',
    storageKey: 'kanji-practice-excluded',
    facetLabel: '',
    facets: [],
    getItems() {
      const byReading = entriesOf('words-kanji');
      const byMeaning = entriesOf('words-kanji-meaning');

      return wordsData
        .filter(({ type }) => type === 'kanji')
        .map(({ word, reading, meaning, level }) => makeItem({
          key: word,
          word,
          reading,
          meaning,
          level,
          parts: [['reading', byReading[word]], ['meaning', byMeaning[word]]],
        }));
    },
  },
  {
    id: 'verbs',
    label: 'Verbs',
    route: '/verbs-practice',
    storageKey: 'verbs-practice-excluded',
    facetLabel: 'Group',
    facets: VERB_GROUPS,
    getItems() {
      const entries = entriesOf('verbs');

      return verbsData.map(({ dictionary, reading, meaning, level, group }) => makeItem({
        key: dictionary,
        word: dictionary,
        reading,
        meaning,
        level,
        facet: String(group),
        facets: VERB_GROUPS,
        parts: VERB_FORMS.map(form => [FORM_LABELS[form], entries[`${dictionary}:${form}`]]),
      }));
    },
  },
  {
    id: 'adjectives',
    label: 'Adjectives',
    route: '/adjectives-practice',
    storageKey: 'adjectives-practice-excluded',
    facetLabel: 'Type',
    facets: ADJECTIVE_TYPES,
    getItems() {
      const entries = entriesOf('adjectives');

      return adjectivesData.map(({ dictionary, reading, meaning, level, type }) => makeItem({
        key: dictionary,
        word: dictionary,
        reading,
        meaning,
        level,
        facet: type,
        facets: ADJECTIVE_TYPES,
        parts: [['memory', entries[dictionary]]],
      }));
    },
  },
];

export const getPool = id => POOLS.find(pool => pool.id === id) || null;

export const getExcluded = pool => loadSelection(pool.storageKey, []);

export const saveExcluded = (pool, list) => saveSelection(pool.storageKey, list);
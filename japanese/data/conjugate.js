// Godan (group 1) u-dan endings -> a-dan / i-dan / e-dan variants
const GODAN_ROWS = {
  'う': { a: 'わ', i: 'い', e: 'え' },
  'く': { a: 'か', i: 'き', e: 'け' },
  'ぐ': { a: 'が', i: 'ぎ', e: 'げ' },
  'す': { a: 'さ', i: 'し', e: 'せ' },
  'つ': { a: 'た', i: 'ち', e: 'て' },
  'ぬ': { a: 'な', i: 'に', e: 'ね' },
  'ぶ': { a: 'ば', i: 'び', e: 'べ' },
  'む': { a: 'ま', i: 'み', e: 'め' },
  'る': { a: 'ら', i: 'り', e: 'れ' },
};

// [て-form ending, た-form ending] per godan last-kana
const TE_TA_ENDINGS = {
  'う': ['って', 'った'],
  'つ': ['って', 'った'],
  'る': ['って', 'った'],
  'ぬ': ['んで', 'んだ'],
  'ぶ': ['んで', 'んだ'],
  'む': ['んで', 'んだ'],
  'く': ['いて', 'いた'],
  'ぐ': ['いで', 'いだ'],
  'す': ['して', 'した'],
};

// Sound-change exceptions for the て/た forms
const IRREGULAR_TE_TA = {
  '行く': ['行って', '行った'],
};

export const VERB_FORMS = ['masu', 'te', 'nai', 'ta'];

export const FORM_LABELS = {
  masu: 'ます form',
  te: 'て form',
  nai: 'ない form',
  ta: 'た form',
};

export function conjugateVerb(dictionary, group, form) {
  // Group 3 — する / compound する verbs
  if (group === 3 && dictionary.endsWith('する')) {
    const stem = dictionary.slice(0, -2);
    return {
      masu: stem + 'します',
      te: stem + 'して',
      nai: stem + 'しない',
      ta: stem + 'した',
    }[form];
  }

  // Group 2 (ichidan) and 来る behave the same way in writing: drop る, add suffix
  if (group === 2 || dictionary === '来る') {
    const stem = dictionary.slice(0, -1);
    return {
      masu: stem + 'ます',
      te: stem + 'て',
      nai: stem + 'ない',
      ta: stem + 'た',
    }[form];
  }

  // Group 1 — godan
  const lastChar = dictionary.slice(-1);
  const stem = dictionary.slice(0, -1);
  const row = GODAN_ROWS[lastChar];

  if (form === 'masu') return stem + row.i + 'ます';
  if (form === 'nai') return stem + row.a + 'ない';

  if (form === 'te' || form === 'ta') {
    if (IRREGULAR_TE_TA[dictionary]) {
      return form === 'te' ? IRREGULAR_TE_TA[dictionary][0] : IRREGULAR_TE_TA[dictionary][1];
    }
    const [te, ta] = TE_TA_ENDINGS[lastChar];
    return stem + (form === 'te' ? te : ta);
  }
}
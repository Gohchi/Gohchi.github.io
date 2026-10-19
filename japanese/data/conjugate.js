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

const IRREGULAR_TE_TA = {
  '行く': ['行って', '行った'],
  'いく': ['いって', 'いった'],
};

export const VERB_FORMS = ['masu', 'te', 'nai', 'ta'];

export const FORM_LABELS = {
  masu: 'ます form',
  te: 'て form',
  nai: 'ない form',
  ta: 'た form',
};

function conjugateGodan(text, form) {
  const lastChar = text.slice(-1);
  const stem = text.slice(0, -1);
  const row = GODAN_ROWS[lastChar];
  if (!row) return null;

  if (form === 'masu') return stem + row.i + 'ます';
  if (form === 'nai') return stem + row.a + 'ない';

  if (form === 'te' || form === 'ta') {
    if (IRREGULAR_TE_TA[text]) {
      return form === 'te' ? IRREGULAR_TE_TA[text][0] : IRREGULAR_TE_TA[text][1];
    }
    const pair = TE_TA_ENDINGS[lastChar];
    if (!pair) return null;
    return stem + (form === 'te' ? pair[0] : pair[1]);
  }
  return null;
}

function conjugateIchidan(text, form) {
  const stem = text.slice(0, -1);
  return stem + { masu: 'ます', te: 'て', nai: 'ない', ta: 'た' }[form];
}

// Works whether `text` is the kanji dictionary form or the pure-kana reading,
// since the okurigana kana being manipulated is shared by both.
export function conjugateVerb(text, group, form) {
  if (group === 3) {
    if (text.endsWith('する')) {
      const stem = text.slice(0, -2);
      return stem + { masu: 'します', te: 'して', nai: 'しない', ta: 'した' }[form];
    }
    if (text.endsWith('来る')) {
      const stem = text.slice(0, -2);
      return stem + { masu: '来ます', te: '来て', nai: '来ない', ta: '来た' }[form];
    }
    if (text.endsWith('くる')) {
      const stem = text.slice(0, -2);
      return stem + { masu: 'きます', te: 'きて', nai: 'こない', ta: 'きた' }[form];
    }
    return null;
  }

  if (group === 2) return conjugateIchidan(text, form);

  return conjugateGodan(text, form);
}

const FORM_SUFFIX = { masu: 'ます', nai: 'ない', te: 'て', ta: 'た' };

/**
 * Row-based wrong variants for masu/nai: applies the WRONG godan row
 * (a/i/e) before the correct suffix. If the verb ends in a valid godan
 * character (which covers godan verbs AND any ichidan/irregular verb
 * ending in る), this also models the classic "treated it as godan"
 * mistake automatically once the accidental match to the real answer
 * is filtered out.
 */
function rowVariants(text, form) {
  const lastChar = text.slice(-1);
  const stem = text.slice(0, -1);
  const row = GODAN_ROWS[lastChar];
  if (!row) return [];
  const suffix = FORM_SUFFIX[form];
  return [row.a, row.i, row.e].map(r => stem + r + suffix);
}

/**
 * Euphonic-change wrong variants for te/ta: applies a DIFFERENT
 * consonant's sound-change ending, so the result still ends in
 * て/で (or た/だ) but is the wrong one for this verb's ending.
 */
function euphonicVariants(text, form) {
  const stem = text.slice(0, -1);
  const idx = form === 'te' ? 0 : 1;
  return Object.values(TE_TA_ENDINGS).map(pair => stem + pair[idx]);
}

/**
 * Generates plausible-but-WRONG conjugations of the SAME verb (same kanji,
 * same stem), all of which still end with the correct suffix family for
 * the requested form (ます / ない / て・で / た・だ) so they're not
 * trivially identifiable by their ending alone.
 */
export function buildVerbDistractors(verb, form) {
  const text = verb.dictionary;
  const correct = conjugateVerb(text, verb.group, form);
  const suffix = FORM_SUFFIX[form];

  const pool = new Set();
  const add = value => { if (value && value !== correct) pool.add(value); };

  add(text + suffix);                    // naive: suffix glued directly onto dictionary form
  add(text.slice(0, -1) + suffix);       // naive: ichidan-style drop-last-char + suffix

  if (form === 'masu' || form === 'nai') {
    rowVariants(text, form).forEach(add);
  } else {
    euphonicVariants(text, form).forEach(add);
  }

  return [...pool];
}
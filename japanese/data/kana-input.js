// Typing dakuten, handakuten, sokuon and combos the way phone keyboards do it (Gboard, flick keyboards):
// there is no key for ぱ. You press は, a "small / ゛゜" key turns it into ば, and again into ぱ.
// The same for っ (つ, then the key) and for combos (し, then ゆ, then the key to make it ゅ).
//
// So while somebody types a modified kana, the text goes through steps that are NOT the answer yet.
// typedVerdict() tells apart "wrong" from "still on its way to the answer".
//
// Everything here works on hiragana: katakana typed or asked is converted first.

import { DAKUTEN_MAP, HANDAKUTEN_MAP, toHiraganaText } from 'data/kana-romaji.js';

const SMALL_OF = { 'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ' };
const LARGE_OF = { 'や': 'ゃ', 'ゆ': 'ゅ', 'よ': 'ょ' };

// kana that the ゛゜ key cycles between: は ば ぱ / つ っ づ / ゆ ゅ ...
const CYCLE = new Map();
const addCycle = (...members) => members.forEach(member => CYCLE.set(member, members));

for (const [base, voiced] of Object.entries(DAKUTEN_MAP)) {
  if (base.charCodeAt(0) > 0x3096) continue; // hiragana only
  const semi = HANDAKUTEN_MAP[base];
  addCycle(...[base, voiced, semi].filter(Boolean));
}
addCycle('つ', 'っ', 'づ');
for (const [small, large] of Object.entries(SMALL_OF)) addCycle(large, small);
addCycle('あ', 'ぁ');

const isBase = kana => CYCLE.get(kana)?.[0] === kana;

// Kana you can legitimately see on the way to `kana` (hiragana), without being it
const stepsBefore = kana => (isBase(kana) || !CYCLE.has(kana) ? [] : CYCLE.get(kana).filter(other => other !== kana));

// Everything typed on the way to `target` that is not the answer itself (hiragana)
export function pendingStates(target) {
  const chars = [...target];
  const states = new Set();

  if (chars.length === 1) {
    stepsBefore(target).forEach(step => states.add(step));
  } else if (chars.length === 2 && SMALL_OF[chars[1]]) {
    // combo: first kana (maybe still unvoiced), then the large や/ゆ/よ, then the small one
    const firsts = CYCLE.has(chars[0]) && !isBase(chars[0]) ? CYCLE.get(chars[0]) : [chars[0]];
    for (const first of firsts) {
      states.add(first);
      states.add(first + SMALL_OF[chars[1]]);
      if (first !== chars[0]) states.add(first + chars[1]);
    }
  }

  states.delete(target);
  return states;
}

const LATIN = /^[a-zA-Z' ]+$/;

// value: what was typed so far (any script). target: the kana asked (any script).
// -> { verdict: 'correct' | 'pending' | 'wrong', typed }   typed = the kana judged, in hiragana
//   final: the person pressed Enter / Check, so waiting is over
//   same:  (typed, target) => bool, extra homophones that count as correct (listening: を = お)
export function typedVerdict(value, target, { final = false, same = () => false } = {}) {
  const wanted = toHiraganaText(target);
  const text = toHiraganaText(value.trim());
  if (!text) return { verdict: 'pending', typed: '' };

  // desktop IME: "k", "sh" ... are letters on their way to a kana
  if (LATIN.test(text)) return { verdict: final ? 'wrong' : 'pending', typed: text };

  const single = [...wanted].length === 1;
  // one kana asked: only the last typed kana counts (the old behaviour); combos need the whole text
  const typed = single ? [...text].at(-1) : text;

  if (typed === wanted || same(typed, wanted)) return { verdict: 'correct', typed };
  if (!final && pendingStates(wanted).has(typed)) return { verdict: 'pending', typed };
  return { verdict: 'wrong', typed };
}

// What to press, for the hint under the kana (not shown while listening: it would give the kana away)
export function typingHint(target) {
  const wanted = toHiraganaText(target);
  const chars = [...wanted];

  if (chars.length === 2) {
    const small = chars[1];
    return `Type ${chars[0]}, then ${SMALL_OF[small]}, then the small key to make it ${small}.`;
  }
  if (wanted === 'っ') return 'Type つ, then the small key to make it っ.';
  const steps = stepsBefore(wanted);
  if (steps.length) return `Type ${steps[0]}, then the ゛゜ key until it becomes ${wanted}.`;
  return '';
}

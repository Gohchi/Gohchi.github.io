// Compact wire format for the progress doc (what goes to Firestore).
// localStorage keeps the readable format; only sync.js uses this file.
//
// Local (readable):
//   { verbs: { '座る:nai': { correct: 1, wrong: 0, memory: 1, first: '2026-10-21', last: '2026-10-21' } } }
//
// Wire (no kana / kanji at all):
//   { v: 3, d: { verbs: { 'k3f9a0zq:nai': 'c:1|w:0|m:1|f:20261021|l:20261021' } } }
//
// Every word / kanji / verb / adjective is replaced by an 8-character id: a hash of the word.
//  - ENCODING needs no map: the id comes straight from the word.
//  - DECODING needs id -> word. That map is built at runtime from the app's own data
//    (kana, words, verbs, adjectives), so there is no list to maintain: add a word to the data
//    and it syncs.
//  - ids the app doesn't know (a word removed from the data, or added on a newer device) are
//    skipped when reading. A newer device sends them again from its own storage on its next sync.
//
// Keys look like "<word>" or "<word>:<suffix>" (verbs: "座る:nai"). Only the word is replaced;
// the suffix is plain ASCII and stays readable.
//
// !! hashId() must never change: every stored id depends on it. !!
//
// Output is deterministic (sorted), so the same data always produces the same JSON.

const FIELDS = { c: 'correct', w: 'wrong', m: 'memory', f: 'first', l: 'last' };

// ---------------------------------------------------------------------------
// ids
// ---------------------------------------------------------------------------

// cyrb53: small, fast 53-bit string hash
function cyrb53(text) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// 36^8 ≈ 2.8e12 possible ids: with ~2000 words the chance of any collision is below 1 in a million
const hashId = word => (cyrb53(word) % 36 ** 8).toString(36).padStart(8, '0');

// "座る:nai" -> ['座る', ':nai'] | "あ" -> ['あ', '']
function splitKey(key) {
  const index = key.lastIndexOf(':');
  return index > 0 ? [key.slice(0, index), key.slice(index)] : [key, ''];
}

// id -> word, built once from the app's data (loaded lazily: only when something is synced)
let reverseMap = null;

function getReverseMap() {
  if (!reverseMap) {
    reverseMap = (async () => {
      const [{ default: words }, { default: verbs }, { default: adjectives }, { hiragana, katakana }] = await Promise.all([
        import('./words.js'),
        import('./verbs.js'),
        import('./adjectives.js'),
        import('./kana-romaji.js'),
      ]);

      const known = [
        ...Object.keys(hiragana),
        ...Object.keys(katakana),
        ...words.map(({ word }) => word),
        ...verbs.map(({ dictionary }) => dictionary),
        ...adjectives.map(({ dictionary }) => dictionary),
      ];

      const map = new Map();
      for (const word of known) {
        const id = hashId(word);
        if (map.has(id) && map.get(id) !== word) {
          console.warn('[sync] id collision:', map.get(id), 'and', word);
        }
        map.set(id, word);
      }
      return map;
    })();
    reverseMap.catch(() => { reverseMap = null; }); // allow a retry
  }
  return reverseMap;
}

// ---------------------------------------------------------------------------
// entries
// ---------------------------------------------------------------------------

const packDate = date => String(date).replaceAll('-', ''); // 2026-10-21 -> 20261021
const unpackDate = text => (/^\d{8}$/.test(text) ? `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}` : text);

function packEntry(entry) {
  const parts = [`c:${entry.correct || 0}`, `w:${entry.wrong || 0}`, `m:${entry.memory || 0}`];
  if (entry.first) parts.push(`f:${packDate(entry.first)}`);
  if (entry.last) parts.push(`l:${packDate(entry.last)}`);
  return parts.join('|');
}

function unpackEntry(text) {
  const entry = { correct: 0, wrong: 0, memory: 0 };
  for (const part of String(text).split('|')) {
    const [tag, value] = part.split(':');
    const field = FIELDS[tag];
    if (!field) continue;
    entry[field] = tag === 'f' || tag === 'l' ? unpackDate(value) : Number(value) || 0;
  }
  return entry;
}

// ---------------------------------------------------------------------------
// encode / decode
// ---------------------------------------------------------------------------

export function encodeProgress(progress) {
  if (!progress) return progress;

  const seen = new Map();
  const data = {};

  for (const category of Object.keys(progress).sort()) {
    const bucket = progress[category] || {};
    data[category] = {};
    for (const key of Object.keys(bucket).sort()) {
      const [word, suffix] = splitKey(key);
      const id = hashId(word);
      if (seen.has(id) && seen.get(id) !== word) {
        console.warn('[sync] id collision:', seen.get(id), 'and', word);
      }
      seen.set(id, word);
      data[category][id + suffix] = packEntry(bucket[key]);
    }
  }

  return { v: 3, d: data };
}

// v2 (the previous format): the words travelled in a key table `k`. Only read, never written.
function decodeV2(stored) {
  const result = {};
  for (const [category, bucket] of Object.entries(stored.d || {})) {
    result[category] = {};
    for (const [ref, text] of Object.entries(bucket)) {
      const match = ref.match(/^([0-9a-z]+)(:.*)?$/);
      const word = match && stored.k[parseInt(match[1], 36)];
      if (word == null) continue;
      result[category][word + (match[2] || '')] = unpackEntry(text);
    }
  }
  return result;
}

// Reads v3, v2 and the original raw format (no `v`).
export async function decodeProgress(stored) {
  if (!stored) return stored;
  if (stored.v === 2) return decodeV2(stored);
  if (stored.v !== 3) return stored;

  const reverse = await getReverseMap();
  const result = {};

  for (const [category, bucket] of Object.entries(stored.d || {})) {
    result[category] = {};
    for (const [ref, text] of Object.entries(bucket)) {
      const index = ref.indexOf(':');
      const word = reverse.get(index === -1 ? ref : ref.slice(0, index));
      if (word == null) continue; // unknown here, see the header comment
      result[category][word + (index === -1 ? '' : ref.slice(index))] = unpackEntry(text);
    }
  }
  return result;
}
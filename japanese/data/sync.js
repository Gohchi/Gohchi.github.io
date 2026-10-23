// Keeps localStorage (source of truth, works offline) and Firestore in sync.
//
//  - On sign in / page load with a session: pull each doc, merge, write back where needed.
//  - While signed in: every local save calls markDirty(name) -> debounced push.
//  - Edits made offline (or signed out) are remembered in `jp-sync-pending`
//    and pushed on the next chance.
//
// To sync a new kind of data: add one entry to DOCS and call markDirty('<name>')
// from its save function.

import { readDoc, writeDoc } from './firebase.js';

const LINK_KEY = 'jp-sync-linked'; // uid this browser was last synced with
const PENDING_KEY = 'jp-sync-pending'; // doc names with local changes not pushed yet
const PUSH_DELAY = 2000;

// ---------------------------------------------------------------------------
// Merge rules
// ---------------------------------------------------------------------------

const answers = entry => (entry?.correct || 0) + (entry?.wrong || 0);

// Per item, keep the side with more answers (idempotent, never double counts).
function mergeProgress(local = {}, remote = {}) {
  const result = {};
  for (const category of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const a = local[category] || {};
    const b = remote[category] || {};
    const bucket = {};
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const x = a[key];
      const y = b[key];
      const winner = !x ? y : !y ? x : (answers(y) > answers(x) ? y : x);
      const firsts = [x?.first, y?.first].filter(Boolean).sort();
      const lasts = [x?.last, y?.last].filter(Boolean).sort();
      bucket[key] = {
        ...winner,
        ...(firsts.length && { first: firsts[0] }),
        ...(lasts.length && { last: lasts[lasts.length - 1] }),
      };
    }
    result[category] = bucket;
  }
  return result;
}

// Earliest start date; per day keep the side with more answers.
function mergeActivity(local = {}, remote = {}) {
  const starts = [local.startedAt, remote.startedAt].filter(Boolean).sort();
  const days = { ...(remote.days || {}) };
  for (const [date, day] of Object.entries(local.days || {})) {
    if (!days[date] || (day.answers || 0) > (days[date].answers || 0)) days[date] = day;
  }
  return { startedAt: starts[0] || null, days };
}

const mergeProfile = (local, remote) =>
  (remote.updatedAt || '') >= (local.updatedAt || '') ? remote : local;

const union = (local = [], remote = []) => [...new Set([...local, ...remote])];

// `replace: true` docs are lists / settings where deletions must propagate:
// after the first link, the remote copy wins unless this browser has pending edits.
// `merge` is used for the first link, and always for progress / activity.
const DOCS = {
  progress: { key: 'jp-practice-progress', merge: mergeProgress },
  activity: { key: 'jp-practice-activity', merge: mergeActivity },
  profile: {
    key: 'jp-profile',
    replace: true,
    merge: mergeProfile,
    after: profile => { // the Translations section reads its language from this key
      if (profile?.translationLang) localStorage.setItem('lang', profile.translationLang);
    },
  },
  favorites: { key: 'jp-common-phrases-favorites', replace: true, merge: union },
  roadmap: { key: 'jp-roadmap-progress', replace: true, merge: union },
};

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const readLocal = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const writeLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / privacy-mode errors
  }
};

const getPending = () => new Set(readLocal(PENDING_KEY) || []);
const setPending = set => writeLocal(PENDING_KEY, [...set]);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

let uid = null;
const timers = {};

export async function startSync(user) {
  uid = user.uid;

  const linked = localStorage.getItem(LINK_KEY) === uid;
  const pending = getPending();
  let changedLocal = false;

  for (const [name, doc] of Object.entries(DOCS)) {
    const local = readLocal(doc.key);
    const remote = await readDoc(uid, name);

    let result;
    if (remote == null) result = local;
    else if (local == null) result = remote;
    else if (!doc.replace) result = doc.merge(local, remote);
    else if (pending.has(name)) result = local;
    else if (linked) result = remote;
    else result = doc.merge(local, remote);

    if (result == null) continue;

    if (!same(result, local)) {
      writeLocal(doc.key, result);
      doc.after?.(result);
      changedLocal = true;
    }
    if (!same(result, remote)) await writeDoc(uid, name, result);
    pending.delete(name);
  }

  setPending(pending);
  localStorage.setItem(LINK_KEY, uid);

  // views read localStorage when they mount; the ones already on screen can listen to this
  if (changedLocal) window.dispatchEvent(new CustomEvent('jp-sync-applied'));
}

export function stopSync() {
  uid = null;
  Object.values(timers).forEach(clearTimeout);
}

// Call after every local save of a synced doc.
export function markDirty(name) {
  if (!DOCS[name]) return;
  const pending = getPending();
  pending.add(name);
  setPending(pending);
  schedulePush(name);
}

function schedulePush(name) {
  if (!uid) return;
  clearTimeout(timers[name]);
  timers[name] = setTimeout(() => push(name), PUSH_DELAY);
}

async function push(name) {
  if (!uid) return;
  try {
    await writeDoc(uid, name, readLocal(DOCS[name].key));
    const pending = getPending();
    pending.delete(name);
    setPending(pending);
  } catch (error) {
    console.warn('[sync] push failed, will retry when online:', name, error);
  }
}

// Push everything waiting (used right before signing out).
export async function flushSync() {
  Object.values(timers).forEach(clearTimeout);
  await Promise.all([...getPending()].map(push));
}

window.addEventListener('online', () => {
  if (uid) getPending().forEach(schedulePush);
});
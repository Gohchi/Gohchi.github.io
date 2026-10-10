const STORAGE_KEY = 'jp-practice-progress';
const ACTIVITY_KEY = 'jp-practice-activity';
export const MAX_MEMORY = 5;

// ---------------------------------------------------------------------------
// Dates (local time, 'YYYY-MM-DD')
// ---------------------------------------------------------------------------

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(key, amount) {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d + amount));
}

// ---------------------------------------------------------------------------
// Per-item progress (same shape as before + optional `first` / `last` dates)
// ---------------------------------------------------------------------------

function loadAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed && typeof parsed === 'object' ? parsed : { kana: {}, verbs: {} };
  } catch (e) {
    return { kana: {}, verbs: {} };
  }
}

function saveAll(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
}

export function getEntry(category, key) {
  const all = loadAll();
  return all[category]?.[key] || { correct: 0, wrong: 0, memory: 0 };
}

export function recordAnswer(category, key, isCorrect) {
  const all = loadAll();
  if (!all[category]) all[category] = {};
  const entry = all[category][key] || { correct: 0, wrong: 0, memory: 0 };
  const today = dateKey();

  if (isCorrect) {
    entry.correct++;
    entry.memory = Math.min(MAX_MEMORY, entry.memory + 1);
  } else {
    entry.wrong++;
    entry.memory = Math.max(0, entry.memory - 1);
  }

  if (!entry.first) entry.first = today;
  entry.last = today;

  all[category][key] = entry;
  saveAll(all);
  logActivity(isCorrect);
  return entry;
}

export function getStats(category, keys) {
  const all = loadAll();
  const bucket = all[category] || {};
  const entries = keys.map(key => bucket[key] || { correct: 0, wrong: 0, memory: 0 });

  const mastered = entries.filter(e => e.memory >= MAX_MEMORY).length;
  const totalCorrect = entries.reduce((sum, e) => sum + e.correct, 0);
  const totalWrong = entries.reduce((sum, e) => sum + e.wrong, 0);

  return { total: keys.length, mastered, totalCorrect, totalWrong };
}

export function resetProgress(category) {
  const all = loadAll();
  all[category] = {};
  saveAll(all);
}

// Picks an item, favoring ones with lower memory (needs more practice)
// without fully excluding well-known ones.
export function weightedPick(category, list, getKey) {
  if (!list.length) return null;
  const weights = list.map(item => (MAX_MEMORY + 1) - getEntry(category, getKey(item)).memory);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < list.length; i++) {
    r -= weights[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1];
}

// ---------------------------------------------------------------------------
// Read helpers for the Progress page
// ---------------------------------------------------------------------------

// [[key, { correct, wrong, memory, first?, last? }], ...]
export function getCategoryEntries(category) {
  return Object.entries(loadAll()[category] || {});
}

// ---------------------------------------------------------------------------
// Daily activity (start date + streak)
// ---------------------------------------------------------------------------

function loadActivity() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACTIVITY_KEY));
    if (parsed && typeof parsed === 'object') {
      return { startedAt: parsed.startedAt || null, days: parsed.days || {} };
    }
  } catch (e) {
    // fall through
  }
  return { startedAt: null, days: {} };
}

function saveActivity(data) {
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
}

function logActivity(isCorrect) {
  const activity = loadActivity();
  const today = dateKey();

  if (!activity.startedAt) activity.startedAt = today;

  const day = activity.days[today] || { answers: 0, correct: 0 };
  day.answers++;
  if (isCorrect) day.correct++;
  activity.days[today] = day;

  saveActivity(activity);
}

export function getActivity() {
  return loadActivity();
}

export function getStreak() {
  const { days } = loadActivity();
  const keys = Object.keys(days).sort();
  if (!keys.length) return { current: 0, longest: 0, lastActive: null };

  let longest = 0;
  let run = 0;
  let previous = null;
  for (const key of keys) {
    run = previous && addDays(previous, 1) === key ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = key;
  }

  // The streak is still alive if the last practice was today or yesterday.
  const today = dateKey();
  let cursor = days[today] ? today : addDays(today, -1);
  let current = 0;
  while (days[cursor]) {
    current++;
    cursor = addDays(cursor, -1);
  }

  return { current, longest, lastActive: keys[keys.length - 1] };
}

export function resetActivity() {
  saveActivity({ startedAt: null, days: {} });
}
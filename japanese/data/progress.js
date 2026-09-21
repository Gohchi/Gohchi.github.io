const STORAGE_KEY = 'jp-practice-progress';
export const MAX_MEMORY = 5;

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

  if (isCorrect) {
    entry.correct++;
    entry.memory = Math.min(MAX_MEMORY, entry.memory + 1);
  } else {
    entry.wrong++;
    entry.memory = Math.max(0, entry.memory - 1);
  }

  all[category][key] = entry;
  saveAll(all);
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
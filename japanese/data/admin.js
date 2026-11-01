// Admin helpers: who is the admin + turns the raw Firestore docs into one summary row per user.

export const ADMIN_EMAIL = 'martin.akg1991@gmail.com';

export const isAdminUser = user =>
  !!user?.email && user.email.toLowerCase() === ADMIN_EMAIL;

// ---------------------------------------------------------------------------
// progress doc: reads v3 / v2 (packed strings) and the original raw format
// ---------------------------------------------------------------------------

const FIELDS = { c: 'correct', w: 'wrong', m: 'memory', f: 'first', l: 'last' };
const MAX_MEMORY = 5;

const unpackDate = text =>
  (/^\d{8}$/.test(text) ? `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}` : text);

function unpackEntry(entry) {
  if (entry && typeof entry === 'object') return entry;
  const result = { correct: 0, wrong: 0, memory: 0 };
  for (const part of String(entry).split('|')) {
    const index = part.indexOf(':');
    const field = FIELDS[part.slice(0, index)];
    if (!field) continue;
    const value = part.slice(index + 1);
    result[field] = field === 'first' || field === 'last' ? unpackDate(value) : Number(value) || 0;
  }
  return result;
}

function summarizeProgress(value) {
  const summary = { answers: 0, correct: 0, practiced: 0, mastered: 0 };
  if (!value || typeof value !== 'object') return summary;

  const buckets = value.v ? value.d : value;
  for (const bucket of Object.values(buckets || {})) {
    for (const raw of Object.values(bucket || {})) {
      const entry = unpackEntry(raw);
      const answers = entry.correct + entry.wrong;
      if (!answers) continue;
      summary.practiced++;
      summary.answers += answers;
      summary.correct += entry.correct;
      if (entry.memory >= MAX_MEMORY) summary.mastered++;
    }
  }
  return summary;
}

// ---------------------------------------------------------------------------
// rows -> one summary per user
// ---------------------------------------------------------------------------

// rows: [{ userId, name, value, updatedAt }] (see readAllData in data/firebase.js)
export function summarizeUsers(rows) {
  const byUser = new Map();
  for (const row of rows) {
    if (!byUser.has(row.userId)) byUser.set(row.userId, []);
    byUser.get(row.userId).push(row);
  }

  return [...byUser.entries()].map(([uid, docs]) => {
    const get = name => docs.find(doc => doc.name === name)?.value ?? null;

    // newest format first, older ones only if the newer doc doesn't exist yet
    const progress = get('progress3') ?? get('progress2') ?? get('progress');
    const activity = get('activity') || {};
    const profile = get('profile') || {};
    const favorites = get('favorites') || [];
    const roadmap = get('roadmap') || [];

    const days = activity.days || {};
    const dayKeys = Object.keys(days).sort();
    const stats = summarizeProgress(progress);
    const updated = docs.map(doc => doc.updatedAt).filter(Boolean).sort((a, b) => b - a)[0] || null;

    return {
      uid,
      displayName: profile.displayName || '',
      avatar: profile.avatar || '',
      targetLevel: profile.targetLevel || '',
      dailyGoal: profile.dailyGoal ?? null,
      startedAt: activity.startedAt || dayKeys[0] || null,
      lastActive: dayKeys[dayKeys.length - 1] || null,
      daysPracticed: dayKeys.length,
      answers: stats.answers,
      accuracy: stats.answers ? Math.round((stats.correct / stats.answers) * 100) : null,
      practiced: stats.practiced,
      mastered: stats.mastered,
      favorites: Array.isArray(favorites) ? favorites.length : 0,
      roadmapDone: Array.isArray(roadmap) ? roadmap.length : 0,
      updatedAt: updated,
      docs: Object.fromEntries(docs.map(doc => [doc.name, doc.value])),
    };
  });
}
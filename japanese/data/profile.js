const STORAGE_KEY = 'jp-profile';

export const AVATARS = ['🍣', '🍙', '🍜', '🍡', '🐱', '🦊', '🐼', '🐉', '🌸', '⛩️', '🗻', '🎮'];
export const TARGET_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
export const TRANSLATION_LANGS = [
  { key: 'eng', label: 'English' },
  { key: 'esp', label: 'Español' },
];

export const DISPLAY_NAME_MAX = 30;
export const DAILY_GOAL_MIN = 1;
export const DAILY_GOAL_MAX = 500;

function defaults() {
  let lang = 'eng';
  try {
    lang = localStorage.getItem('lang') || 'eng';
  } catch (e) {
    // ignore privacy-mode errors
  }

  return {
    displayName: '',
    avatar: AVATARS[0],
    targetLevel: 'N5',
    dailyGoal: 20,
    translationLang: lang,
    createdAt: null,
    updatedAt: null,
  };
}

// Always returns a valid profile, whatever comes in (old data, tampered storage, remote data).
export function sanitizeProfile(input = {}) {
  const base = defaults();
  const goal = Math.round(Number(input.dailyGoal));

  return {
    displayName: String(input.displayName ?? '').trim().slice(0, DISPLAY_NAME_MAX),
    avatar: AVATARS.includes(input.avatar) ? input.avatar : base.avatar,
    targetLevel: TARGET_LEVELS.includes(input.targetLevel) ? input.targetLevel : base.targetLevel,
    dailyGoal: Number.isFinite(goal)
      ? Math.min(DAILY_GOAL_MAX, Math.max(DAILY_GOAL_MIN, goal))
      : base.dailyGoal,
    translationLang: TRANSLATION_LANGS.some(l => l.key === input.translationLang)
      ? input.translationLang
      : base.translationLang,
    createdAt: input.createdAt || null,
    updatedAt: input.updatedAt || null,
  };
}

export function loadProfile() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed === 'object') return sanitizeProfile(parsed);
  } catch (e) {
    // fall through
  }
  return sanitizeProfile(defaults());
}

export function saveProfile(profile) {
  const now = new Date().toISOString();
  const clean = sanitizeProfile(profile);
  clean.createdAt = profile.createdAt || now;
  clean.updatedAt = now;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    // The Translations section reads its language from this key.
    localStorage.setItem('lang', clean.translationLang);
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
  return clean;
}

export function resetProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  return loadProfile();
}
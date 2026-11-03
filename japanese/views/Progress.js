import MainHeader from 'components/MainHeader.js';
import template from 'templates/Progress.js';

import { hiragana, katakana } from 'data/kana-romaji.js';
import wordsData from 'data/words.js';
import verbsData from 'data/verbs.js';
import adjectivesData from 'data/adjectives.js';
import phrases from 'data/phrases.js';
import roadmap from 'data/roadmap.js';
import { VERB_FORMS } from 'data/conjugate.js';
import { getFavorites } from 'data/favorites.js';
import { getSnapshot, pendingSummary, totalXp } from 'data/progression.js';
import { getCompleted } from 'data/roadmap-progress.js';
import {
  MAX_MEMORY,
  dateKey,
  addDays,
  getCategoryEntries,
  getActivity,
  getStreak,
  resetProgress,
  resetActivity,
} from 'data/progress.js';

const HEATMAP_DAYS = 35;

// One row per progress category used by the practice views.
// `total` = how many items exist (to show "practiced X of Y").
const CATEGORIES = [
  { id: 'kana-hiragana', group: 'Kana', label: 'Hiragana characters', route: '/hiragana-practice', total: Object.keys(hiragana).length },
  { id: 'kana-katakana', group: 'Kana', label: 'Katakana characters', route: '/katakana-practice', total: Object.keys(katakana).length },
  { id: 'kana-hiragana-listen', group: 'Kana', label: 'Hiragana listening', route: '/hiragana-listen', total: Object.keys(hiragana).length },
  { id: 'kana-katakana-listen', group: 'Kana', label: 'Katakana listening', route: '/katakana-listen', total: Object.keys(katakana).length },
  { id: 'words-hiragana', group: 'Words', label: 'Hiragana words', route: '/hiragana-words', total: wordsData.filter(w => w.type === 'hiragana').length },
  { id: 'words-hiragana-meaning', group: 'Words', label: 'Hiragana words: meaning', route: '/hiragana-words', total: wordsData.filter(w => w.type === 'hiragana').length },
  { id: 'words-katakana', group: 'Words', label: 'Katakana words', route: '/katakana-words', total: wordsData.filter(w => w.type === 'katakana').length },
  { id: 'words-katakana-meaning', group: 'Words', label: 'Katakana words: meaning', route: '/katakana-words', total: wordsData.filter(w => w.type === 'katakana').length },
  { id: 'words-kanji', group: 'Kanji', label: 'Kanji: reading', route: '/kanji-reading', total: wordsData.filter(w => w.type === 'kanji').length },
  { id: 'words-kanji-meaning', group: 'Kanji', label: 'Kanji: meaning', route: '/kanji-meaning', total: wordsData.filter(w => w.type === 'kanji').length },
  { id: 'verbs', group: 'Grammar', label: 'Verb conjugation', route: '/verbs-practice', total: verbsData.length * VERB_FORMS.length },
  { id: 'adjectives', group: 'Grammar', label: 'Adjectives', route: '/adjectives-practice', total: adjectivesData.length },
];

function summarize(category) {
  const entries = getCategoryEntries(category.id).filter(([, e]) => e.correct + e.wrong > 0);
  const correct = entries.reduce((sum, [, e]) => sum + e.correct, 0);
  const wrong = entries.reduce((sum, [, e]) => sum + e.wrong, 0);
  const firsts = entries.map(([, e]) => e.first).filter(Boolean).sort();
  const lasts = entries.map(([, e]) => e.last).filter(Boolean).sort();

  return {
    ...category,
    practiced: entries.length,
    mastered: entries.filter(([, e]) => e.memory >= MAX_MEMORY).length,
    correct,
    wrong,
    accuracy: correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : null,
    first: firsts[0] || null,
    last: lasts[lasts.length - 1] || null,
  };
}

// Sunday first, like Japanese calendars
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CALENDAR_MONTHS = 3;

const level = answers => (answers >= 60 ? 4 : answers >= 30 ? 3 : answers >= 10 ? 2 : answers >= 1 ? 1 : 0);

// The current month and the two before it, newest first.
// cells: one per day, `null` pads the first week so every day sits under its weekday.
function buildCalendar(days) {
  const todayKey = dateKey();
  const now = new Date();

  return Array.from({ length: CALENDAR_MONTHS }, (_, back) => {
    const first = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();

    const cells = Array(first.getDay()).fill(null);
    let activeDays = 0;
    let answersTotal = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = dateKey(new Date(first.getFullYear(), first.getMonth(), day));
      const answers = days[date]?.answers || 0;
      if (answers) activeDays++;
      answersTotal += answers;
      cells.push({
        date,
        day,
        answers,
        level: level(answers),
        today: date === todayKey,
        future: date > todayKey, // keys are YYYY-MM-DD: they sort as dates
      });
    }

    return {
      key: dateKey(first).slice(0, 7),
      jp: `${first.getMonth() + 1}月`,
      title: first.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      cells,
      activeDays,
      answers: answersTotal,
    };
  });
}

function build() {
  const activity = getActivity();
  const summaries = CATEGORIES.map(summarize);

  const totalCorrect = summaries.reduce((sum, c) => sum + c.correct, 0);
  const totalWrong = summaries.reduce((sum, c) => sum + c.wrong, 0);

  const snapshot = getSnapshot();
  const roadmapSteps = roadmap.flatMap(stage => stage.steps);
  const completed = getCompleted();

  return {
    levels: Object.values(snapshot.categories),
    xpTotal: totalXp(snapshot),
    pending: pendingSummary(wordsData),
    startedAt: activity.startedAt,
    daysPracticed: Object.keys(activity.days).length,
    streak: getStreak(),
    calendar: buildCalendar(activity.days),
    summaries,
    totalAnswers: totalCorrect + totalWrong,
    totalAccuracy: totalCorrect + totalWrong ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : null,
    totalMastered: summaries.reduce((sum, c) => sum + c.mastered, 0),
    favorites: getFavorites().length,
    phrasesTotal: Object.keys(phrases).length,
    roadmapDone: roadmapSteps.filter(step => completed.includes(step.id)).length,
    roadmapTotal: roadmapSteps.length,
  };
}

export default {
  components: {
    MainHeader,
  },
  data() {
    return {
      MAX_MEMORY,
      WEEKDAYS,
      WEEKDAY_NAMES,
      open: {}, // category id -> item list expanded
      ...build(),
    };
  },
  computed: {
    // something is still closed (sections, kanji groups or words)
    hasPending() {
      const { sections, kanji, words } = this.pending;
      return Boolean(sections.length || kanji.next || words.locked);
    },
    groups() {
      const groups = [];
      for (const summary of this.summaries) {
        let group = groups.find(g => g.name === summary.group);
        if (!group) {
          group = { name: summary.group, items: [] };
          groups.push(group);
        }
        group.items.push(summary);
      }
      return groups;
    },
  },
  methods: {
    formatXp(n) {
      return Math.round(n).toLocaleString('en-US');
    },
    formatDate(key) {
      if (!key) return '—';
      const today = dateKey();
      if (key === today) return 'today';
      if (key === addDays(today, -1)) return 'yesterday';
      return key;
    },
    toggleOpen(id) {
      this.open = { ...this.open, [id]: !this.open[id] };
    },
    // Weakest first, so the top of the list is what needs more practice.
    itemsFor(id) {
      return getCategoryEntries(id)
        .filter(([, e]) => e.correct + e.wrong > 0)
        .map(([key, e]) => ({ key, ...e }))
        .sort((a, b) => a.memory - b.memory || b.wrong - a.wrong);
    },
    resetAll() {
      if (!confirm('Reset ALL progress, dates and streak? This cannot be undone.')) return;
      CATEGORIES.forEach(({ id }) => resetProgress(id));
      resetActivity();
      Object.assign(this, build());
    },
  },
  template,
};
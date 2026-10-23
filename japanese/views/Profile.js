import MainHeader from 'components/MainHeader.js';
import template from 'templates/Profile.js';

import { profileStore } from 'store';
import {
  AVATARS,
  TARGET_LEVELS,
  TRANSLATION_LANGS,
  DISPLAY_NAME_MAX,
  DAILY_GOAL_MIN,
  DAILY_GOAL_MAX,
} from 'data/profile.js';
import { dateKey, getActivity, getStreak } from 'data/progress.js';

const EDITABLE = ['displayName', 'avatar', 'targetLevel', 'dailyGoal', 'translationLang'];

export default {
  components: {
    MainHeader,
  },
  data() {
    const activity = getActivity();

    return {
      profileStore,
      AVATARS,
      TARGET_LEVELS,
      TRANSLATION_LANGS,
      DISPLAY_NAME_MAX,
      DAILY_GOAL_MIN,
      DAILY_GOAL_MAX,

      form: { ...profileStore.profile }, // edited copy, only saved on "Save"
      saved: false,
      saveTimer: null,

      startedAt: activity.startedAt,
      todayAnswers: activity.days[dateKey()]?.answers || 0,
      streak: getStreak(),
    };
  },
  computed: {
    dirty() {
      const saved = profileStore.profile;
      return EDITABLE.some(key => this.form[key] !== saved[key]);
    },
    shownName() {
      return this.form.displayName.trim() || 'Learner';
    },
    goalPercent() {
      const goal = Number(profileStore.profile.dailyGoal) || 1;
      return Math.min(100, Math.round((this.todayAnswers / goal) * 100));
    },
    avatarUrl() {
      return profileStore.user?.photoURL || '';
    },
    memberSince() {
      const created = profileStore.profile.createdAt;
      return created ? created.slice(0, 10) : null;
    },
  },
  watch: {
    // the profile can change under the form (sign in -> synced from another device)
    'profileStore.profile'(next, previous) {
      const untouched = EDITABLE.every(key => this.form[key] === previous[key]);
      if (untouched) this.form = { ...next };
    },
  },
  methods: {
    async save() {
      await profileStore.save(this.form);
      this.form = { ...profileStore.profile }; // show what was actually stored (sanitized)
      this.saved = true;
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => { this.saved = false; }, 2000);
    },
    discard() {
      this.form = { ...profileStore.profile };
    },
    async resetProfile() {
      if (!confirm('Reset your profile to the defaults? Your practice progress is not affected.')) return;
      await profileStore.reset();
      this.form = { ...profileStore.profile };
    },
    // progress may have been merged from the cloud after this view mounted
    refreshStats() {
      const activity = getActivity();
      this.startedAt = activity.startedAt;
      this.todayAnswers = activity.days[dateKey()]?.answers || 0;
      this.streak = getStreak();
    },
  },
  mounted() {
    window.addEventListener('jp-sync-applied', this.refreshStats);
  },
  beforeUnmount() {
    clearTimeout(this.saveTimer);
    window.removeEventListener('jp-sync-applied', this.refreshStats);
  },
  template,
};
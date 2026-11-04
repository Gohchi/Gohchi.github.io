import MainHeader from 'components/MainHeader.js';
import template from 'templates/Admin.js';

import { profileStore } from 'store';
import { readAllData } from 'data/firebase.js';
import { summarizeUsers } from 'data/admin.js';

const SORTS = [
  { key: 'lastActive', label: 'Last active' },
  { key: 'answers', label: 'Answers' },
  { key: 'daysPracticed', label: 'Days practiced' },
  { key: 'mastered', label: 'Mastered' },
];

const normalize = text => String(text ?? '').toLowerCase();

export default {
  components: {
    MainHeader,
  },
  data() {
    return {
      profileStore,
      sorts: SORTS,
      sort: 'lastActive',
      query: '',
      rows: [],
      loading: false,
      error: '',
      loadedAt: null,
      open: {}, // uid -> raw JSON expanded
    };
  },
  computed: {
    users() {
      return summarizeUsers(this.rows);
    },
    visibleUsers() {
      const terms = normalize(this.query).split(/\s+/).filter(Boolean);
      const key = this.sort;

      return this.users
        .filter(user => {
          const haystack = normalize(`${user.uid} ${user.displayName} ${user.targetLevel}`);
          return terms.every(term => haystack.includes(term));
        })
        .sort((a, b) => {
          if (key === 'lastActive') return (b.lastActive || '').localeCompare(a.lastActive || '');
          return (b[key] || 0) - (a[key] || 0);
        });
    },
    totals() {
      const users = this.users;
      return {
        users: users.length,
        answers: users.reduce((sum, user) => sum + user.answers, 0),
        mastered: users.reduce((sum, user) => sum + user.mastered, 0),
        docs: this.rows.length,
      };
    },
  },
  watch: {
    // the session is restored asynchronously: load as soon as the admin is known
    'profileStore.isAdmin': {
      immediate: true,
      handler(isAdmin) {
        if (isAdmin) this.load();
      },
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = '';
      try {
        this.rows = await readAllData();
        this.loadedAt = new Date();
      } catch (error) {
        console.error('[admin] could not read the data', error);
        this.error = error?.code === 'permission-denied'
          ? 'Firestore refused the query. Check the security rules.'
          : 'Could not load the data. Are you offline?';
      } finally {
        this.loading = false;
      }
    },
    toggleOpen(uid) {
      this.open = { ...this.open, [uid]: !this.open[uid] };
    },
    shortUid(uid) {
      return uid.length > 10 ? uid.slice(0, 6) + '…' + uid.slice(-3) : uid;
    },
    formatDate(date) {
      if (!date) return '—';
            
      if (date instanceof Date) {
        const pad = num => String(num).padStart(2, '0');

        const yyyy = date.getFullYear();
        const mm = pad(date.getMonth() + 1); // Months are 0-indexed
        const dd = pad(date.getDate());
        const hh = pad(date.getHours());
        const min = pad(date.getMinutes());

        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
      }
      
      return date;
    },
    prettyJson(value) {
      return JSON.stringify(value, null, 2);
    },
  },
  template,
};
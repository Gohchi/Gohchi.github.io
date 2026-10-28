import MainHeader from 'components/MainHeader.js';
import { loadSelection, saveSelection } from 'components/FilterMenu.js';
import template from 'templates/Settings.js';

import { POOLS, getPool, getExcluded, saveExcluded } from 'data/pools.js';
import { MAX_MEMORY } from 'data/progress.js';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const LEVELS_KEY = 'settings-pools-levels';
const PAGE_SIZE = 100;

const STATUS_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'on', label: 'In pool' },
  { key: 'off', label: 'Excluded' },
];
const MEMORY_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'learning', label: 'Learning' },
  { key: 'mastered', label: 'Mastered' },
];

const normalize = text => String(text ?? '').toLowerCase();

// Frozen on purpose: Vue skips frozen objects, so ~600 rows are not made reactive.
function buildRows() {
  const rows = POOLS.flatMap(pool => pool.getItems().map(item => Object.freeze({
    ...item,
    poolId: pool.id,
    rowKey: pool.id + ':' + item.key,
  })));
  return Object.freeze(rows);
}

function loadExcluded() {
  return Object.fromEntries(POOLS.map(pool => [pool.id, getExcluded(pool)]));
}

export default {
  components: {
    MainHeader,
  },
  data() {
    return {
      MAX_MEMORY,
      PAGE_SIZE,
      levels: LEVELS,
      statusOptions: STATUS_OPTIONS,
      memoryOptions: MEMORY_OPTIONS,
      poolLabels: Object.fromEntries(POOLS.map(({ id, label }) => [id, label])),

      rows: buildRows(),
      excluded: loadExcluded(), // { poolId: [key, ...] } words turned OFF

      pool: 'all', // 'all' | pool id
      query: '',
      selectedLevels: loadSelection(LEVELS_KEY, []).filter(level => LEVELS.includes(level)), // none = every level
      status: 'all',
      memory: 'all',
      facet: 'all',
      limit: PAGE_SIZE,
    };
  },
  computed: {
    excludedSets() {
      return Object.fromEntries(
        Object.entries(this.excluded).map(([id, list]) => [id, new Set(list)])
      );
    },
    currentPool() {
      return getPool(this.pool);
    },
    facetOptions() {
      return this.currentPool?.facets || [];
    },
    levelsFiltered() {
      return this.selectedLevels.length > 0 && this.selectedLevels.length < LEVELS.length;
    },
    activeFilterCount() {
      return (this.pool !== 'all' ? 1 : 0)
        + (this.query.trim() ? 1 : 0)
        + (this.levelsFiltered ? 1 : 0)
        + (this.status !== 'all' ? 1 : 0)
        + (this.memory !== 'all' ? 1 : 0)
        + (this.facet !== 'all' ? 1 : 0);
    },
    // chips: how many words of each pool are in / total
    poolChips() {
      const total = {};
      const on = {};
      this.rows.forEach(row => {
        total[row.poolId] = (total[row.poolId] || 0) + 1;
        if (!this.excludedSets[row.poolId].has(row.key)) on[row.poolId] = (on[row.poolId] || 0) + 1;
      });

      const sum = counts => Object.values(counts).reduce((a, b) => a + b, 0);
      return [
        { id: 'all', label: 'All', on: sum(on), total: sum(total) },
        ...POOLS.map(({ id, label }) => ({ id, label, on: on[id] || 0, total: total[id] || 0 })),
      ];
    },
    filteredRows() {
      const terms = normalize(this.query).split(/\s+/).filter(Boolean);
      const levels = this.levelsFiltered ? this.selectedLevels : null;

      return this.rows.filter(row => {
        if (this.pool !== 'all' && row.poolId !== this.pool) return false;
        if (levels && !levels.includes(row.level)) return false;
        if (this.facet !== 'all' && row.facet !== this.facet) return false;
        if (this.memory !== 'all' && row.state !== this.memory) return false;
        if (this.status !== 'all' && (this.status === 'on') !== this.isOn(row)) return false;
        return terms.every(term => row.search.includes(term));
      });
    },
    visibleRows() {
      return this.filteredRows.slice(0, this.limit);
    },
    filteredOnCount() {
      return this.filteredRows.filter(row => this.isOn(row)).length;
    },
    // a change here sends the list back to its first page
    filterSignature() {
      return [this.pool, this.query, this.selectedLevels.join(), this.status, this.memory, this.facet].join('|');
    },
  },
  watch: {
    pool() {
      this.facet = 'all'; // facets belong to one pool
    },
    filterSignature() {
      this.limit = PAGE_SIZE;
    },
  },
  methods: {
    isOn(row) {
      return !this.excludedSets[row.poolId].has(row.key);
    },
    toggle(row) {
      const set = new Set(this.excluded[row.poolId]);
      if (set.has(row.key)) set.delete(row.key);
      else set.add(row.key);
      this.commit(row.poolId, [...set]);
    },
    commit(poolId, list) {
      this.excluded = { ...this.excluded, [poolId]: list };
      saveExcluded(getPool(poolId), list);
    },
    // Applies to EVERY row matching the filters, not only the ones rendered so far.
    // Words of other pools / filtered out are never touched.
    bulk(action) {
      const byPool = {};
      this.filteredRows.forEach(row => {
        (byPool[row.poolId] = byPool[row.poolId] || []).push(row);
      });

      Object.entries(byPool).forEach(([poolId, rows]) => {
        const set = new Set(this.excluded[poolId]);
        rows.forEach(({ key }) => {
          const turnOn = action === 'include' || (action === 'invert' && set.has(key));
          if (turnOn) set.delete(key);
          else set.add(key);
        });
        this.commit(poolId, [...set]);
      });
    },
    toggleLevel(level) {
      const next = this.selectedLevels.includes(level)
        ? this.selectedLevels.filter(l => l !== level)
        : [...this.selectedLevels, level];
      this.selectedLevels = LEVELS.filter(l => next.includes(l)); // keep N5..N1 order
      saveSelection(LEVELS_KEY, this.selectedLevels);
    },
    clearFilters() {
      this.pool = 'all';
      this.query = '';
      this.selectedLevels = [];
      saveSelection(LEVELS_KEY, []);
      this.status = 'all';
      this.memory = 'all';
      this.facet = 'all';
    },
    // progress may have been merged from the cloud after this view mounted
    refreshRows() {
      this.rows = buildRows();
    },
  },
  mounted() {
    window.addEventListener('jp-sync-applied', this.refreshRows);
  },
  beforeUnmount() {
    window.removeEventListener('jp-sync-applied', this.refreshRows);
  },
  template,
};
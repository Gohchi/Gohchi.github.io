// Header button that opens a matrix of words (kanji) to include in / exclude from the practice pool.
//   items:    [{ word, reading, meaning, memory }]  words visible with the current JLPT filter
//   excluded: [word, ...]                           words the user turned OFF (v-model:excluded)
//
// The list stores EXCLUDED words, so new words added to the data are in the pool by default.

export default {
  props: {
    label: {
      type: String,
      default: 'Pool',
    },
    title: String,
    items: {
      type: Array,
      default: () => [],
    },
    excluded: {
      type: Array,
      default: () => [],
    },
    emptyText: {
      type: String,
      default: 'No words for the selected JLPT levels.',
    },
  },
  emits: ['update:excluded'],
  data() {
    return { open: false };
  },
  computed: {
    excludedSet() {
      return new Set(this.excluded);
    },
    includedCount() {
      return this.items.filter(({ word }) => !this.excludedSet.has(word)).length;
    },
  },
  methods: {
    isOn(word) {
      return !this.excludedSet.has(word);
    },
    emitExcluded(list) {
      this.$emit('update:excluded', list);
    },
    toggle(word) {
      this.emitExcluded(this.isOn(word)
        ? [...this.excluded, word]
        : this.excluded.filter(w => w !== word));
    },
    // The three actions only touch the visible words; excluded words from
    // other JLPT levels are kept as they are.
    selectAll() {
      const visible = new Set(this.items.map(({ word }) => word));
      this.emitExcluded(this.excluded.filter(w => !visible.has(w)));
    },
    selectNone() {
      this.emitExcluded([...new Set([...this.excluded, ...this.items.map(({ word }) => word)])]);
    },
    invert() {
      const visible = new Set(this.items.map(({ word }) => word));
      const hidden = this.excluded.filter(w => !visible.has(w));
      const newlyExcluded = this.items.filter(({ word }) => this.isOn(word)).map(({ word }) => word);
      this.emitExcluded([...hidden, ...newlyExcluded]);
    },
    cellSize(word) {
      const length = [...word].length;
      return length > 4 ? 'xl' : length > 2 ? 'long' : '';
    },
    cellTitle({ word, reading, meaning }) {
      return [word, reading, meaning].filter(Boolean).join(' · ');
    },
    // capture phase: still runs when the menu itself stops propagation
    onOutsideClick(e) {
      if (this.open && !this.$el.contains(e.target)) this.open = false;
    },
    onKeydown(e) {
      if (e.key === 'Escape') this.open = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.onOutsideClick, true);
    document.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onOutsideClick, true);
    document.removeEventListener('keydown', this.onKeydown);
  },
  template: /*html*/`
    <div class="filter-menu" @click.stop>
      <button
        type="button"
        class="filter-button"
        :class="{ open }"
        :title="title || label"
        aria-haspopup="true"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span>{{ label }}</span>
        <span class="filter-count">{{ includedCount }}/{{ items.length }}</span>
      </button>

      <div v-if="open" class="filter-popover pool-popover" role="group" :aria-label="title || label">
        <div class="filter-popover-actions pool-actions">
          <span class="pool-summary">{{ includedCount }} of {{ items.length }} selected</span>
          <button type="button" class="filter-link" @click="selectAll">All</button>
          <button type="button" class="filter-link" @click="selectNone">None</button>
          <button type="button" class="filter-link" @click="invert">Invert</button>
        </div>

        <div v-if="items.length" class="pool-grid">
          <button
            v-for="item in items" :key="item.word"
            type="button"
            class="pool-cell"
            :class="[cellSize(item.word), { on: isOn(item.word) }]"
            :style="{ '--m': item.memory }"
            :title="cellTitle(item)"
            :aria-pressed="isOn(item.word)"
            @click="toggle(item.word)"
          >{{ item.word }}</button>
        </div>
        <div v-else class="pool-empty">{{ emptyText }}</div>
      </div>
    </div>
  `,
};
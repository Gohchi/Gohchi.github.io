// Header button that opens a matrix of words (kanji) to include in / exclude from the practice pool.
//   items:    [{ word, reading, meaning, memory, level?, tags?, locked?, needs? }]  words visible with the current JLPT filter
//             `level` (N5..N1) groups the matrix under "— N5 ———" separators, `tags` become chips that select by tag
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
      return this.items.filter(({ word, locked }) => !locked && !this.excludedSet.has(word)).length;
    },
    openItems() {
      return this.items.filter(({ locked }) => !locked);
    },
    // JLPT sections in N5 -> N1 order; words without a level go last. No separators when no word has a level.
    groups() {
      if (!this.items.some(({ level }) => level)) return [{ level: '', items: this.items }];
      const order = ['N5', 'N4', 'N3', 'N2', 'N1'];
      const byLevel = new Map();
      this.items.forEach(item => {
        const level = item.level || '';
        if (!byLevel.has(level)) byLevel.set(level, []);
        byLevel.get(level).push(item);
      });
      const rank = level => (order.includes(level) ? order.indexOf(level) : order.length);
      return [...byLevel.entries()]
        .sort(([a], [b]) => rank(a) - rank(b))
        .map(([level, items]) => ({ level, items }));
    },
    // one chip per tag, counting only the words that can be picked (not locked)
    tagList() {
      const map = new Map();
      this.openItems.forEach(({ word, tags }) => {
        (tags || []).forEach(tag => {
          if (!map.has(tag)) map.set(tag, []);
          map.get(tag).push(word);
        });
      });
      return [...map.entries()]
        .map(([tag, words]) => ({
          tag,
          words,
          on: words.filter(w => this.isOn(w)).length,
        }))
        .sort((a, b) => b.words.length - a.words.length || a.tag.localeCompare(b.tag));
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
      if (this.items.find(item => item.word === word)?.locked) return;
      this.emitExcluded(this.isOn(word)
        ? [...this.excluded, word]
        : this.excluded.filter(w => w !== word));
    },
    // The three actions only touch the visible words; excluded words from
    // other JLPT levels are kept as they are.
    selectAll() {
      const visible = new Set(this.openItems.map(({ word }) => word));
      this.emitExcluded(this.excluded.filter(w => !visible.has(w)));
    },
    selectNone() {
      this.emitExcluded([...new Set([...this.excluded, ...this.openItems.map(({ word }) => word)])]);
    },
    invert() {
      const visible = new Set(this.openItems.map(({ word }) => word));
      const hidden = this.excluded.filter(w => !visible.has(w));
      const newlyExcluded = this.openItems.filter(({ word }) => this.isOn(word)).map(({ word }) => word);
      this.emitExcluded([...hidden, ...newlyExcluded]);
    },
    // all words of the tag are in the pool -> turn them off; otherwise turn them all on
    toggleTag({ words, on }) {
      const set = new Set(words);
      this.emitExcluded(on === words.length
        ? [...new Set([...this.excluded, ...words])]
        : this.excluded.filter(w => !set.has(w)));
    },
    cellSize(word) {
      const length = [...word].length;
      return length > 4 ? 'xl' : length > 2 ? 'long' : '';
    },
    cellTitle({ word, reading, meaning, locked, needs }) {
      return [word, reading, meaning, locked ? '🔒 ' + needs : ''].filter(Boolean).join(' · ');
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

        <div v-if="tagList.length" class="pool-tags" role="group" aria-label="Select by tag">
          <button
            v-for="t in tagList" :key="t.tag"
            type="button"
            class="pool-tag"
            :class="{ on: t.on === t.words.length, some: t.on > 0 && t.on < t.words.length }"
            :title="'Select / deselect every word tagged ' + t.tag"
            @click="toggleTag(t)"
          >{{ t.tag }} <small>{{ t.on }}/{{ t.words.length }}</small></button>
        </div>

        <div v-if="items.length" class="pool-groups">
          <section v-for="group in groups" :key="group.level" class="pool-group">
            <div v-if="group.level" class="pool-level">{{ group.level }}</div>
            <div class="pool-grid">
              <button
                v-for="item in group.items" :key="item.word"
                type="button"
                class="pool-cell"
                :class="[cellSize(item.word), { on: isOn(item.word) && !item.locked, locked: item.locked }]"
                :style="{ '--m': item.memory }"
                :title="cellTitle(item)"
                :aria-pressed="isOn(item.word) && !item.locked"
                :aria-disabled="item.locked ? 'true' : undefined"
                @click="toggle(item.word)"
              >{{ item.word }}</button>
            </div>
          </section>
        </div>
        <div v-else class="pool-empty">{{ emptyText }}</div>
      </div>
    </div>
  `,
};
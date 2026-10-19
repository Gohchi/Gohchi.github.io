export default {
  props: {
    columns: { type: Array, required: true },         // [{ field, caption, width, cls }]
    rows: { type: Array, default: () => [] },
    rowKey: { type: String, default: 'id' },
    striped: Boolean, hovered: Boolean, bordered: Boolean, condensed: Boolean,
    sortable: Boolean,
    selectable: Boolean,
    modelValue: [String, Number],                     // selected row key
  },
  emits: ['update:modelValue'],
  data: () => ({ sortKey: null, sortDir: 1 }),
  computed: {
    sorted() {
      if (!this.sortKey) return this.rows;
      const k = this.sortKey, d = this.sortDir;
      return [...this.rows].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * d);
    },
  },
  methods: {
    sort(c) {
      if (!this.sortable) return;
      this.sortDir = this.sortKey === c.field ? -this.sortDir : 1;
      this.sortKey = c.field;
    },
    thClass(c) {
      if (!this.sortable) return c.hcls;
      return [c.hcls, this.sortKey === c.field ? (this.sortDir === 1 ? 'sorting_asc' : 'sorting_desc') : 'sorting'];
    },
  },
  template: /*html*/`
    <table class="table" :class="{ striped, hovered, bordered, condensed, dataTable: sortable }">
      <thead><tr>
        <th v-for="c in columns" :key="c.field" :class="thClass(c)" @click="sort(c)">{{ c.caption }}</th>
      </tr></thead>
      <tbody>
        <tr v-for="(r, i) in sorted" :key="r[rowKey] ?? i"
          :class="[r.__row_class, { selected: selectable && r[rowKey] === modelValue }]"
          @click="selectable && $emit('update:modelValue', r[rowKey])">
          <td v-for="c in columns" :key="c.field" :class="c.cls" :style="{ width: c.width }">
            <slot :name="'cell-' + c.field" :row="r" :value="r[c.field]">{{ r[c.field] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>`,
};
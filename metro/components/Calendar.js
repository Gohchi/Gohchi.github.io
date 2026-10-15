const pad = n => String(n).padStart(2, '0');
export const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default {
  props: {
    modelValue: { type: [Date, Array], default: null },   // Date, or Date[] when multiSelect
    multiSelect: Boolean,
    locale: { type: String, default: 'en' },
    weekStart: { type: Number, default: 0 },              // 0 = Sunday, 1 = Monday
    startMode: { type: String, default: 'day' },          // 'day' | 'month' | 'year'
    otherDays: Boolean,                                    // show neighbouring-month day numbers
    buttons: { type: Boolean, default: true },             // Today / Clear
  },
  emits: ['update:modelValue'],
  data() {
    const base = [].concat(this.modelValue || [])[0] || new Date();
    return {
      year: base.getFullYear(),
      month: base.getMonth(),
      mode: this.startMode,
      decade: base.getFullYear() - 4,
    };
  },
  computed: {
    selected() {
      return new Set([].concat(this.modelValue || []).map(dateKey));
    },
    todayKey() { return dateKey(new Date()); },
    monthTitle() {
      return new Intl.DateTimeFormat(this.locale, { month: 'long' }).format(new Date(this.year, this.month, 1));
    },
    monthsShort() {
      const f = new Intl.DateTimeFormat(this.locale, { month: 'short' });
      return Array.from({ length: 12 }, (_, i) => f.format(new Date(2000, i, 1)));
    },
    dayNames() {
      const f = new Intl.DateTimeFormat(this.locale, { weekday: 'short' });
      // 2023-01-01 is a Sunday
      return Array.from({ length: 7 }, (_, i) => f.format(new Date(2023, 0, 1 + ((i + this.weekStart) % 7))));
    },
    // rows of cells: { day, other, key }
    weeks() {
      const { year, month } = this;
      const offset = (new Date(year, month, 1).getDay() - this.weekStart + 7) % 7;
      const total = new Date(year, month + 1, 0).getDate();
      const prevTotal = new Date(year, month, 0).getDate();

      const cells = [];
      for (let i = 0; i < offset; i++) cells.push({ other: true, day: prevTotal - offset + 1 + i });
      for (let d = 1; d <= total; d++) cells.push({ day: d, key: dateKey(new Date(year, month, d)) });
      for (let d = 1; cells.length % 7; d++) cells.push({ other: true, day: d });

      const rows = [];
      for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
      return rows;
    },
    years() { return Array.from({ length: 12 }, (_, i) => this.decade + i); },
  },
  methods: {
    shiftMonth(delta) {
      const d = new Date(this.year, this.month + delta, 1);
      this.year = d.getFullYear();
      this.month = d.getMonth();
    },
    pick(cell) {
      if (cell.other) return;
      const date = new Date(this.year, cell.day ? this.month : this.month, cell.day);
      if (!this.multiSelect) return this.$emit('update:modelValue', date);

      const list = [].concat(this.modelValue || []);
      const k = dateKey(date);
      this.$emit('update:modelValue',
        this.selected.has(k) ? list.filter(d => dateKey(d) !== k) : [...list, date]);
    },
    pickMonth(i) { this.month = i; this.mode = 'day'; },
    pickYear(y) { this.year = y; this.mode = 'month'; },
    today() {
      const t = new Date();
      this.year = t.getFullYear();
      this.month = t.getMonth();
    },
    clear() {
      this.today();
      this.$emit('update:modelValue', this.multiSelect ? [] : null);
    },
  },
  template: /*html*/`
    <div class="calendar">
      <!-- day mode -->
      <table v-if="mode === 'day'" class="bordered">
        <tr class="calendar-header">
          <td class="text-center"><a href="#" @click.prevent="year--"><i class="icon-previous"></i></a></td>
          <td class="text-center"><a href="#" @click.prevent="shiftMonth(-1)"><i class="icon-arrow-left-4"></i></a></td>
          <td colspan="3" class="text-center"><a href="#" @click.prevent="mode = 'month'">{{ monthTitle }} {{ year }}</a></td>
          <td class="text-center"><a href="#" @click.prevent="shiftMonth(1)"><i class="icon-arrow-right-4"></i></a></td>
          <td class="text-center"><a href="#" @click.prevent="year++"><i class="icon-next"></i></a></td>
        </tr>
        <tr class="calendar-subheader">
          <td v-for="n in dayNames" :key="n" class="text-center day-of-week">{{ n }}</td>
        </tr>
        <tr v-for="(row, r) in weeks" :key="r">
          <td v-for="(cell, c) in row" :key="c"
            :class="cell.other ? 'empty' : ['text-center', 'day', { today: cell.key === todayKey }]">
            <small v-if="cell.other" class="other-day">{{ otherDays ? cell.day : '' }}</small>
            <a v-else href="#" :class="{ selected: selected.has(cell.key) }" @click.prevent="pick(cell)">{{ cell.day }}</a>
          </td>
        </tr>
        <tr v-if="buttons" class="calendar-actions">
          <td colspan="7" class="text-left">
            <button type="button" class="button small success" @click="today">Today</button>&nbsp;
            <button type="button" class="button small warning" @click="clear">Clear</button>
          </td>
        </tr>
      </table>

      <!-- month mode -->
      <table v-else-if="mode === 'month'" class="bordered">
        <tr class="calendar-header">
          <td class="text-center"><a href="#" @click.prevent="year--"><i class="icon-arrow-left-4"></i></a></td>
          <td colspan="2" class="text-center"><a href="#" @click.prevent="mode = 'year'">{{ year }}</a></td>
          <td class="text-center"><a href="#" @click.prevent="year++"><i class="icon-arrow-right-4"></i></a></td>
        </tr>
        <tr v-for="r in 3" :key="r">
          <td v-for="c in 4" :key="c" class="text-center month"
            :class="{ today: (r - 1) * 4 + c - 1 === new Date().getMonth() && year === new Date().getFullYear() }">
            <a href="#" @click.prevent="pickMonth((r - 1) * 4 + c - 1)">{{ monthsShort[(r - 1) * 4 + c - 1] }}</a>
          </td>
        </tr>
      </table>

      <!-- year mode -->
      <table v-else class="bordered">
        <tr class="calendar-header">
          <td class="text-center"><a href="#" @click.prevent="decade -= 10"><i class="icon-arrow-left-4"></i></a></td>
          <td colspan="2" class="text-center">{{ decade }}-{{ decade + 11 }}</td>
          <td class="text-center"><a href="#" @click.prevent="decade += 10"><i class="icon-arrow-right-4"></i></a></td>
        </tr>
        <tr v-for="r in 3" :key="r">
          <td v-for="c in 4" :key="c" class="text-center year"
            :class="{ today: years[(r - 1) * 4 + c - 1] === new Date().getFullYear() }">
            <a href="#" @click.prevent="pickYear(years[(r - 1) * 4 + c - 1])">{{ years[(r - 1) * 4 + c - 1] }}</a>
          </td>
        </tr>
      </table>
    </div>`,
};
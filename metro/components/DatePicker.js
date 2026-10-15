import Calendar, { dateKey } from './Calendar.js';

export default {
  components: { Calendar },
  props: {
    modelValue: Date,
    placeholder: { type: String, default: 'Select a date' },
    locale: { type: String, default: 'en' },
    weekStart: { type: Number, default: 0 },
  },
  emits: ['update:modelValue'],
  data: () => ({ open: false }),
  computed: {
    text() { return this.modelValue ? dateKey(this.modelValue) : ''; },
  },
  methods: {
    onPick(date) {
      this.$emit('update:modelValue', date);
      this.open = false;
    },
    onOutside(e) { if (!this.$el.contains(e.target)) this.open = false; },
  },
  mounted() { document.addEventListener('click', this.onOutside); },
  beforeUnmount() { document.removeEventListener('click', this.onOutside); },
  template: /*html*/`
    <div class="input-control text" style="position:relative" @click="open = !open">
      <input type="text" readonly :value="text" :placeholder="placeholder">
      <button type="button" class="btn-date"></button>
      <Calendar v-show="open" class="calendar-dropdown" style="position:absolute;top:100%;left:0;z-index:1000;max-width:260px"
        :model-value="modelValue" :locale="locale" :week-start="weekStart" :buttons="false"
        @update:model-value="onPick" @click.stop />
    </div>`,
};
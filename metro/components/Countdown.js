import Digits from './Digits.js';

export default {
  components: { Digits },
  props: {
    to: [Date, Number, String],           // target; if omitted, now + days
    days: { type: Number, default: 1 },
    blink: { type: Boolean, default: true },
    background: { type: String, default: 'bg-dark' },
    foreground: { type: String, default: 'fg-white' },
    divider: { type: String, default: 'fg-dark' },
  },
  emits: ['tick', 'stop'],
  data: () => ({ now: Date.now(), target: 0, off: false, timer: null }),
  computed: {
    left() { return Math.max(0, Math.floor((this.target - this.now) / 1000)); },
    parts() {
      const l = this.left;
      return [Math.floor(l / 86400), Math.floor(l % 86400 / 3600), Math.floor(l % 3600 / 60), l % 60];
    },
  },
  watch: { to() { this.start(); } },
  methods: {
    start() {
      clearInterval(this.timer);
      this.now = Date.now();
      this.target = this.to ? new Date(this.to).getTime() : this.now + this.days * 864e5;
      this.timer = setInterval(this.run, 1000);
    },
    run() {
      this.now = Date.now();
      this.off = !this.off;
      this.$emit('tick', this.parts);
      if (this.left === 0) { clearInterval(this.timer); this.$emit('stop'); }
    },
  },
  mounted() { this.start(); },
  beforeUnmount() { clearInterval(this.timer); },
  template: /*html*/`
    <div class="countdown">
      <template v-for="(p, i) in parts" :key="i">
        <span><Digits :value="p" :background="background" :foreground="foreground" /></span>
        <span v-if="i < 3" class="divider" :class="[divider, { 'no-visible': blink && off }]"></span>
      </template>
    </div>`,
};
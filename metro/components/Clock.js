import Digits from './Digits.js';

export default {
  components: { Digits },
  props: {
    alarm: String,                        // 'HH:MM:SS'
    blink: { type: Boolean, default: true },
    background: { type: String, default: 'bg-dark' },
    foreground: { type: String, default: 'fg-white' },
    divider: { type: String, default: 'fg-dark' },
  },
  emits: ['tick', 'alarm'],
  data: () => ({ now: new Date(), off: false, timer: null }),
  computed: {
    parts() { return [this.now.getHours(), this.now.getMinutes(), this.now.getSeconds()]; },
  },
  methods: {
    run() {
      this.now = new Date();
      this.off = !this.off;
      this.$emit('tick', this.parts);
      if (this.alarm) {
        const [h, m, s] = this.alarm.split(':').map(Number);
        const [ch, cm, cs] = this.parts;
        if (h === ch && (m || 0) === cm && (s || 0) === cs) this.$emit('alarm');
      }
    },
  },
  mounted() { this.timer = setInterval(this.run, 1000); },
  beforeUnmount() { clearInterval(this.timer); },
  template: /*html*/`
    <div class="times">
      <template v-for="(p, i) in parts" :key="i">
        <span><Digits :value="p" :background="background" :foreground="foreground" /></span>
        <span v-if="i < 2" class="divider" :class="[divider, { 'no-visible': blink && off }]"></span>
      </template>
    </div>`,
};
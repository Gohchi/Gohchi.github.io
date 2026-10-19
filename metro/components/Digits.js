export default {
  props: {
    value: { type: Number, default: 0 },
    background: { type: String, default: 'bg-dark' },
    foreground: { type: String, default: 'fg-white' },
  },
  computed: { text() { return String(Math.max(0, this.value)).padStart(2, '0'); } },
  template: /*html*/`
    <span v-for="(c, i) in text" :key="i" class="digit-wrapper">
      <span class="digit" :class="[background, foreground]">{{ c }}</span>
    </span>`,
};
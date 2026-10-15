// Slider.js (pointer events replace the document-level mousemove/mouseup juggling)
export default {
  props: { modelValue: { type: Number, default: 0 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, step: { type: Number, default: 1 }, showHint: Boolean },
  emits: ['update:modelValue'],
  computed: { pct() { return (this.modelValue - this.min) / (this.max - this.min) * 100; } },
  methods: {
    set(e) {
      const r = this.$el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const raw = this.min + ratio * (this.max - this.min);
      this.$emit('update:modelValue', Math.round(raw / this.step) * this.step);
    },
    down(e) { this.$el.setPointerCapture(e.pointerId); this.set(e); },
    move(e) { if (this.$el.hasPointerCapture(e.pointerId)) this.set(e); },
  },
  template: /*html*/`
    <div class="slider" @pointerdown="down" @pointermove="move" style="touch-action:none">
      <div class="complete" :style="{ width: pct + '%' }"></div>
      <a class="marker" :style="{ left: 'calc(' + pct + '% - 6px)' }"></a>
      <span v-if="showHint" class="hint" style="display:block" :style="{ left: pct + '%' }">{{ modelValue }}</span>
    </div>`,
};
export default {
  props: {
    color: String,
    size: String,
    selectable: { type: Boolean, default: true },
    modelValue: Boolean,
    transform: Boolean,
    draggable: Boolean,                  // replaces metro-drag-tile
  },
  emits: ['update:modelValue', 'dragstart', 'dragend'],
  data: () => ({ tilt: '', dragging: false }),
  computed: {
    classes() {
      return [this.color, this.size, { selected: this.modelValue }, this.tilt && `tile-transform-${this.tilt}`];
    },
  },
  methods: {
    toggle() {
      if (this.selectable) this.$emit('update:modelValue', !this.modelValue);
    },
    press(e) {
      if (!this.transform) return;
      const r = this.$el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      this.tilt = x < r.width / 3 ? 'left'
        : x > r.width * 2 / 3 ? 'right'
        : y > r.height / 2 ? 'bottom' : 'top';
    },
    release() { this.tilt = ''; },
    onDragStart(e) { this.dragging = true; this.$emit('dragstart', e); },
    onDragEnd(e) { this.dragging = false; this.$emit('dragend', e); },
  },
  template: /*html*/`
    <div class="tile" :class="classes" :draggable="draggable || null"
      :style="dragging ? { opacity: .4 } : null"
      @click="toggle" @mousedown="press" @mouseup="release" @mouseleave="release"
      @dragstart="onDragStart" @dragend="onDragEnd">
      <slot />
    </div>`,
};
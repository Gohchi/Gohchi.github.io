export default {
  props: {
    color: String,                       // 'bg-cyan', ...
    size: String,                        // 'half' | 'double' | 'double-vertical' | 'triple' | 'quadro'
    selectable: { type: Boolean, default: true },
    modelValue: Boolean,                 // selected
    transform: Boolean,                  // tilt on press
  },
  emits: ['update:modelValue'],
  data: () => ({ tilt: '' }),
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
  },
  template: /*html*/`
    <div class="tile" :class="classes"
      @click="toggle" @mousedown="press" @mouseup="release" @mouseleave="release">
      <slot />
    </div>`,
};
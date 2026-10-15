export default {
  props: { modelValue: { type: Number, default: 0 }, color: { type: String, default: 'bg-cyan' }, size: String },
  template: `<div class="progress-bar" :class="size"><div class="bar" :class="color" :style="{ width: modelValue + '%' }"></div></div>`,
};
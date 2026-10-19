// Row of mutually exclusive options (replaces the old icon-only dropdown menus).
//   options: [{ value, label, icon?, swatch? }]
export default {
  props: {
    modelValue: [String, Number],
    options: { type: Array, default: () => [] },
    label: String,
    small: Boolean,
  },
  emits: ['update:modelValue'],
  template: /*html*/`
    <div class="segmented" :class="{ small }" role="radiogroup" :aria-label="label">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="radio"
        class="seg"
        :class="{ on: option.value === modelValue }"
        :aria-checked="option.value === modelValue"
        @click="$emit('update:modelValue', option.value)"
      >
        <span v-if="option.swatch" class="swatch" :style="{ background: option.swatch }"></span>
        <i v-if="option.icon" class="material-icons" aria-hidden="true">{{ option.icon }}</i>
        <span>{{ option.label }}</span>
      </button>
    </div>
  `,
};
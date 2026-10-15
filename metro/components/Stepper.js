export default {
  props: {
    steps: { type: Number, default: 3 },
    modelValue: { type: Number, default: 1 },
    clickable: { type: Boolean, default: true },
    type: String,                                  // '', 'rounded' or 'diamond'
  },
  emits: ['update:modelValue'],
  methods: {
    left(i) {
      return this.steps === 1 ? '0' : `calc((100% - 2em) * ${i} / ${this.steps - 1})`;
    },
  },
  template: /*html*/`
    <div class="stepper" :class="type">
      <ul>
        <li v-for="n in steps" :key="n"
          :class="{ current: n === modelValue, complete: n < modelValue }"
          :style="{ left: left(n - 1) }"
          @click="clickable && $emit('update:modelValue', n)"></li>
      </ul>
    </div>`,
};
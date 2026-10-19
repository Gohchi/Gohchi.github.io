// multiple = toggle buttons (button-set); otherwise exclusive (button-group)
export default {
  props: {
    options: { type: Array, required: true },         // [{ key, label }]
    modelValue: [Array, String, Number],
    multiple: Boolean,
    noSpaces: Boolean,
    transparent: Boolean,
  },
  emits: ['update:modelValue'],
  methods: {
    on(k) { return this.multiple ? (this.modelValue || []).includes(k) : this.modelValue === k; },
    pick(k) {
      if (!this.multiple) return this.$emit('update:modelValue', k);
      const s = new Set(this.modelValue || []);
      s.has(k) ? s.delete(k) : s.add(k);
      this.$emit('update:modelValue', this.options.map(o => o.key).filter(x => s.has(x)));
    },
  },
  template: /*html*/`
    <div class="button-set" :class="{ 'no-spaces': noSpaces, transparent }">
      <button v-for="o in options" :key="o.key" type="button" class="button"
        :class="{ active: on(o.key) }" @click="pick(o.key)">{{ o.label }}</button>
    </div>`,
};
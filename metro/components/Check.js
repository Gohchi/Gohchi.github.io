export default {
  props: {
    modelValue: [Boolean, Array, String, Number],
    value: [String, Number],                          // for radio, or checkbox groups (array model)
    type: { type: String, default: 'checkbox' },      // checkbox | radio | switch
    caption: String,
    disabled: Boolean,
    indeterminate: Boolean,
  },
  emits: ['update:modelValue'],
  computed: {
    checked() {
      if (this.type === 'radio') return this.modelValue === this.value;
      if (Array.isArray(this.modelValue)) return this.modelValue.includes(this.value);
      return !!this.modelValue;
    },
  },
  methods: {
    onChange(e) {
      const on = e.target.checked;
      if (this.type === 'radio') return this.$emit('update:modelValue', this.value);
      if (Array.isArray(this.modelValue)) {
        const s = new Set(this.modelValue);
        on ? s.add(this.value) : s.delete(this.value);
        return this.$emit('update:modelValue', [...s]);
      }
      this.$emit('update:modelValue', on);
    },
  },
  template: /*html*/`
    <div class="input-control" :class="type">
      <label>
        <input :type="type === 'radio' ? 'radio' : 'checkbox'" :checked="checked" :disabled="disabled"
          :data-show="indeterminate ? 'intermediate' : null" @change="onChange">
        <span class="check"></span>
        <span v-if="caption || $slots.default" class="caption"><slot>{{ caption }}</slot></span>
      </label>
    </div>`,
};
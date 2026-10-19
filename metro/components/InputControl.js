export default {
  props: {
    modelValue: [String, Number],
    type: { type: String, default: 'text' },          // text | password | search | email | tel | number | file
    placeholder: String,
    disabled: Boolean,
    readonly: Boolean,
    clearable: { type: Boolean, default: true },
    state: String,                                    // warning | error | info | success
  },
  emits: ['update:modelValue', 'clear', 'search', 'change'],
  data: () => ({ reveal: false, fileName: '' }),
  computed: {
    cls() {
      return ['input-control', this.type === 'search' ? 'text' : this.type, this.state && this.state + '-state'];
    },
    inputType() {
      if (this.type === 'search') return 'text';
      return this.type === 'password' && this.reveal ? 'text' : this.type;
    },
    btn() {
      if (this.type === 'password') return 'btn-reveal';
      if (this.type === 'search') return 'btn-search';
      return this.clearable ? 'btn-clear' : null;
    },
  },
  methods: {
    down() { if (this.type === 'password') this.reveal = true; },
    up() { this.reveal = false; },
    click() {
      if (this.type === 'search') return this.$emit('search', this.modelValue);
      if (this.type === 'password' || this.readonly) return;
      this.$emit('update:modelValue', '');
      this.$emit('clear');
      this.$refs.input?.focus();
    },
    onFile(e) {
      const files = e.target.files;
      this.fileName = files.length ? [...files].map(f => f.name).join(', ') : '';
      this.$emit('change', files);
    },
  },
  template: /*html*/`
    <div :class="cls">
      <template v-if="type === 'file'">
        <input ref="file" type="file" :disabled="disabled" @change="onFile">
        <input type="text" readonly :value="fileName" :placeholder="placeholder" style="z-index:1;cursor:default">
        <button type="button" class="btn-file" tabindex="-1" @click="$refs.file.click()"></button>
      </template>
      <template v-else>
        <input ref="input" :type="inputType" :value="modelValue" :placeholder="placeholder"
          :disabled="disabled" :readonly="readonly"
          @input="$emit('update:modelValue', $event.target.value)">
        <!-- mousedown.prevent keeps the focus on the input so the button doesn't vanish -->
        <button v-if="btn" type="button" tabindex="-1" :class="btn"
          @mousedown.prevent="down" @mouseup="up" @mouseleave="up" @click="click"></button>
      </template>
    </div>`,
};
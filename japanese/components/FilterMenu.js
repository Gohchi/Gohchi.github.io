// Header button that opens a multi-select checklist.
// v-model is an array of the selected option keys.
//   options: [{ key, label }]

export const loadSelection = (key, fallback) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

export const saveSelection = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
};

export default {
  props: {
    label: String,
    title: String,
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  data() {
    return { open: false };
  },
  methods: {
    isOn(key) {
      return this.modelValue.includes(key);
    },
    emitKeys(keys) {
      // keep the original option order
      this.$emit('update:modelValue', this.options.map(o => o.key).filter(k => keys.includes(k)));
    },
    toggle(key) {
      this.emitKeys(this.isOn(key)
        ? this.modelValue.filter(k => k !== key)
        : [...this.modelValue, key]);
    },
    setAll(on) {
      this.emitKeys(on ? this.options.map(o => o.key) : []);
    },
    // capture phase: still runs when the menu itself stops propagation
    onOutsideClick(e) {
      if (this.open && !this.$el.contains(e.target)) this.open = false;
    },
    onKeydown(e) {
      if (e.key === 'Escape') this.open = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.onOutsideClick, true);
    document.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onOutsideClick, true);
    document.removeEventListener('keydown', this.onKeydown);
  },
  template: /*html*/`
    <div class="filter-menu" @click.stop>
      <button
        type="button"
        class="filter-button"
        :class="{ open }"
        :title="title || label"
        aria-haspopup="true"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span>{{ label }}</span>
        <span class="filter-count">{{ modelValue.length }}/{{ options.length }}</span>
      </button>

      <div v-if="open" class="filter-popover" role="group" :aria-label="title || label">
        <div class="filter-popover-actions">
          <button type="button" class="filter-link" @click="setAll(true)">All</button>
          <button type="button" class="filter-link" @click="setAll(false)">None</button>
        </div>
        <ul class="filter-list">
          <li v-for="option in options" :key="option.key">
            <label class="filter-option" :class="{ on: isOn(option.key) }">
              <input type="checkbox" :checked="isOn(option.key)" @change="toggle(option.key)" />
              <span>{{ option.label }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  `,
};
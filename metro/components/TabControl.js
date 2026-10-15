export default {
  props: {
    tabs: { type: Array, required: true },       // [{ id, title, disabled }]
    modelValue: { type: [String, Number], default: null },
    storageKey: String,                           // optional: remember the active tab
  },
  emits: ['update:modelValue', 'change'],
  computed: {
    active() { return this.modelValue ?? this.tabs.find(t => !t.disabled)?.id; },
  },
  methods: {
    select(tab) {
      if (tab.disabled) return;
      this.$emit('update:modelValue', tab.id);
      this.$emit('change', tab);
      if (this.storageKey) localStorage.setItem(this.storageKey, tab.id);
    },
  },
  mounted() {
    if (!this.storageKey) return;
    const stored = localStorage.getItem(this.storageKey);
    const tab = this.tabs.find(t => String(t.id) === stored);
    if (tab && !tab.disabled) this.$emit('update:modelValue', tab.id);
  },
  template: /*html*/`
    <div class="tab-control">
      <ul class="tabs">
        <li v-for="t in tabs" :key="t.id" :class="{ active: t.id === active, disabled: t.disabled }">
          <a href="#" @click.prevent="select(t)">{{ t.title }}</a>
        </li>
      </ul>
      <div class="frames">
        <template v-for="t in tabs" :key="t.id">
          <Transition name="fade">
            <div v-show="t.id === active" class="frame" style="display:block"><slot :name="t.id" /></div>
          </Transition>
        </template>
      </div>
    </div>`,
};
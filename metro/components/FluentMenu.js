export default {
  props: {
    tabs: { type: Array, required: true },            // [{ id, title, special }]
    modelValue: [String, Number],
  },
  emits: ['update:modelValue', 'special'],
  computed: {
    active() { return this.modelValue ?? this.tabs.find(t => !t.special)?.id; },
  },
  methods: {
    pick(t) {
      if (t.special) return this.$emit('special', t);
      this.$emit('update:modelValue', t.id);
    },
  },
  template: /*html*/`
    <div class="fluent-menu">
      <ul class="tabs-holder">
        <li v-for="t in tabs" :key="t.id" :class="{ active: !t.special && t.id === active, special: t.special }">
          <a href="#" @click.prevent="pick(t)">{{ t.title }}</a>
        </li>
      </ul>
      <div class="tabs-content">
        <template v-for="t in tabs" :key="t.id">
          <div v-if="!t.special" v-show="t.id === active" class="tab-panel" style="display:block">
            <slot :name="t.id" />
          </div>
        </template>
      </div>
    </div>`,
};
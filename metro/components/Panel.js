export default {
  props: {
    title: String,
    collapsed: Boolean,                // v-model:collapsed
    collapsible: { type: Boolean, default: true },
  },
  emits: ['update:collapsed', 'collapse', 'expand'],
  methods: {
    toggle() {
      if (!this.collapsible) return;
      const next = !this.collapsed;
      this.$emit('update:collapsed', next);
      this.$emit(next ? 'collapse' : 'expand');
    },
  },
  template: /*html*/`
    <div class="panel" :data-role="collapsible ? 'panel' : null" :class="{ collapsed }">
      <div class="panel-header" @click="toggle"><slot name="header">{{ title }}</slot></div>
      <Transition name="collapse">
        <div v-show="!collapsed" class="panel-content"><slot /></div>
      </Transition>
    </div>`,
};
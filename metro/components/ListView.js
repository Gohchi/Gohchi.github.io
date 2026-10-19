const Row = {
  props: { item: Object, active: Boolean, outlook: Boolean },
  emits: ['pick'],
  template: /*html*/`
    <a href="#" class="list" :class="{ active, marked: item.marked }" @click.prevent="$emit('pick', item)">
      <div class="list-content">
        <img v-if="item.image" :class="outlook ? 'list-icon' : 'icon'" :src="item.image">
        <span v-else-if="item.icon" :class="[outlook ? 'list-icon' : 'icon', item.icon]"></span>
        <div class="data">
          <span class="list-title">{{ item.title }}</span>
          <span v-if="item.subtitle" class="list-subtitle">{{ item.subtitle }}</span>
          <span v-if="item.remark" class="list-remark">{{ item.remark }}</span>
        </div>
      </div>
    </a>`,
};

export default {
  components: { Row },
  props: {
    items: { type: Array, default: () => [] },        // [{ id, title, subtitle, remark, icon, image, marked }]
    groups: Array,                                    // [{ title, items }] (optional)
    variant: { type: String, default: 'default' },    // default | small | outlook
    modelValue: [String, Number],                     // active id
  },
  emits: ['update:modelValue', 'expand', 'collapse'],
  data: () => ({ closed: new Set() }),
  computed: {
    outlook() { return this.variant === 'outlook'; },
    rootClass() { return this.outlook ? 'listview-outlook' : ['listview', { small: this.variant === 'small' }]; },
  },
  methods: {
    toggle(g) {
      const next = new Set(this.closed);
      const closing = !next.has(g.title);
      closing ? next.add(g.title) : next.delete(g.title);
      this.closed = next;
      this.$emit(closing ? 'collapse' : 'expand', g);
    },
  },
  template: /*html*/`
    <div :class="rootClass">
      <template v-if="groups">
        <div v-for="g in groups" :key="g.title" class="list-group" :class="{ collapsed: closed.has(g.title) }">
          <a href="#" class="group-title" @click.prevent="toggle(g)">{{ g.title }}</a>
          <div v-show="!closed.has(g.title)" class="group-content" style="display:block">
            <Row v-for="it in g.items" :key="it.id" :item="it" :outlook="outlook"
              :active="it.id === modelValue" @pick="$emit('update:modelValue', $event.id)" />
          </div>
        </div>
      </template>
      <Row v-else v-for="it in items" :key="it.id" :item="it" :outlook="outlook"
        :active="it.id === modelValue" @pick="$emit('update:modelValue', $event.id)" />
    </div>`,
};
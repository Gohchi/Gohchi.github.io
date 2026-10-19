import TreeNode from './TreeNode.js';

export default {
  components: { TreeNode },
  props: {
    nodes: { type: Array, required: true },
    active: { type: [String, Number], default: null },       // v-model:active
    expandedIds: { type: Array, default: () => [] },         // initial open nodes
  },
  emits: ['update:active', 'expand', 'collapse'],
  data() {
    return { expanded: new Set(this.expandedIds) };
  },
  methods: {
    toggle(node) {
      const next = new Set(this.expanded);
      const opening = !next.has(node.id);
      opening ? next.add(node.id) : next.delete(node.id);
      this.expanded = next;
      this.$emit(opening ? 'expand' : 'collapse', node);
    },
  },
  template: /*html*/`
    <ul class="treeview">
      <TreeNode v-for="n in nodes" :key="n.id" :node="n" :expanded="expanded" :active="active"
        @toggle="toggle" @select="$emit('update:active', $event.id)">
        <template #default="{ node }"><slot :node="node">{{ node.title }}</slot></template>
      </TreeNode>
    </ul>`,
};
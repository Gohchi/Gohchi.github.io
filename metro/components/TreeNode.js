// TreeNode.js
export default {
  name: 'TreeNode',
  props: {
    node: { type: Object, required: true },      // { id, title, children?, keepOpen? }
    depth: { type: Number, default: 1 },
    expanded: { type: Set, required: true },
    active: { type: [String, Number], default: null },
  },
  emits: ['toggle', 'select'],
  computed: {
    hasChildren() { return !!this.node.children?.length; },
    open() { return this.expanded.has(this.node.id); },
  },
  methods: {
    onToggle() {
      if (!this.node.keepOpen) this.$emit('toggle', this.node);
    },
  },
  template: /*html*/`
    <li :class="{ node: hasChildren, collapsed: hasChildren && !open }">
      <a href="#" :class="{ active: active === node.id }"
        :style="{ paddingLeft: (depth - 1) * 10 + 'px' }"
        @click.prevent="$emit('select', node)">
        <span v-if="hasChildren" class="node-toggle" @click.prevent.stop="onToggle"></span>
        <slot :node="node">{{ node.title }}</slot>
      </a>
      <Transition name="fade">
        <ul v-if="hasChildren" v-show="open" style="display:block">
          <TreeNode v-for="c in node.children" :key="c.id" :node="c" :depth="depth + 1"
            :expanded="expanded" :active="active"
            @toggle="$emit('toggle', $event)" @select="$emit('select', $event)">
            <template #default="{ node: n }"><slot :node="n">{{ n.title }}</slot></template>
          </TreeNode>
        </ul>
      </Transition>
    </li>`,
};
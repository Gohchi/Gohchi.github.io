// The navigation chips of the header menu. MainHeader renders <NavMenu /> inside its <ul class="menu-index">.
//
// What is shown comes from `MENU` in data/progression.js: locked sections are not rendered, related
// sections are grouped (HIRAGANA > CHARACTERS / KEYBOARD ...) and a group with a single visible
// section is shown as a plain chip. The component is created each time the menu opens (MainHeader
// uses v-if), so the snapshot is always fresh.

import { buildMenu, getSnapshot } from 'data/progression.js';
import { profileStore } from 'store';

export default {
  data() {
    return {
      snapshot: getSnapshot(),
      openGroup: null, // null = the group that contains the current page is open
    };
  },
  computed: {
    menu() {
      return buildMenu({ snapshot: this.snapshot, path: this.$route?.path || '/', isAdmin: profileStore.isAdmin });
    },
  },
  methods: {
    isOpen(group) {
      return this.openGroup === null ? group.selected : this.openGroup === group.id;
    },
    toggleGroup(group) {
      this.openGroup = this.isOpen(group) ? '' : group.id;
    },
  },
  template: /*html*/`
    <template v-for="node in menu" :key="node.id">
      <li v-if="node.type === 'link'">
        <router-link
          :to="node.to"
          class="chip filter-chip"
          :class="{ selected: node.selected, 'practice-chip': node.practice }"
          :aria-current="node.selected ? 'page' : undefined"
        >
          <span v-if="node.selected" class="chip-check" aria-hidden="true">✓</span>
          {{ node.label }}
        </router-link>
      </li>
      <li v-else>
        <button
          type="button"
          class="chip filter-chip"
          :class="{ selected: node.selected, 'practice-chip': node.practice }"
          :aria-expanded="isOpen(node)"
          @click="toggleGroup(node)"
        >
          <span v-if="node.selected" class="chip-check" aria-hidden="true">✓</span>
          {{ node.label }}
          <span class="chip-caret" aria-hidden="true">{{ isOpen(node) ? '▴' : '▾' }}</span>
        </button>
      </li>
      <li v-if="node.type === 'group' && isOpen(node)" class="menu-sublist">
        <ul>
          <li v-for="child in node.children" :key="child.id">
            <router-link
              :to="child.to"
              class="chip filter-chip"
              :class="{ selected: child.selected, 'practice-chip': child.practice }"
              :aria-current="child.selected ? 'page' : undefined"
            >
              <span v-if="child.selected" class="chip-check" aria-hidden="true">✓</span>
              {{ child.label }}
            </router-link>
          </li>
        </ul>
      </li>
    </template>
  `,
};

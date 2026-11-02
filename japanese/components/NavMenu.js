// The navigation chips of the header menu. MainHeader renders <NavMenu /> inside its <ul class="menu-index">.
//
// What is shown comes from `MENU` in data/progression.js: locked sections are not rendered, related
// sections are grouped (HIRAGANA > CHARACTERS / KEYBOARD ...) and a group with a single visible
// section is shown as a plain chip. A group chip opens its sections in a popover under the chip
// (one at a time; click outside, Escape or choosing a section closes it). The component is created
// each time the menu opens (MainHeader uses v-if), so the snapshot is always fresh.

import { buildMenu, getSnapshot } from 'data/progression.js';
import { profileStore } from 'store';

export default {
  data() {
    return {
      snapshot: getSnapshot(),
      openGroup: null, // id of the group whose popover is open
    };
  },
  computed: {
    menu() {
      return buildMenu({ snapshot: this.snapshot, path: this.$route?.path || '/', isAdmin: profileStore.isAdmin });
    },
  },
  methods: {
    toggleGroup(group) {
      this.openGroup = this.openGroup === group.id ? null : group.id;
    },
    // capture phase: still runs when another handler stops propagation
    onOutsideClick(e) {
      if (this.openGroup && !e.target.closest?.('.menu-group')) this.openGroup = null;
    },
    onKeydown(e) {
      if (e.key === 'Escape') this.openGroup = null;
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
      <li v-else class="menu-group">
        <button
          type="button"
          class="chip filter-chip"
          :class="{ selected: node.selected, 'practice-chip': node.practice }"
          aria-haspopup="true"
          :aria-expanded="openGroup === node.id"
          @click="toggleGroup(node)"
        >
          <span v-if="node.selected" class="chip-check" aria-hidden="true">✓</span>
          {{ node.label }}
          <span class="chip-caret" aria-hidden="true">{{ openGroup === node.id ? '▴' : '▾' }}</span>
        </button>
        <ul v-if="openGroup === node.id" class="menu-popover" role="menu">
          <li v-for="child in node.children" :key="child.id">
            <router-link
              :to="child.to"
              class="chip filter-chip"
              :class="{ selected: child.selected, 'practice-chip': child.practice }"
              :aria-current="child.selected ? 'page' : undefined"
              role="menuitem"
              @click="openGroup = null"
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

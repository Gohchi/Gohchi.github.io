// AccordionFrame.js
import { inject, computed } from 'vue';

export default {
  props: { id: { type: [String, Number], required: true }, title: String, disabled: Boolean },
  setup(props) {
    const accordion = inject('accordion');
    const open = computed(() => accordion.isOpen(props.id));
    const toggle = () => { if (!props.disabled) accordion.toggle(props.id); };
    return { open, toggle };
  },
  template: /*html*/`
    <div class="accordion-frame" :class="{ active: open }">
      <a href="#" class="heading" :class="{ collapsed: !open }" :disabled="disabled || null" @click.prevent="toggle">
        <slot name="title">{{ title }}</slot>
      </a>
      <Transition name="collapse">
        <div v-show="open" class="content" style="display:block"><slot /></div>
      </Transition>
    </div>`,
};
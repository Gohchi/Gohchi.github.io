export default {
  props: { effect: { type: String, default: 'slide' }, placeRight: Boolean },
  data: () => ({ open: false }),
  methods: {
    toggle() { this.open = !this.open; },
    onOutside(e) { if (!this.$el.contains(e.target)) this.open = false; },
  },
  mounted() { document.addEventListener('click', this.onOutside); },
  beforeUnmount() { document.removeEventListener('click', this.onOutside); },
  template: /*html*/`
    <div class="element" style="position:relative">
      <a href="#" class="dropdown-toggle" @click.prevent.stop="toggle"><slot name="toggle" /></a>
      <Transition :name="'dd-' + effect">
        <ul v-show="open" class="dropdown-menu open" :class="{ 'place-right': placeRight }" @click="open = false">
          <slot />
        </ul>
      </Transition>
    </div>`,
};
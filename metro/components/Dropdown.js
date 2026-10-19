// The old version put the `open` class on the <ul> permanently. Metro's CSS has
// `.dropdown-menu.open { display:block !important }`, which beat v-show forever.
// Now visibility is controlled only by v-show (inline display), no `open` class.
export default {
  props: {
    effect: { type: String, default: 'slide' },
    placeRight: Boolean,
    closeOnSelect: { type: Boolean, default: true },
  },
  emits: ['open', 'close'],
  data: () => ({ open: false }),
  watch: {
    open(v) { this.$emit(v ? 'open' : 'close'); },
  },
  methods: {
    toggle() { this.open = !this.open; },
    onOutside(e) { if (this.open && !this.$el.contains(e.target)) this.open = false; },
    onKey(e) { if (e.key === 'Escape') this.open = false; },
    onMenuClick(e) {
      if (e.target.closest('li.disabled')) return;
      if (this.closeOnSelect) this.open = false;
    },
  },
  mounted() {
    document.addEventListener('click', this.onOutside);
    document.addEventListener('keydown', this.onKey);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onOutside);
    document.removeEventListener('keydown', this.onKey);
  },
  // No @click.stop on the toggle: other dropdowns need to see the click to close themselves.
  template: /*html*/`
    <div class="element" style="position:relative">
      <a href="#" class="dropdown-toggle" @click.prevent="toggle"><slot name="toggle" /></a>
      <Transition :name="'dd-' + effect">
        <ul v-show="open" class="dropdown-menu" :class="{ 'place-right': placeRight }"
          style="display:block" @click="onMenuClick">
          <slot />
        </ul>
      </Transition>
    </div>`,
};
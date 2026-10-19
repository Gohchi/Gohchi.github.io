export default {
  props: {
    text: String,
    position: { type: String, default: 'top' },      // top | bottom | left | right
    background: { type: String, default: 'bg-cyan' }, // metro class or #hex
    color: { type: String, default: 'fg-white' },
    mode: { type: String, default: 'click' },         // click | hover
    timeout: { type: Number, default: 3000 },
    shadow: { type: Boolean, default: true },
  },
  data: () => ({ show: false, pos: {}, timer: null }),
  computed: {
    marker() {
      return { left: 'marker-on-right', right: 'marker-on-left', bottom: 'marker-on-top' }[this.position] || 'marker-on-bottom';
    },
    cls() {
      const c = [this.marker, { shadow: this.shadow }];
      if (this.background[0] !== '#') c.push(this.background);
      if (this.color[0] !== '#') c.push(this.color);
      return c;
    },
    colors() {
      return {
        backgroundColor: this.background[0] === '#' ? this.background : null,
        color: this.color[0] === '#' ? this.color : null,
      };
    },
  },
  methods: {
    async open() {
      if (this.show) return;
      this.show = true;
      await this.$nextTick();
      this.place();
      clearTimeout(this.timer);
      if (this.timeout) this.timer = setTimeout(this.close, this.timeout);
    },
    close() { this.show = false; clearTimeout(this.timer); },
    place() {
      const tip = this.$refs.tip;
      if (!tip) return;
      const h = this.$refs.host.getBoundingClientRect();
      const w = tip.offsetWidth, ht = tip.offsetHeight;
      let top, left;
      if (this.position === 'top') { top = h.top - ht - 10; left = h.left + h.width / 2 - w / 2; }
      else if (this.position === 'bottom') { top = h.bottom + 10; left = h.left + h.width / 2 - w / 2; }
      else if (this.position === 'right') { top = h.top + h.height / 2 - ht / 2; left = h.right + 10; }
      else { top = h.top + h.height / 2 - ht / 2; left = h.left - w - 10; }
      this.pos = { top: top + 'px', left: left + 'px' };
    },
  },
  mounted() { window.addEventListener('scroll', this.place, true); },
  beforeUnmount() { window.removeEventListener('scroll', this.place, true); clearTimeout(this.timer); },
  template: /*html*/`
    <span ref="host" style="display:inline-block"
      @click="mode === 'click' && open()" @mouseenter="mode === 'hover' && open()">
      <slot />
      <Teleport to="body">
        <div v-if="show" class="metro">
          <div ref="tip" class="notice" :class="cls" :style="{ ...colors, ...pos, position: 'fixed' }">
            <div><slot name="text">{{ text }}</slot></div>
          </div>
        </div>
      </Teleport>
    </span>`,
};
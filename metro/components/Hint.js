// Tooltip. Teleported inside a `.metro` wrapper so the scoped CSS (.metro .hint) applies.
export default {
  props: {
    text: String,
    title: String,
    position: { type: String, default: 'bottom' },   // top | bottom | left | right
    background: { type: String, default: '#FFFCC0' },
    border: String,
    shadow: Boolean,
    mode: { type: Number, default: 1 },              // 2 = arrow centered
  },
  data: () => ({ show: false, pos: {} }),
  methods: {
    async open() { this.show = true; await this.$nextTick(); this.place(); },
    place() {
      const tip = this.$refs.tip;
      if (!tip) return;
      const h = this.$refs.host.getBoundingClientRect();
      const w = tip.offsetWidth, ht = tip.offsetHeight, c = this.mode === 2;
      const p = {};
      if (this.position === 'top') { p.top = h.top - ht - 20; p.left = c ? h.left + h.width / 2 - w / 2 : h.left; }
      else if (this.position === 'bottom') { p.top = h.bottom; p.left = c ? h.left + h.width / 2 - w / 2 : h.left; }
      else if (this.position === 'right') { p.top = c ? h.top + h.height / 2 - ht / 2 - 10 : h.top - 10; p.left = h.right + 15; }
      else { p.top = c ? h.top + h.height / 2 - ht / 2 - 10 : h.top - 10; p.left = h.left - w - 10; }
      this.pos = { top: p.top + 'px', left: p.left + 'px' };
    },
  },
  template: /*html*/`
    <span ref="host" style="display:inline-block" @mouseenter="open" @mouseleave="show = false">
      <slot />
      <Teleport to="body">
        <div v-if="show" class="metro">
          <div ref="tip" :class="[mode === 2 ? 'hint2' : 'hint', position, { shadow }]"
            :style="{ ...pos, display: 'block', backgroundColor: background, borderColor: border }">
            <div v-if="title" class="hint-title">{{ title }}</div>
            <div class="hint-text"><slot name="text">{{ text }}</slot></div>
          </div>
        </div>
      </Teleport>
    </span>`,
};
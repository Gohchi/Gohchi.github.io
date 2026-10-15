import Tile from './Tile.js';

export default {
  components: { Tile },
  props: {
    frames: { type: Array, required: true },       // [{ type: 'image'|'image-set', images: [...] }]
    period: { type: Number, default: 4000 },
    effect: { type: String, default: 'slideLeft' }, // slideLeft | slideRight | slideUp | slideDown
    size: String,
  },
  data: () => ({ index: 0, timer: null }),
  methods: {
    start() { this.stop(); this.timer = setInterval(() => this.index = (this.index + 1) % this.frames.length, this.period); },
    stop() { clearInterval(this.timer); },
    frameStyle(i) {
      const active = i === this.index;
      const axis = /Left|Right/.test(this.effect) ? 'X' : 'Y';
      const sign = /Left|Up/.test(this.effect) ? -1 : 1;
      return {
        display: 'block',
        transform: `translate${axis}(${active ? 0 : sign * 100}%)`,
        transition: 'transform .7s ease',
        zIndex: active ? 1 : 0,
      };
    },
  },
  mounted() { if (this.frames.length > 1) this.start(); },
  beforeUnmount() { this.stop(); },
  template: /*html*/`
    <Tile :size="size" :selectable="false" @mouseenter="stop" @mouseleave="start">
      <div v-for="(f, i) in frames" :key="i" class="tile-content" :class="f.type" :style="frameStyle(i)">
        <img v-for="src in f.images" :key="src" :src="src">
      </div>
    </Tile>`,
};
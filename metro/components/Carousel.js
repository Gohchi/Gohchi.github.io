export default {
  props: {
    slides: { type: Array, default: () => [] },       // ['img.jpg'] or [{ src }]
    auto: { type: Boolean, default: true },
    period: { type: Number, default: 2000 },
    duration: { type: Number, default: 500 },
    effect: { type: String, default: 'slide' },       // slide | fade | switch
    direction: { type: String, default: 'left' },
    controls: { type: Boolean, default: true },
    markers: { type: Boolean, default: true },
    markerType: { type: String, default: 'default' }, // default | cycle | square
    markerPosition: { type: String, default: 'bottom-left' },
    height: { type: [Number, String], default: 300 },
    stopOnHover: { type: Boolean, default: true },
  },
  data: () => ({ index: 0, timer: null }),
  computed: {
    h() { return typeof this.height === 'number' ? this.height + 'px' : this.height; },
    markerStyle() {
      const [v, hz] = this.markerPosition.split('-');
      const s = {};
      if (v === 'top') { s.top = '10px'; s.bottom = 'auto'; }
      if (hz === 'right') { s.right = '10px'; s.left = 'auto'; }
      if (hz === 'center') { s.left = '50%'; s.transform = 'translateX(-50%)'; }
      return s;
    },
  },
  methods: {
    go(delta) { this.index = (this.index + delta + this.slides.length) % this.slides.length; },
    to(i) { this.index = i; },
    start() {
      this.stop();
      if (this.auto && this.slides.length > 1) {
        this.timer = setInterval(() => this.go(this.direction === 'left' ? 1 : -1), this.period);
      }
    },
    stop() { clearInterval(this.timer); },
    slideStyle(i) {
      const active = i === this.index;
      const t = `${this.duration}ms`;
      if (this.effect === 'switch') return { display: active ? 'block' : 'none' };
      if (this.effect === 'fade') return { display: 'block', opacity: active ? 1 : 0, transition: `opacity ${t}`, zIndex: active ? 1 : 0 };
      return { display: 'block', transform: `translateX(${(i - this.index) * 100}%)`, transition: `transform ${t} ease` };
    },
  },
  mounted() { this.start(); },
  beforeUnmount() { this.stop(); },
  template: /*html*/`
    <div class="carousel" :style="{ height: h }"
      @mouseenter="stopOnHover && stop()" @mouseleave="stopOnHover && start()">
      <div v-for="(s, i) in slides" :key="i" class="slide" :style="slideStyle(i)">
        <slot name="slide" :slide="s" :index="i"><img class="cover" :src="s.src || s"></slot>
      </div>
      <template v-if="controls && slides.length > 1">
        <a class="controls left" @click="go(-1)">&lsaquo;</a>
        <a class="controls right" @click="go(1)">&rsaquo;</a>
      </template>
      <div v-if="markers && slides.length > 1" class="markers" :class="markerType" :style="markerStyle">
        <ul><li v-for="(s, i) in slides" :key="i" :class="{ active: i === index }">
          <a href="javascript:void(0)" @click="to(i)"></a>
        </li></ul>
      </div>
    </div>`,
};
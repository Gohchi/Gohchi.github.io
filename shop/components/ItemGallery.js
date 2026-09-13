export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    alt: {
      type: String,
      default: '',
    },
    aspect: {
      type: String,
      default: 'aspect-video', // pass 'aspect-square' etc. from the parent when needed
    },
  },
  data() {
    return {
      index: 0,
    };
  },
  watch: {
    images() {
      this.index = 0;
    },
  },
  computed: {
    hasImages() {
      return this.images && this.images.length > 0;
    },
    current() {
      return this.hasImages ? this.images[this.index] : './images/no-image.svg';
    },
  },
  methods: {
    prev() {
      if (!this.hasImages) return;
      this.index = (this.index - 1 + this.images.length) % this.images.length;
    },
    next() {
      if (!this.hasImages) return;
      this.index = (this.index + 1) % this.images.length;
    },
  },
  template: /*html*/`
    <div class="relative">
      <img
        :src="current"
        :alt="alt"
        :class="[aspect, hasImages ? 'object-cover' : 'object-contain bg-zinc-800 p-10']"
        class="w-full rounded-2xl"
      />

      <template v-if="images.length > 1">
        <button
          @click.stop="prev"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full w-8 h-8 flex items-center justify-center text-sm cursor-pointer"
          aria-label="Previous photo"
        >&#8249;</button>

        <button
          @click.stop="next"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 rounded-full w-8 h-8 flex items-center justify-center text-sm cursor-pointer"
          aria-label="Next photo"
        >&#8250;</button>

        <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          <span
            v-for="(img, i) in images"
            :key="i"
            class="w-1.5 h-1.5 rounded-full"
            :class="i === index ? 'bg-white' : 'bg-white/40'"
          ></span>
        </div>
      </template>

      <div v-if="!hasImages" class="absolute bottom-2 left-0 right-0 text-center text-xs text-zinc-500">
        No photo yet
      </div>
    </div>
  `,
};

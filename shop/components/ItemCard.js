import ItemGallery from './ItemGallery.js';
import { statuses } from '../data/categories.js';

export default {
  components: { ItemGallery },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    return {
      select: () => emit('select', props.item.id),
    };
  },
  computed: {
    statusLabel() {
      return statuses[this.item.status] || this.item.status;
    },
    priceLabel() {
      if (this.item.price == null) return 'Make an offer';
      return `${this.item.currency === 'ARS' ? 'AR$' : '$'}${this.item.price}`;
    },
  },
  template: /*html*/`
    <article
      class="group rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition-colors cursor-pointer"
      :class="{ 'opacity-60': item.status === 'sold' }"
      @click="select()"
    >
      <div class="relative">
        <ItemGallery :images="item.images" :alt="item.title" />

        <span
          v-if="item.status !== 'available'"
          class="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full bg-black/80 border border-white/10"
        >
          {{ statusLabel }}
        </span>
      </div>

      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-medium leading-snug">{{ item.title }}</h3>
          <span class="text-sm text-zinc-300 whitespace-nowrap">{{ priceLabel }}</span>
        </div>

        <p v-if="item.subtype" class="text-xs text-zinc-500 mt-1">{{ item.subtype }}</p>
      </div>
    </article>
  `,
};

import ItemGallery from './ItemGallery.js';
import { conditions, statuses } from '../data/categories.js';

export default {
  components: { ItemGallery },
  props: {
    item: {
      type: Object,
      required: true,
    },
    contactEmail: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    return {
      close: () => emit('close'),
    };
  },
  computed: {
    conditionLabel() {
      return conditions[this.item.condition] || this.item.condition;
    },
    statusLabel() {
      return statuses[this.item.status] || this.item.status;
    },
    priceLabel() {
      if (this.item.price == null) return 'Make an offer';
      return `${this.item.currency === 'ARS' ? 'AR$' : '$'}${this.item.price}`;
    },
    mailHref() {
      if (!this.contactEmail) return null;
      const subject = encodeURIComponent(`Interested in: ${this.item.title}`);
      return `mailto:${this.contactEmail}?subject=${subject}`;
    },
  },
  template: /*html*/`
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close()">
      <div class="absolute inset-0 bg-black/70"></div>

      <div class="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <button
          @click="close()"
          class="absolute top-4 right-4 bg-black/70 hover:bg-black/90 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
          aria-label="Close"
        >&times;</button>

        <div class="grid md:grid-cols-2 gap-6">
          <ItemGallery :images="item.images" :alt="item.title" aspect="aspect-square" />

          <div>
            <p v-if="item.subtype" class="text-xs uppercase tracking-wide text-zinc-500 mb-1">{{ item.subtype }}</p>
            <h2 class="text-2xl font-semibold mb-3">{{ item.title }}</h2>

            <div class="flex items-center gap-3 mb-4">
              <span class="text-lg text-white">{{ priceLabel }}</span>
              <span
                class="text-xs font-medium px-2 py-1 rounded-full border"
                :class="item.status === 'available' ? 'border-emerald-700 text-emerald-400' : 'border-zinc-700 text-zinc-400'"
              >{{ statusLabel }}</span>
            </div>

            <p class="text-sm text-zinc-300 leading-relaxed mb-4">{{ item.description }}</p>

            <dl class="text-sm text-zinc-400 space-y-1 mb-6">
              <div class="flex gap-2">
                <dt class="text-zinc-500">Condition:</dt>
                <dd>{{ conditionLabel }}</dd>
              </div>
            </dl>

            <a
              v-if="mailHref && item.status === 'available'"
              :href="mailHref"
              class="inline-flex items-center justify-center rounded-2xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Ask about this item
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
};

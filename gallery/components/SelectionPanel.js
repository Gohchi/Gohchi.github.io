export default {
  template: /*html*/`
    <div class="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="font-medium text-lg">Selection Cart</h3>
          <p class="text-sm text-zinc-500 mt-1">
            Shareable hash selection
          </p>
        </div>

        <div class="text-right">
          <div class="text-2xl font-semibold">
            {{ totalItems }}
          </div>

          <div class="text-xs text-zinc-500">
            total items
          </div>
        </div>
      </div>

      <div class="bg-black rounded-2xl p-3 text-xs break-all text-zinc-400 border border-zinc-800 mb-5">
        #{{ shareHash }}
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="item in selectedImages"
          :key="item.id"
          class="relative overflow-hidden rounded-2xl border border-zinc-800 group"
        >
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div class="absolute top-2 right-2">
            <div class="bg-black/80 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 flex items-center justify-center text-xs font-medium">
              &times; {{ item.qty }}
            </div>
          </div>

          <div class="absolute bottom-0 left-0 right-0 p-3">
            <h4 class="text-sm font-medium truncate">
              {{ item.title }}
            </h4>

            <p class="text-xs text-zinc-400 truncate mt-1">
              {{ item.show }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    selectedImages: {
      type: Array,
      required: true,
    },
  },
  computed: {
    totalItems() {
      return this._.props.selectedImages.reduce((sum, { qty }) => sum + qty, 0);
    },
    shareHash() {
      return this._.props.selectedImages
        .map(({ id, qty }) => `${id}:${qty}`)
        .join(',');
    },
  },
};
import { ref, watch } from 'vue';

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

      <!--div class="bg-black rounded-2xl p-3 text-xs break-all text-zinc-400 border border-zinc-800 mb-5">
        {{ shareHash }}
      </div-->

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="item in lastThreeSelections"
          :key="item.id"
          class="relative overflow-hidden rounded-2xl border border-zinc-800 group"
        >
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div class="absolute top-2 right-2 flex gap-2 group">
            <button
              @click.stop="removeAll(item.id)"
              class="bg-black/80 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 items-center justify-center text-xs font-medium cursor-pointer"
            >
              &times;
            </button>

            <button
              @click.stop="removeOne(item.id)"
              class="bg-black/80 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 items-center justify-center text-xs font-medium cursor-pointer"
            >
              -1
            </button>

            <div
              class="bg-black/30 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 flex items-center justify-center text-xs font-medium"
            >
              &times; {{ item.qty }}
            </div>
          </div>

          <div
            class="absolute bottom-0 left-0 right-0 p-3"
            @click.stop="selectImage(item.id)"
          >
            <h4 class="text-sm font-medium truncate cursor-pointer">
              {{ item.title }}
            </h4>

            <p class="text-xs text-zinc-400 truncate mt-1 cursor-pointer">
              {{ item.show }}
            </p>
          </div>
        </div>

        
        <div v-if="selectedImages.length > 3"
          class="relative overflow-hidden rounded-2xl border border-zinc-800 group cursor-pointer"
          @click.stop="more()"
        >
          <img
            src="./images/more.png"
            alt="more"
            class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        
      </div>
    </div>
  `,
  props: {
    selectedImages: {
      type: Array,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedImages = ref(props.selectedImages);

    watch(
      () => props.selectedImages,
      (value) => {
        selectedImages.value = value;
      },
      { deep: true }
    );

    return {
      selectedImages,
      selectImage: id => emit('selectImage', id),
      removeAll: id => emit('removeAll', id),
      removeOne: id => emit('removeOne', id),
    };
  },
  computed: {
    shareHash() {
      return this.selectedImages
        .map(({ id, qty }) => `${id}:${qty}`)
        .join(',');
    },
    lastThreeSelections() {
      const currentImage = this.selectedImages[this.selectedImages.length - 1];

      if (!currentImage) return [];
      return this.selectedImages.slice(-3).reverse();
    }
  },
};
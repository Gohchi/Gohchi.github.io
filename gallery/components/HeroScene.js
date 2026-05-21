import { ref, watch } from 'vue';

export default {
  template: /*html*/`
    <div class="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 h-[50vh] md:h-[45rem]">
      <img
        :src="scene.image"
        :alt="scene.title"
        class="w-full h-[30vh] md:h-[70vh] object-cover"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black via-black via-30% md:via-15% to-transparent" />

      <div class="absolute top-2 right-2 flex gap-2 group">
        <button v-if="qty > 0"
          @click.stop="removeAll(scene.id)"
          class="bg-black/80 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 items-center justify-center text-xs font-medium cursor-pointer"
        >
          &times;
        </button>

        <button v-if="qty > 0"
          @click.stop="removeOne(scene.id)"
          class="bg-black/80 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 items-center justify-center text-xs font-medium cursor-pointer"
        >
          -1
        </button>

        <div v-if="qty > 0"
          class="bg-black/30 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 flex items-center justify-center text-xs font-medium"
        >
          &times; {{ qty }}
        </div>

        <button
          @click.stop="addOne(scene.id)"
          class="bg-black/80 backdrop-blur border border-white/10 rounded-full min-w-7 h-7 px-2 items-center justify-center text-xs font-medium cursor-pointer"
        >
          +1
        </button>
      </div>
      
      <div class="absolute bottom-0 left-0 right-0 p-8">
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="tag in scene.visualTags"
            :key="tag"
            class="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur"
          >
            {{ tag }}
          </span>
        </div>

        <h2 class="text-4xl font-semibold tracking-tight mb-2">
          {{ scene.title }}
        </h2>

        <div class="flex flex-wrap gap-4 text-zinc-300 text-sm">
          <span>{{ scene.show }}</span>
          <span>{{ scene.year }}</span>
          <span>{{ scene.director }}</span>
        </div>
      </div>
    </div>
  `,
  props: {
    scene: {
      type: Object,
      required: true,
    },
    selectedImages: {
      type: Array,
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
      addOne: id => emit('addOne', id),
    };
  },
  computed: {
    qty() {
      return this.selectedImages[this.scene.id];
    }
  },
};
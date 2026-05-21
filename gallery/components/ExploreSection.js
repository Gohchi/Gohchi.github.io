export default {
  template: /*html*/`
    <section class="mt-12">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-2xl font-semibold tracking-tight">
            Explore Frames
          </h3>

          <p class="text-zinc-500 mt-1 text-sm">
            Browse by mood, color, framing and visual language.
          </p>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <article
          v-for="img in images"
          :key="img.id"
          class="group overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer"
          @click.stop="selectImage(img.id)"
        >
          <div class="overflow-hidden">
            <img
              :src="img.image"
              :alt="img.title"
              class="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          <div class="p-5">
            <div class="flex items-center justify-between gap-4">
              <h4 class="font-medium truncate">
                {{ img.title }}
              </h4>

              <span class="text-xs text-zinc-500">
                {{ img.year }}
              </span>
            </div>

            <p class="text-sm text-zinc-400 mt-1">
              {{ img.show }}
            </p>

            <div class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="tag in img.visualTags"
                :key="tag"
                class="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    return {
      selectImage: id => emit('selectImage', id),
    };
  },
};
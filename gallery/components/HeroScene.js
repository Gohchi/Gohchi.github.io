export default {
  template: /*html*/`
    <div class="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
      <img
        :src="scene.image"
        :alt="scene.title"
        class="w-full h-[70vh] object-cover"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

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
  },
};
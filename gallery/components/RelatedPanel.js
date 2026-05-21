export default {
  template: /*html*/`
    <div class="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-medium text-lg">Related</h3>
        <span class="text-xs text-zinc-500">Metadata graph</span>
      </div>

      <div class="space-y-4">
        <div
          v-for="img in related"
          :key="img.id"
          class="group flex gap-4 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <img
            :src="img.image"
            :alt="img.title"
            class="w-32 h-24 object-cover"
          />

          <div class="py-3 pr-3 flex-1 min-w-0">
            <div class="flex items-center justify-between gap-3">
              <h4 class="font-medium truncate">
                {{ img.title }}
              </h4>

              <span class="text-xs text-zinc-500">
                {{ img.score }}
              </span>
            </div>

            <p class="text-sm text-zinc-400 mt-1 truncate">
              {{ img.show }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    related: {
      type: Array,
      required: true,
    },
  },
};

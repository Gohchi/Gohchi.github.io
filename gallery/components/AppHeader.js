export default {
  template: /*html*/`
    <header class="border-b border-zinc-800 sticky top-0 z-20 backdrop-blur bg-zinc-950/80">
      <div class="max-w-7xl mx-auto px-6 py-4 block md:flex items-center justify-between gap-4 h-[11vh]">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">
            DatSin
          </h1>

          <p class="text-sm text-zinc-400 mt-1">
            Cinematic frame archive
          </p>
        </div>

        <div class="absolute right-5 top-5 flex md:hidden items-center gap-2">
          <button class="md:invisible rounded-xl bg-zinc-900 border border-zinc-800 p-2 text-zinc-200 hover:bg-zinc-800 transition"
            @click.stop="goHome()"
          >
            <span class="sr-only">go home</span>
            🏠
          </button>

          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
            mode="out-in"
          >
            <button
              :key="totalItems"
              class="md:invisible rounded-xl bg-zinc-900 border border-zinc-800 p-2 text-zinc-200 hover:bg-zinc-800 transition"
              @click.stop="swapCart()"
            >
              <span class="sr-only">Open cart</span>
              {{ totalItems }} 🛒
            </button>
          </Transition>

          <button class="md:invisible rounded-xl bg-zinc-900 border border-zinc-800 p-2 text-zinc-200 hover:bg-zinc-800 transition"
            @click.stop="explore()"
          >
            <span class="sr-only">Explore</span>
            🔍
          </button>
        </div>
        <div class="invisible md:visible items-center gap-3">
          <input
            placeholder="Search mood, director, color..."
            class="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm w-72 outline-none focus:border-zinc-600"
            @focus="onFocusExplore()"
          />

          <button class="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
            Explore
          </button>
        </div>
      </div>
    </header>
  `,
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    showCart: {
      type: Boolean,
      required: true,
    },
    exploring: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    return {
      goHome: () => emit('goHome'),
      swapCart: () => emit('swapCart'),
      explore: () => emit('explore'),
      onFocusExplore: () => emit('onFocusExplore'),
    };
  }
}
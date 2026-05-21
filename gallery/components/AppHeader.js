export default {
  template: /*html*/`
    <header class="border-b border-zinc-800 sticky top-0 z-20 backdrop-blur bg-zinc-950/80">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">
            DatSin
          </h1>

          <p class="text-sm text-zinc-400 mt-1">
            Cinematic frame archive
          </p>
        </div>

        <div class="flex items-center gap-3">
          <input
            placeholder="Search mood, director, color..."
            class="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm w-72 outline-none focus:border-zinc-600"
          />

          <button class="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
            Explore
          </button>
        </div>
      </div>
    </header>
  `,
}
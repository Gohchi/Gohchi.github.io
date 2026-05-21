export default /*html*/`
  <template v-if="true">
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <AppHeader />

      <main class="max-w-7xl mx-auto px-6 py-8">
        <section class="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
          <HeroScene :scene="featured" />

          <aside class="space-y-6">
            <SelectionPanel :selectedImages="selectedImages" />

            <RelatedPanel
              :related="related"
            />
          </aside>
        </section>

        <ExploreSection
          :images="movies"
        />
      </main>
      <AppFooter />
    </div>
  </template>
`;
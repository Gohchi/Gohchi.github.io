export default /*html*/`
  <template v-if="true">
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <AppHeader />

      <main id="main" class="max-w-7xl mx-auto px-6 py-8">
        <section class="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
          <HeroScene :scene="featured"
            :selectedImages="selection"
            @removeAll="removeAll"
            @removeOne="removeOne"
            @addOne="addOne"
          />

          <aside class="space-y-6">
            <SelectionPanel
              :selectedImages="selectedImages"
              @selectImage="selectImage"
              @removeAll="removeAll"
              @removeOne="removeOne"
            />

            <RelatedPanel
              :related="related"
              @selectImage="selectImage"
            />
          </aside>
        </section>

        <ExploreSection
          :images="movies"
          @selectImage="selectImage"
        />
      </main>
      <AppFooter />
    </div>
  </template>
`;
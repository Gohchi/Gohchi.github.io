export default /*html*/`
  <template v-if="true">
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <AppHeader
        :totalItems="totalItems"
        :showCart="showCart"
        :exploring="exploring"
        @goHome="showCart = false; exploring = false"
        @swapCart="showCart = !showCart; exploring = false"
        @explore="exploring = !exploring; showCart = false"
        @onFocusExplore="scrollToExplore"
      />

      <main id="main" class="max-w-7xl mx-auto px-6 py-8">
        <section
          v-if="!exploring"
          class="grid lg:grid-cols-[1.6fr_0.9fr] gap-6 mb-12"
        >
          <HeroScene
            v-if="isDesktop || !showCart"
            :scene="featured"
            :selectedImages="selection"
            @removeAll="removeAll"
            @removeOne="removeOne"
            @addOne="addOne"
          />

          <aside class="space-y-6">
            <SelectionPanel
              v-if="isDesktop || showCart"
              :selectedImages="selectedImages"
              :totalItems="totalItems"
              @selectImage="selectImage"
              @removeAll="removeAll"
              @removeOne="removeOne"
            />

            <RelatedPanel
              v-if="isDesktop || !showCart"
              :related="related"
              @selectImage="selectImage"
            />
          </aside>
        </section>

        <ExploreSection
          v-if="isDesktop || !showCart"
          :images="movies"
          @selectImage="selectImage"
        />
      </main>
      <AppFooter />
    </div>
  </template>
`;
export default /*html*/`
  <template v-if="true">
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <AppHeader
        v-model="searchQuery"
        :totalItems="totalItems"
        :showCart="showCart"
        :exploring="exploring"
        @goHome="goHome()"
        @swapCart="swapCart()"
        @explore="explore()"
        @onFocusExplore="scrollToExplore"
        @onSearchChange="onSearchChange"
      />

      <main id="main" class="max-w-7xl mx-auto px-6 py-8">
        <section
          v-if="featured"
          class="grid lg:grid-cols-[1.6fr_0.9fr] gap-6 mb-12"
        >
          <HeroScene
            v-if="isDesktop || !showCart"
            :scene="featured"
            :selectedImages="selection"
            @removeAll="removeAll"
            @removeOne="removeOne"
            @addOne="addOne"
            @close="featured = null"
          />

          <aside class="space-y-6">
            <SelectionPanel
              v-if="isDesktop && selectedImages.length > 0"
              :selectedImages="selectedImages"
              :totalItems="totalItems"
              :showMore="!isDesktop"
              :isDesktop="isDesktop"
              @selectImage="selectImage"
              @removeAll="removeAll"
              @removeOne="removeOne"
              @addOne="addOne"
              @share="share"
              @confirmOrder="confirmOrder"
            />

            <RelatedPanel
              v-if="isDesktop || !showCart"
              :related="related"
              @selectImage="selectImage"
            />
          </aside>
        </section>

        <SelectionPanel
          v-if="showCart"
          :selectedImages="selectedImages"
          :totalItems="totalItems"
          :showMore="true"
          :isDesktop="isDesktop"
          @selectImage="selectImage"
          @removeAll="removeAll"
          @removeOne="removeOne"
          @addOne="addOne"
          @share="share"
          @confirmOrder="confirmOrder"
          @removeAllFromCart="removeAllFromCart"
        />

        <ExploreSection
          v-if="isDesktop || !showCart"
          :images="moviesFiltered"
          @selectImage="selectImage"
        />
      </main>
      <Notifications
        v-if="notification"
        :notification="notification"
        @close="notification = null"
      />
      <AppFooter />
    </div>
  </template>
`;
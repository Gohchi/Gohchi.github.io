export default /*html*/`
  <template v-if="true">
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <AppHeader />

      <main class="max-w-6xl mx-auto px-6 py-8">
        <FilterBar
          v-model="selectedType"
          :searchQuery="searchQuery"
          @update:searchQuery="searchQuery = $event"
          :hideSold="hideSold"
          @update:hideSold="hideSold = $event"
        />

        <p v-if="filteredItems.length === 0" class="text-zinc-500 text-sm">
          No items match those filters.
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @select="openItem"
          />
        </div>
      </main>

      <AppFooter />

      <ItemDetail
        v-if="selectedItem"
        :item="selectedItem"
        :contactEmail="contactEmail"
        @close="closeItem"
      />
    </div>
  </template>
`;

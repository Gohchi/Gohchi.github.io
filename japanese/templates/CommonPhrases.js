export default /*html*/`
  <div class="common-phrases">
    <MainHeader
      title="COMMON PHRASES"
      @onChangeFurigana="furiganaStore.switchFurigana()"
    >
      <PhraseToRuby zoom :text="'一般的なフレーズ'"></PhraseToRuby>
    </MainHeader>

    <main>
      <template v-if="!phrase">
        <div class="filters">
          <input
            type="search"
            v-model="queryText"
            placeholder="Search Japanese or English..."
          />
          <div class="level-filter">
            <button
              v-for="level in allLevels" :key="level"
              :class="{ active: selectedLevels.includes(level) }"
              @click="toggleLevel(level)"
            >{{ level }}</button>
          </div>
          <button
            class="favorites-toggle"
            :class="{ active: favoritesOnly }"
            @click="favoritesOnly = !favoritesOnly"
          >★ Favorites only</button>
        </div>

        <template v-if="filteredPhrases.length === 0">
          <article class="unknown">
            <h1 class="title">Empty list</h1>
            <h2 class="subtitle">Clear filters to see more items</h2>
            <button class="go-back" @click.prevent="clearFilters()">Clear filters</button>
          </article>
        </template>

        <ul class="phrase-list">
          <li
            v-for="item in filteredPhrases" :key="item.id"
            class="phrase-preview"
          >
            <div class="phrase-preview-content" @click="selectPhrase(item.id)">
              <h3 class="phrase-preview-title"><PhraseToRuby :text="item.japanese"></h3>
              <p class="phrase-preview-subtitle">{{ item.english }}</p>
              <div class="tag-list">
                <span class="tag tag-jlpt">{{ item.level }}</span>
                <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <button
              class="star-button"
              :class="{ starred: isFavorite(item.id) }"
              @click.stop="toggleFavorite(item.id)"
              :title="isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'"
            >★</button>
          </li>
        </ul>
      </template>

      <template v-else-if="!currentPhrase">
        <article class="unknown">
          <h1 class="title">Unknown phrase</h1>
          <h2 class="subtitle">This phrase doesn't exist.</h2>
          <button class="go-back" @click.prevent="backToList()">Back to phrase list</button>
        </article>
      </template>

      <template v-else>
        <button class="go-back phrase-back" @click.prevent="backToList()">&#8592; Back to phrases</button>

        <article :style="zoomLevel">
          <div class="phrase-detail-header">
            <h1 class="title"><PhraseToRuby :text="currentPhrase.japanese"></h1>
            <button
              class="star-button large"
              :class="{ starred: isFavorite(currentPhrase.id) }"
              @click="toggleFavorite(currentPhrase.id)"
              :title="isFavorite(currentPhrase.id) ? 'Remove from favorites' : 'Add to favorites'"
            >★</button>
          </div>
          <h4 class="subtitle">{{ currentPhrase.english }}</h4>
          <div class="tag-list">
            <span class="tag tag-jlpt">{{ currentPhrase.level }}</span>
            <span v-for="tag in currentPhrase.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <ul v-if="currentPhrase.refs?.length" class="phrase-refs">
            <li v-for="(ref, index) in currentPhrase.refs" :key="index">{{ ref }}</li>
          </ul>
        </article>

        <section v-if="relatedPhrases.length" class="related-phrases">
          <h3>Related phrases</h3>
          <ul>
            <li
              v-for="related in relatedPhrases" :key="related.id"
              @click="selectPhrase(related.id)"
            >
              <span class="related-title"><PhraseToRuby :text="related.japanese"></span>
              <span class="related-english">{{ related.english }}</span>
              <div class="tag-list">
                <span class="tag tag-jlpt">{{ related.level }}</span>
                <span v-for="tag in related.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </li>
          </ul>
        </section>
      </template>
    </main>
    <footer v-if="currentPhrase?.japanese">
      <div class="actions">
        <button
          class="voice-active"
          title="voice"
          @click="speak(currentPhrase.japanese)"
        >
          <span>🗣️ Listen</span>
        </button>
      </div>
    </footer>
  </div>
`;
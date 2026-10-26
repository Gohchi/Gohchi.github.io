export default /*html*/`
  <div class="common-phrases">
    <MainHeader
      title="COMMON PHRASES"
    >
      <PhraseToRuby class="phrases-header-jp" zoom :text="'一般的なフレーズ'"></PhraseToRuby>

      <div v-if="!phrase" class="keyboard-toolbar-buttons topics-toolbar">
        <button
          type="button"
          class="topics-search-toggle"
          :class="{ open: searchOpen }"
          title="Search phrases"
          aria-label="Search phrases"
          :aria-expanded="searchOpen"
          @click.stop="toggleSearch"
        >
          🔍
          <span v-if="activeFilterCount" class="topics-badge">{{ activeFilterCount }}</span>
        </button>

        <div class="topics-search" :class="{ open: searchOpen }">
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            class="topics-search-input"
            placeholder="Search Japanese or English..."
            aria-label="Search phrases"
            autocomplete="off"
            enterkeyhint="search"
            @keydown.enter="onSearchEnter"
            @keydown.esc="onSearchEscape"
          />
          <FilterMenu
            label="Search in"
            title="Where to search"
            :options="scopeOptions"
            :modelValue="searchScope"
            @update:modelValue="setScope"
          />
          <FilterMenu
            label="JLPT"
            title="JLPT levels"
            :options="levelOptions"
            :modelValue="selectedLevels"
            @update:modelValue="setLevels"
          />
          <button
            v-if="activeFilterCount"
            type="button"
            class="topics-clear"
            title="Clear filters"
            aria-label="Clear filters"
            @click="clearFilters()"
          >✕</button>
        </div>
      </div>
    </MainHeader>

    <main>
      <!-- ================= LIST ================= -->
      <template v-if="!phrase">
        <div class="topic-filters" role="tablist" aria-label="Categories">
          <button
            v-for="option in categoryOptions" :key="option.key"
            type="button"
            role="tab"
            class="topic-chip"
            :class="{ on: category === option.key }"
            :aria-selected="category === option.key"
            @click="category = option.key"
          >
            {{ option.label }}
            <span class="count">{{ option.count }}</span>
          </button>
        </div>

        <div class="topic-summary">
          <span v-if="activeFilterCount">{{ filteredPhrases.length }} / {{ allPhrases.length }} phrases</span>
          <span v-else>{{ allPhrases.length }} phrases</span>
          <span v-if="favorites.length">★ {{ favorites.length }} saved</span>
        </div>

        <article v-if="filteredPhrases.length === 0" class="unknown">
          <h1 class="title">Empty list</h1>
          <h2 class="subtitle">Clear filters to see more items</h2>
          <button class="go-back" @click.prevent="clearFilters()">Clear filters</button>
        </article>

        <ul class="topic-list">
          <li
            v-for="card in cards" :key="card.id"
            class="topic-preview"
            :class="'lvl-' + card.level"
            tabindex="0"
            role="link"
            @click="selectPhrase(card.id)"
            @keydown.enter="selectPhrase(card.id)"
          >
            <div class="topic-preview-top">
              <span class="topic-kind">💬 Phrase<template v-if="card.primaryTag"> · {{ tagLabel(card.primaryTag) }}</template></span>
              <button
                type="button"
                class="star-button"
                :class="{ starred: card.favorite }"
                :title="card.favorite ? 'Remove from favorites' : 'Add to favorites'"
                :aria-label="card.favorite ? 'Remove from favorites' : 'Add to favorites'"
                :aria-pressed="card.favorite"
                @click.stop="toggleFavorite(card.id)"
              >★</button>
              <span v-if="card.level" class="level-pill" :class="'lv-' + card.level">{{ card.level }}</span>
            </div>

            <h3 class="topic-preview-title phrase-title">
              <PhraseToRuby :text="card.japanese"></PhraseToRuby>
            </h3>

            <p class="topic-preview-subtitle">{{ card.english }}</p>

            <div v-if="card.extraTags.length" class="tag-list">
              <span v-for="tag in card.extraTags" :key="tag" class="tag">{{ tagLabel(tag) }}</span>
            </div>
          </li>
        </ul>
      </template>

      <!-- ================= UNKNOWN ================= -->
      <template v-else-if="!currentPhrase">
        <article class="unknown">
          <h1 class="title">Unknown phrase</h1>
          <h2 class="subtitle">This phrase doesn't exist.</h2>
          <button class="go-back" @click.prevent="backToList()">Back to phrase list</button>
        </article>
      </template>

      <!-- ================= DETAIL ================= -->
      <template v-else>
        <div class="topic-bar">
          <button type="button" @click.prevent="backToList()" title="Back to phrases (Esc)">&#8592; Phrases</button>
          <span class="spacer"></span>
          <button
            type="button"
            :disabled="!prevPhrase"
            title="Previous phrase (←)"
            aria-label="Previous phrase"
            @click="prevPhrase && selectPhrase(prevPhrase.id)"
          >&#8249;</button>
          <span v-if="phraseIndex >= 0" class="topic-position">{{ phraseIndex + 1 }} / {{ navList.length }}</span>
          <button
            type="button"
            :disabled="!nextPhrase"
            title="Next phrase (→)"
            aria-label="Next phrase"
            @click="nextPhrase && selectPhrase(nextPhrase.id)"
          >&#8250;</button>
        </div>

        <article class="topic-article" :class="'lvl-' + currentMeta.level" :style="zoomLevel">
          <div class="topic-head">
            <div class="topic-preview-top">
              <span class="topic-kind">💬 Phrase</span>
              <span v-if="currentMeta.level" class="level-pill" :class="'lv-' + currentMeta.level">{{ currentMeta.level }}</span>
            </div>

            <h1 class="topic-title phrase-title">
              <PhraseToRuby :text="currentPhrase.japanese"></PhraseToRuby>
            </h1>

            <p class="topic-lead">{{ currentPhrase.english }}</p>

            <div v-if="currentMeta.tags.length" class="tag-list">
              <span v-for="tag in currentMeta.tags" :key="tag" class="tag">{{ tagLabel(tag) }}</span>
            </div>

            <div class="phrase-actions">
              <button type="button" class="action-pill" @click="speak(currentPhrase.japanese)">🔊 Listen</button>
              <button
                type="button"
                class="action-pill"
                :class="{ on: currentMeta.favorite }"
                :aria-pressed="currentMeta.favorite"
                @click="toggleFavorite(currentPhrase.id)"
              >{{ currentMeta.favorite ? '★ Saved' : '☆ Save' }}</button>
            </div>
          </div>

          <section v-if="currentPhrase.refs?.length" class="topic-section">
            <div class="example-label">Notes</div>
            <ul class="note-list">
              <li v-for="(ref, index) in currentPhrase.refs" :key="index" class="note-item">{{ ref }}</li>
            </ul>
          </section>
        </article>

        <nav class="topic-pager" aria-label="More phrases">
          <button v-if="prevPhrase" type="button" class="pager prev" @click="selectPhrase(prevPhrase.id)">
            <small>&#8592; Previous</small>
            <span>{{ prevPhrase.japanese }}</span>
          </button>
          <button v-if="nextPhrase" type="button" class="pager next" @click="selectPhrase(nextPhrase.id)">
            <small>Next &#8594;</small>
            <span>{{ nextPhrase.japanese }}</span>
          </button>
        </nav>

        <section v-if="relatedPhrases.length" class="related-topics">
          <h3>Related phrases</h3>
          <ul>
            <li
              v-for="related in relatedPhrases" :key="related.id"
              :class="'lvl-' + related.level"
              tabindex="0"
              role="link"
              @click="selectPhrase(related.id)"
              @keydown.enter="selectPhrase(related.id)"
            >
              <span class="related-title">
                <PhraseToRuby :text="related.japanese"></PhraseToRuby>
                <small class="related-english">{{ related.english }}</small>
              </span>
              <span v-if="related.favorite" class="star-button starred" title="Favorite">★</span>
              <span v-if="related.level" class="level-pill" :class="'lv-' + related.level">{{ related.level }}</span>
            </li>
          </ul>
        </section>
      </template>
    </main>
  </div>
`;
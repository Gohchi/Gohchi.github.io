export default /*html*/`
  <div class="topics">
    <MainHeader
      title="TOPICS"
    >
      <PhraseToRuby zoom :text="'話題'"></PhraseToRuby>

      <div v-if="!topic" class="keyboard-toolbar-buttons topics-toolbar">
        <button
          type="button"
          class="topics-search-toggle"
          :class="{ open: searchOpen }"
          title="Search topics"
          aria-label="Search topics"
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
            placeholder="Search topics..."
            aria-label="Search topics"
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
      <template v-if="!topic">
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
            <span class="count">{{ categoryCounts[option.key] }}</span>
          </button>
        </div>

        <div class="topic-summary">
          <span v-if="activeFilterCount">{{ filteredTopics.length }} / {{ topics.length }} topics</span>
          <span v-else>{{ topics.length }} topics</span>
          <span v-if="readCount">
            ✓ {{ readCount }} read ·
            <button type="button" class="linklike" @click="resetRead()">reset</button>
          </span>
        </div>

        <article v-if="filteredTopics.length === 0" class="unknown">
          <h1 class="title">Empty list</h1>
          <h2 class="subtitle">Clear filters to see more items</h2>
          <button class="go-back" @click.prevent="clearFilters()">Clear filters</button>
        </article>

        <ul class="topic-list">
          <li
            v-for="card in cards" :key="card.id"
            class="topic-preview"
            :class="['cat-' + card.category, { read: card.read }]"
            tabindex="0"
            role="link"
            @click="selectTopic(card.id)"
            @keydown.enter="selectTopic(card.id)"
          >
            <div class="topic-preview-top">
              <span class="topic-kind">{{ card.icon }} {{ card.typeLabel }} · {{ card.categoryName }}</span>
              <span v-if="card.read" class="read-mark" title="Read">✓</span>
              <span v-if="card.level" class="level-pill" :class="'lv-' + card.level">{{ card.level }}</span>
            </div>

            <h3 class="topic-preview-title">
              <PhraseToRuby :text="card.main"></PhraseToRuby><span v-if="card.alt" class="alt"> — <PhraseToRuby :text="card.alt"></PhraseToRuby></span>
            </h3>

            <p v-if="card.topic.subtitle" class="topic-preview-subtitle">
              <PhraseToRuby :text="card.topic.subtitle"></PhraseToRuby>
            </p>

            <div v-if="card.extraTags.length" class="tag-list">
              <span v-for="tag in card.extraTags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </li>
        </ul>
      </template>

      <!-- ================= UNKNOWN ================= -->
      <template v-else-if="!currentTopic">
        <article class="unknown">
          <h1 class="title">Unknown topic</h1>
          <h2 class="subtitle">This topic doesn't exist.</h2>
          <button class="go-back" @click.prevent="backToList()">Back to topic list</button>
        </article>
      </template>

      <!-- ================= DETAIL ================= -->
      <template v-else>
        <div class="topic-bar">
          <button type="button" @click.prevent="backToList()" title="Back to topics (Esc)">&#8592; Topics</button>
          <span class="spacer"></span>
          <button
            type="button"
            :disabled="!prevTopic"
            title="Previous topic (←)"
            aria-label="Previous topic"
            @click="prevTopic && selectTopic(prevTopic.id)"
          >&#8249;</button>
          <span v-if="topicIndex >= 0" class="topic-position">{{ topicIndex + 1 }} / {{ navList.length }}</span>
          <button
            type="button"
            :disabled="!nextTopic"
            title="Next topic (→)"
            aria-label="Next topic"
            @click="nextTopic && selectTopic(nextTopic.id)"
          >&#8250;</button>
        </div>

        <article class="topic-article" :class="'cat-' + currentMeta.category" :style="zoomLevel">
          <div class="topic-head">
            <div class="topic-preview-top">
              <span class="topic-kind">{{ currentMeta.icon }} {{ currentMeta.typeLabel }} · {{ currentMeta.categoryName }}</span>
              <span v-if="currentMeta.level" class="level-pill" :class="'lv-' + currentMeta.level">{{ currentMeta.level }}</span>
            </div>

            <h1 class="topic-title">
              <PhraseToRuby :text="currentMeta.main"></PhraseToRuby><span v-if="currentMeta.alt" class="alt"> — <PhraseToRuby :text="currentMeta.alt"></PhraseToRuby></span>
            </h1>

            <ul v-if="leadLines.length > 1" class="lead-list">
              <li v-for="(line, lineIndex) in leadLines" :key="lineIndex">
                <PhraseToRuby :text="line"></PhraseToRuby>
              </li>
            </ul>
            <p v-else-if="currentTopic.subtitle" class="topic-lead">
              <PhraseToRuby :text="currentTopic.subtitle"></PhraseToRuby>
            </p>

            <div v-if="currentMeta.extraTags.length" class="tag-list">
              <span v-for="tag in currentMeta.extraTags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <nav v-if="sections.length >= 4" class="topic-toc" aria-label="Sections">
              <button
                v-for="section in sections" :key="section.index"
                type="button"
                @click="scrollToSection(section.index)"
              >{{ section.main }}</button>
            </nav>
          </div>

          <!-- standard: sections with examples -->
          <template v-if="currentTopic.type === 'standard'">
            <section
              v-for="(content, contentIndex) in currentTopic.content" :key="contentIndex"
              :id="'topic-section-' + contentIndex"
              class="topic-section"
            >
              <h3 v-if="content.heading">
                <PhraseToRuby :text="splitDash(content.heading).main"></PhraseToRuby><span v-if="splitDash(content.heading).alt" class="alt"> — <PhraseToRuby :text="splitDash(content.heading).alt"></PhraseToRuby></span>
              </h3>

              <p v-if="content.text" class="topic-text"><PhraseToRuby :text="content.text"></PhraseToRuby></p>

              <template v-if="content.example">
                <div class="example-label">{{ parseExamples(content.example).length > 1 ? 'Examples' : 'Example' }}</div>
                <ul class="example-list">
                  <li v-for="(ex, exIndex) in parseExamples(content.example)" :key="exIndex" class="example-item">
                    <div class="ex-jp"><PhraseToRuby :text="ex.jp"></PhraseToRuby></div>
                    <button
                      type="button"
                      class="ex-listen"
                      title="Listen"
                      aria-label="Listen"
                      @click.stop="speak(ex.jp)"
                    >🔊</button>
                    <div v-if="ex.en" class="ex-en">{{ ex.en }}</div>
                  </li>
                </ul>
              </template>
            </section>
          </template>

          <!-- resource: free text -->
          <template v-if="currentTopic.type === 'resource'">
            <p v-if="currentTopic.content" class="topic-text">
              <PhraseToRuby :text="currentTopic.content"></PhraseToRuby>
            </p>
          </template>

          <!-- list: filterable table -->
          <template v-if="currentTopic.type === 'list'">
            <input
              v-if="currentTopic.items.length > 8"
              v-model="listQuery"
              type="search"
              class="list-search"
              placeholder="Filter this list..."
              aria-label="Filter this list"
              autocomplete="off"
            />
            <ListOfItems :items="visibleItems"></ListOfItems>
            <p v-if="!visibleItems.length" class="topic-lead">No matches.</p>
          </template>

          <Sources
            v-if="currentTopic.sources?.length"
            :sources="currentTopic.sources"
          />
        </article>

        <nav class="topic-pager" aria-label="More topics">
          <button v-if="prevTopic" type="button" class="pager prev" @click="selectTopic(prevTopic.id)">
            <small>&#8592; Previous</small>
            <span>{{ splitDash(prevTopic.title).main }}</span>
          </button>
          <button v-if="nextTopic" type="button" class="pager next" @click="selectTopic(nextTopic.id)">
            <small>Next &#8594;</small>
            <span>{{ splitDash(nextTopic.title).main }}</span>
          </button>
        </nav>

        <section v-if="relatedCards.length" class="related-topics">
          <h3>Related topics</h3>
          <ul>
            <li
              v-for="related in relatedCards" :key="related.id"
              :class="'cat-' + related.category"
              tabindex="0"
              role="link"
              @click="selectTopic(related.id)"
              @keydown.enter="selectTopic(related.id)"
            >
              <span class="related-title"><PhraseToRuby :text="related.main"></PhraseToRuby></span>
              <span v-if="related.level" class="level-pill" :class="'lv-' + related.level">{{ related.level }}</span>
              <span v-if="related.read" class="read-mark" title="Read">✓</span>
            </li>
          </ul>
        </section>
      </template>
    </main>
  </div>
`;
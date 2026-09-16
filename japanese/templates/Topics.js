export default /*html*/`
  <div class="topics">
    <MainHeader
      title="TOPICS"
      @onChangeFurigana="furiganaStore.switchFurigana()"
    >
      <phrase-to-ruby :text="'話題'"></phrase-to-ruby>
    </MainHeader>

    <main>
      <template v-if="!topic">
        <div class="filters">
          <input
            type="search"
            v-model="titleFilters"
            placeholder="Filter by titles..."
          />
          <input
            type="search"
            v-model="subtitleFilters"
            placeholder="Filter by content..."
          />
        </div>

        <template v-if="filteredTopics.length === 0">
          <article class="unknown">
            <h1 class="title">Empty list</h1>
            <h2 class="subtitle">Clear filters to see more items</h2>
            <button class="go-back" @click.prevent="titleFilters = ''; subtitleFilters = ''">Clear filters</button>
          </article>
        </template>

        <ul class="topic-list">
          <li
            v-for="item in filteredTopics" :key="item.id"
            class="topic-preview"
            @click="selectTopic(item.id)"
          >
            <h3 class="topic-preview-title"><PhraseToRuby :text="item.title"></h3>
            <p v-if="item.subtitle" class="topic-preview-subtitle"><PhraseToRuby :text="item.subtitle"></p>
            <div v-if="item.tags?.length" class="tag-list">
              <span
                v-for="tag in item.tags" :key="tag"
                class="tag"
                :class="{ 'tag-jlpt': /^N[1-5]$/.test(tag) }"
              >{{ tag }}</span>
            </div>
          </li>
        </ul>
      </template>

      <template v-else-if="!currentTopic">
        <article class="unknown">
          <h1 class="title">Unknown topic</h1>
          <h2 class="subtitle">This topic doesn't exist.</h2>
          <button class="go-back" @click.prevent="backToList()">Back to topic list</button>
        </article>
      </template>

      <template v-else>
        <button class="go-back topic-back" @click.prevent="backToList()">&#8592; Back to topics</button>

        <template v-if="currentTopic.type === 'standard'">
          <article :style="zoomLevel">
            <h1 class="title"><PhraseToRuby :text="currentTopic.title"></h1>
            <h4 class="subtitle"><PhraseToRuby :text="currentTopic.subtitle"></h4>
            <section v-for="(content, contentIndex) in currentTopic.content" :key="contentIndex">
              <h3 v-if="content.heading"><PhraseToRuby :text="content.heading"></h3>
              <p v-if="content.text"><PhraseToRuby :text="content.text"></p>
              <p v-if="content.example">
                <h4 class="example-label">Example:</h4>
                <span class="example-text"><PhraseToRuby :text="content.example"></span>
              </p>
            </section>
            <Sources
              v-if="currentTopic.sources?.length"
              :sources="currentTopic.sources"
            >
          </article>
        </template>

        <template v-if="currentTopic.type === 'resource'">
          <article>
            <h1 class="title"><PhraseToRuby :text="currentTopic.title"></h1>
            <h4 v-if="currentTopic.subtitle" class="subtitle"><PhraseToRuby :text="currentTopic.subtitle"></h4>
            <p v-if="currentTopic.content" class="content"><PhraseToRuby :text="currentTopic.content"></p>
            <Sources
              v-if="currentTopic.sources?.length"
              :sources="currentTopic.sources"
            >
          </article>
        </template>

        <template v-if="currentTopic.type === 'list'">
          <article>
            <h1 class="title"><PhraseToRuby :text="currentTopic.title"></h1>
            <h4 class="subtitle"><PhraseToRuby :text="currentTopic.subtitle"></h4>
            <ListOfItems :items="currentTopic.items">
            <Sources
              v-if="currentTopic.sources?.length"
              :sources="currentTopic.sources"
            >
          </article>
        </template>

        <section v-if="relatedTopics.length" class="related-topics">
          <h3>Related topics</h3>
          <ul>
            <li
              v-for="related in relatedTopics" :key="related.id"
              @click="selectTopic(related.id)"
            >
              <span class="related-title"><PhraseToRuby :text="related.title"></span>
              <div class="tag-list">
                <span
                  v-for="tag in related.tags" :key="tag"
                  class="tag"
                  :class="{ 'tag-jlpt': /^N[1-5]$/.test(tag) }"
                >{{ tag }}</span>
              </div>
            </li>
          </ul>
        </section>
      </template>
    </main>
    <!--footer>
      <div class="disclaimer" v-if="!hideDisclaimer">
        disclaimers
      </div>
      <button class="close-disclaimer" @click="hideDisclaimer = true" v-if="!hideDisclaimer">Close</button>
    </footer-->
  </div>
`;
export default /*html*/`
  <div class="topics">
    <MainHeader
      title="TOPICS"
      @onChangeFurigana="furiganaStore.switchFurigana()"
      @onOpenZoom="zoomStore.openZoom()"
    >
      <phrase-to-ruby :text="'話題'"></phrase-to-ruby>
    </MainHeader>

    <main>
      <div class="filters">
        <input
          type="text"
          v-model="titleFilters"
          placeholder="Filter by titles..."
        />
        <input
          type="text"
          v-model="subtitleFilters"
          placeholder="Filter by content..."
        />
      </div>
      <template v-if="filteredTopics?.length === 0">
        <article class="unknown">
          <h1 class="title">Empty list</h1>
          <h2 class="subtitle">Clear filters to see more items</h2>
          <button class="go-back" @click.prevent="titleFilters = ''; subtitleFilters = ''">Clear filters</button>
        </article>
      </template>
      
      <template v-for="(item, index) in filteredTopics" :key="index">
        <template v-if="item.type === 'standard'">
          <article>
            <h1 class="title">
              <PhraseToRuby :text="item.title">
            </h1>
            <h4 class="subtitle">
              <div>{{ item.subtitle }}</div>
            </h4>
            <section v-for="(content, contentIndex) in item.content" :key="contentIndex">
              <h3 v-if="content.heading"><PhraseToRuby :text="content.heading"></h3>
              <p v-if="content.text"><PhraseToRuby :text="content.text"></p>
              <p v-if="content.example">
                <h4 class="example-label">Example:</h4>
                <span class="example-text"><PhraseToRuby :text="content.example"></span>
              </p>
            </section>
            <Sources
              v-if="item.sources?.length"
              :sources="item.sources"
            >
          </article>
        </template>

        <template v-if="item.type === 'resource'">
          <article>
            <h1 class="title">
              <PhraseToRuby :text="item.title">
            </h1>
            <h4 v-if="item.subtitle" class="subtitle">
              <PhraseToRuby :text="item.subtitle">
            </h4>
            <p v-if="item.content" class="content">
              <PhraseToRuby :text="item.content">
            </p>
            <Sources
              v-if="item.sources?.length"
              :sources="item.sources"
            >
          </article>
        </template>

        <template v-if="item.type === 'list'">
          <article>
            <h1 class="title">
              <PhraseToRuby :text="item.title">
            </h1>
            <h4 class="subtitle">
              <PhraseToRuby :text="item.subtitle">
            </h4>
            <ListOfItems :items="item.items">
            <Sources
              v-if="item.sources?.length"
              :sources="item.sources"
            >
          </article>
        </template>
      </template>
    </main>
    <footer>
      <div class="disclaimer" v-if="!hideDisclaimer">
        This is a fan translation for educational purposes. All rights to "Berserk: The Flame Dragon Knight" belong to Young Animal Comics and the original creators. Please support the official release.
      </div>
      <button class="close-disclaimer" @click="hideDisclaimer = true" v-if="!hideDisclaimer">Close</button>
    </footer>
  </div>
`;
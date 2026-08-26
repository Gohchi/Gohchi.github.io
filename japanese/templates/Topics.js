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
      <template v-if="type === 'unknown'">
        <article class="unknown">
          <h1 class="title">Unknown Page</h1>
          <h2 class="subtitle">This page is not available.</h2>
          <button class="go-back" @click.prevent="goToIndex()">Go back to Index</button>
        </article>
      </template>
      
      <template v-for="(item, index) in topics" :key="index">
        <template v-if="type === 'standard'">
          <article>
            <h1 class="title">
              <div>{{ item.title }}</div>
              <PhraseToRuby
                :text="item.title"
                :furigana="furiganaStore.showFurigana"
              >
            </h1>
            <h2 class="subtitle">
              <div>{{ item.subtitle }}</div>
            </h2>
            <div class="sources">
              <span>source:</span>
              <template v-for="(source, i) in item.sources" :key="i" :href="source">
                <a :href="source">{{ i+1 }}</a>
              </template>
            </div>
          </article>
        </template>

        <template v-if="type === 'resource'">
          <article>
            <h1 class="title">
              <PhraseToRuby
                :text="item.title"
                :furigana="furiganaStore.showFurigana"
              >
            </h1>
            <h2 class="subtitle">
              <PhraseToRuby
                :text="item.subtitle"
                :furigana="furiganaStore.showFurigana"
              >
            </h2>
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
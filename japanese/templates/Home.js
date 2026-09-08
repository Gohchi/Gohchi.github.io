export default /*html*/`
  <template v-if="true">
  
    <MainHeader
      isHome="true"
      @onChangeFurigana="furiganaStore.switchFurigana()"
    >
      <div class="title">
        <ruby>万灯<rp>(</rp><rt>マンドー</rt><rp>)</rp></ruby>の<PhraseToRuby text="日本語"/>のメモ
      </div>
      <div class="page-info">
        <span class="info">Phrases: {{ articles.length }}!</span>
      </div>
    </MainHeader>

    <main class="common-phrases articles-wrapper">
      <article
        v-for="([main, eng, refs], index) in articles" :key="index"
        @click="selectedArticle=main"
        :class="{ 'selected': main==selectedArticle }"
        :style="zoomLevel"
      >
        <span class="main">
          <PhraseToRuby :text="main">
        </span>
        <br />
        <span class="eng" @click="showRefsDialog(refs)">{{ eng }}</span>
      </article>
    </main>
    <footer>
      <div class="actions">
        <button
          class="voice-active"
          title="voice"
          :disabled="!selectedArticle"
          @click="speak(selectedArticle)"
        >
          <span>🗣️</span>
        </button>
      </div>
    </footer>
    
    <dialog id="dialog-refs" @click="closeDialog('dialog-refs')">
      <h2>References:</h2>
      <div class="content">
      </div>
    </dialog>
  </template>
`;
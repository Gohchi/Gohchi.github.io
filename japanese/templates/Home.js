export default /*html*/`
  <template v-if="true">
  
    <MainHeader
      isHome="true"
      @onChangeFurigana="furiganaStore.switchFurigana()"
      @onOpenZoom="zoomStore.openZoom()"
    >
      <div class="title">
        <ruby>万灯<rp>(</rp><rt>マンドー</rt><rp>)</rp></ruby>の日本語のメモ
      </div>
      <div class="page-info">
        <span class="info">Phrases: {{ articles.length }}!</span>
      </div>
    </MainHeader>

    <main class="articles-wrapper">
      <article
        v-for="([main, eng, refs], index) in articles" :key="index"
        @click="selectedArticle=main"
        :class="{ 'selected': main==selectedArticle }"
        :style="'zoom: ' + zoomStore.zoomLevel + '%'"
      >
        <span class="main">
          <PhraseToRuby
            :text="main"
            :furigana="furiganaStore.showFurigana"
          >
        </span>
        <br />
        <span class="eng" @click="showRefsDialog(refs)">{{ eng }}</span>
      </article>
    </main>
    <footer>
      <div class="actions">
        <template v-if="zoomStore.showZoomMenu">
          <div class="zoom-level">
            <input
              type="range"
              id="zoom-level"
              name="zoom-level"
              min="100"
              max="200"
              :value="zoomStore.zoomLevel ?? 100"
              step="1"
              @change="e => zoomStore.onZoomChange(e)"
            />
            <label for="zoom-level">Zoom</label>
          </div>
          <button @click="zoomStore.confirmZoomLevel()">&#10004;</button>
          <button @click="zoomStore.cancelZoomLevel()">&#10060;</button>
        </template>
        <template v-else>
          <button
            class="voice-active"
            title="voice"
            :disabled="!selectedArticle"
            @click="speak(selectedArticle)"
          >
            <span>🗣️</span>
          </button>
        </template>
      </div>
    </footer>
    
    <dialog id="dialog-refs" @click="closeDialog('dialog-refs')">
      <h2>References:</h2>
      <div class="content">
      </div>
    </dialog>
  </template>
`;
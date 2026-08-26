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
          <button
            title="load voices"
            :disabled="!voices.length || !selectedArticle"
            @click="showDialog('dialog-voices')"
          >
            <span>select voice</span>
          </button>
        </template>
      </div>
    </footer>
    
    <dialog id="dialog-refs" @click="closeDialog('dialog-refs')">
      <h2>References:</h2>
      <div class="content">
      </div>
    </dialog>

    <dialog id="dialog-voices">
      <button class="close-btn" @click="closeDialog('dialog-voices')" aria-label="Close">&times;</button>
      <h2>Select Voice</h2>
      <h4>Example: {{ selectedArticle }}</h4>
      <div class="content">
        <ul class="voice-list">
          <li v-for="(voice, idx) in voices" :key="voice.voiceURI">
            <button
              :class="{ selected: selectedVoice && selectedVoice.voiceURI === voice.voiceURI }"
              @click="selectVoice(voice)"
            >
              {{ voice.name }} <span v-if="voice.lang">({{ voice.lang }})</span>
            </button>
          </li>
        </ul>
      </div>
    </dialog>
  </template>
`;
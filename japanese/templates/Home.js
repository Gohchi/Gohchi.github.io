export default /*html*/`
  <template v-if="true">
    <MainHeader
      isHome="true"
      @onChangeFurigana="furigana = !furigana"
      @onOpenZoom="openZoom()"
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
        :style="'zoom: ' + zoomLevel + '%'"
      >
        <span class="main">
          <PhraseToRuby
            :text="main"
            :furigana="furigana"
          >
        </span>
        <br />
        <span class="eng" @click="showRefsDialog(refs)">{{ eng }}</span>
      </article>
    </main>
    <footer>
      <div class="actions">
        <template v-if="showZoomMenu">
          <div class="zoom-level">
            <input
              type="range"
              id="zoom-level"
              name="zoom-level"
              min="100"
              max="200"
              :value="zoomLevel ?? 100"
              step="1"
              @change="onZoomChange"
            />
            <label for="zoom-level">Zoom</label>
          </div>
          <button @click="confirmZoomLevel()">&#10004;</button>
          <button @click="cancelZoomLevel()">&#10060;</button>
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

    <dialog id="dialog-kana">
      <button class="close-btn" @click="closeDialog('dialog-kana')" aria-label="Close">&times;</button>
        
      <div class="tables">
        <div>
          <h2>Hiragana</h2>
          <div class="content">
            <table class="hiragana-table">
              <tr>
                <td>あ</td><td>い</td><td>う</td><td>え</td><td>お</td>
              </tr>
              <tr>
                <td>か</td><td>き</td><td>く</td><td>け</td><td>こ</td>
              </tr>
              <tr>
                <td>さ</td><td>し</td><td>す</td><td>せ</td><td>そ</td>
              </tr>
              <tr>
                <td>た</td><td>ち</td><td>つ</td><td>て</td><td>と</td>
              </tr>
              <tr>
                <td>な</td><td>に</td><td>ぬ</td><td>ね</td><td>の</td>
              </tr>
              <tr>
                <td>は</td><td>ひ</td><td>ふ</td><td>へ</td><td>ほ</td>
              </tr>
              <tr>
                <td>ま</td><td>み</td><td>む</td><td>め</td><td>も</td>
              </tr>
              <tr>
                <td>や</td><td></td><td>ゆ</td><td></td><td>よ</td>
              </tr>
              <tr>
                <td>ら</td><td>り</td><td>る</td><td>れ</td><td>ろ</td>
              </tr>
              <tr>
                <td>わ</td><td></td><td>を</td><td></td><td>ん</td>
              </tr>
            </table>
          </div>
        </div>

        <div>
          <h2>Katakana</h2>
          <div class="content">
            <table class="katakana-table">
              <tr>
            <td>ア</td><td>イ</td><td>ウ</td><td>エ</td><td>オ</td>
              </tr>
              <tr>
            <td>カ</td><td>キ</td><td>ク</td><td>ケ</td><td>コ</td>
              </tr>
              <tr>
            <td>サ</td><td>シ</td><td>ス</td><td>セ</td><td>ソ</td>
              </tr>
              <tr>
            <td>タ</td><td>チ</td><td>ツ</td><td>テ</td><td>ト</td>
              </tr>
              <tr>
            <td>ナ</td><td>ニ</td><td>ヌ</td><td>ネ</td><td>ノ</td>
              </tr>
              <tr>
            <td>ハ</td><td>ヒ</td><td>フ</td><td>ヘ</td><td>ホ</td>
              </tr>
              <tr>
            <td>マ</td><td>ミ</td><td>ム</td><td>メ</td><td>モ</td>
              </tr>
              <tr>
            <td>ヤ</td><td></td><td>ユ</td><td></td><td>ヨ</td>
              </tr>
              <tr>
            <td>ラ</td><td>リ</td><td>ル</td><td>レ</td><td>ロ</td>
              </tr>
              <tr>
            <td>ワ</td><td></td><td>ヲ</td><td></td><td>ン</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <p>Hiragana and Katakana are two of the three main scripts used in Japanese writing. Hiragana is used for native Japanese words, while Katakana is typically used for foreign words and names.</p>
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
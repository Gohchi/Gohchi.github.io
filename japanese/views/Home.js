import PhraseToRuby from 'components/PhraseToRuby.js';

import {
  closeDialog,
  showDialog,
  showRefsDialog,
  speak,
  getVoices,
} from 'tools';

import { data } from 'data/phrases.js';

export default {
  // setup(props) {
  //   const { text } = toRefs(props);
    
  //   return {
  //     "text": text,
  //   };
  // },
  components: {
    PhraseToRuby,
  },
  methods: {
    showRefsDialog,
    showDialog,
    closeDialog,
    selectVoice(voice) {
      this.selectedVoice = voice;
      this.speak(this.selectedArticle);
    },
    speak(text) {
      speak(text, this.selectedVoice);
    },
    async loadVoices() {
      this.voices = await getVoices();
    },
  },
  mounted() {
    this.loadVoices();
  },
  data() {
    const zoomLevel = localStorage.getItem('zoom-level');
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      "showMenu": false,
      "articles": data,
      "pageSelected": lastPageVisited ? +lastPageVisited : 1, // Default to the first page
      "hideDisclaimer": true,
      "lang": lang ?? 'eng', // Default language
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki', // Default writing direction - tategaki | yokogaki
      "showZoomMenu": false,
      "zoomLevel": zoomLevel ?? 100,
      "prevZoomLevel": zoomLevel ?? 100,
      "furigana": true,
      "selectedArticle": null,
      "voices": [],
      "selectedVoice": null,
    }
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
  },
  template: /*html*/`
    <template v-if="true">
      <header>
        <div class="title">
          <ruby>万灯<rp>(</rp><rt>マンドー</rt><rp>)</rp></ruby>の日本語のメモ
        </div>
        <span class="info">Phrases: {{ articles.length }}!</span>
        <ul class="menu-open menu-index" v-if="showMenu">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#" @click.prevent="showDialog('dialog-kana')">Hiragana and Katakana</a></li>
          <li v-if="!!voices.length"><a href="#" @click.prevent="showDialog('dialog-voices'); showMenu=false;">Change voice</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">COMMON PHRASES 〠</a></li>
          <li><router-link to="/translation">小説 ベルセルク： 炎竜の騎士</router-link></li>
        </ul>
        <div class="icon-menu" @click="showMenu=!showMenu">
        </div>
      </header>

      <main class="articles-wrapper">
        <article
          v-for="([main, eng, refs], index) in articles" :key="index"
          @click="selectedArticle=main"
          :class="{ 'selected': main==selectedArticle }"
        >
          <span class="main">
            <phrase-to-ruby :text="main">
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
          <button
            title="load voices"
            :disabled="!voices.length || !selectedArticle"
            @click="showDialog('dialog-voices')"
          >
            <span>select voice</span>
          </button>
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
  `,
}
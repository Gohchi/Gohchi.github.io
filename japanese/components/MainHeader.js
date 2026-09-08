import { toRefs, defineEmits } from 'vue';

import {
  voiceStore
} from 'store';

import {
  showDialog,
  closeDialog,
} from 'tools';

export default {
  props: {
    title: String,
    isHome: Boolean,
    hideFurigana: Boolean,
    hideZoom: Boolean,
  },
  setup(props, { emit }) {
    const {
      title,
      isHome,
      hideFurigana,
      hideZoom,
    } = toRefs(props);

    return {
      title,
      isHome,
      onChangeFurigana: () => emit('onChangeFurigana'),
      onOpenZoom: () => emit('onOpenZoom'),
      hideFurigana,
      hideZoom,
    };
  },
  data() {
    return {
      "showMenu": false,
      "voices": [],
    };
  },
  components: {
  },
  methods: {
    showDialog,
    closeDialog,
    selectVoice(voice) {
      voiceStore.selectVoice(voice);
      voiceStore.speak("これはテストです");
    },
    async loadVoices() {
      this.voices = await voiceStore.getVoices();
    },
  },
  mounted() {
    this.loadVoices();
  },
  template: /*html*/`
    <div class="backdrop" v-if="showMenu" @click="showMenu=false"></div>
    <header>
      <div class="title">
        {{ title }}
        <slot></slot>
      </div>
      
      <ul class="menu-index" v-if="showMenu">
        <li><a href="#">COMMON PHRASES 〠</a></li>
        <li><router-link to="/translation">小説 ベルセルク： 炎竜の騎士</router-link></li>
        <li><router-link to="/kana-keyboard">KANA KEYBOARD</router-link></li>
        <li><router-link to="/topics">TOPICS</router-link></li>
        <li><a href="#" @click.prevent="showDialog('dialog-kana')">Hiragana and Katakana</a></li>
        <li v-if="!hideFurigana"><a href="#" @click.prevent="onChangeFurigana()">Switch furigana</a></li>
        <li v-if="!hideZoom"><a href="#" @click.prevent="onOpenZoom()">Zoom level</a></li>
        <li v-if="!!voices.length"><a href="#" @click.prevent="showDialog('dialog-voices'); showMenu=false;">Change voice</a></li>
      </ul>
      
      <div class="icon-menu" @click="showMenu=!showMenu">
      </div>
    </header>
    
    <dialog id="dialog-kana">
      <button class="close-btn" @click="closeDialog('dialog-kana')" aria-label="Close">&times;</button>
        
      <div class="tables">
        <div>
          <h2>Hiragana</h2>
          <div class="content">
            <table class="hiragana-table">
              <tr>
                <td>わ</td><td>ら</td><td>や</td><td>ま</td><td>は</td><td>な</td><td>た</td><td>さ</td><td>か</td><td>あ</td>
              </tr>
              <tr>
                <td></td><td>り</td><td></td><td>み</td><td>ひ</td><td>に</td><td>ち</td><td>し</td><td>き</td><td>い</td>
              </tr>
              <tr>
                <td>を</td><td>る</td><td>ゆ</td><td>む</td><td>ふ</td><td>ぬ</td><td>つ</td><td>す</td><td>く</td><td>う</td>
              </tr>
              <tr>
                <td></td><td>れ</td><td></td><td>め</td><td>へ</td><td>ね</td><td>て</td><td>せ</td><td>け</td><td>え</td>
              </tr>
              <tr>
                <td>ん</td><td>ろ</td><td>よ</td><td>も</td><td>ほ</td><td>の</td><td>と</td><td>そ</td><td>こ</td><td>お</td>
              </tr>
            </table>
          </div>
        </div>

        <div>
          <h2>Katakana</h2>
          <div class="content">
            <table class="katakana-table">
              <tr>
                <td>ワ</td><td>ラ</td><td>ヤ</td><td>マ</td><td>ハ</td><td>ナ</td><td>タ</td><td>サ</td><td>カ</td><td>ア</td>
              </tr>
              <tr>
                <td></td><td>リ</td><td></td><td>ミ</td><td>ヒ</td><td>ニ</td><td>チ</td><td>シ</td><td>キ</td><td>イ</td>
              </tr>
              <tr>
                <td>ヲ</td><td>ル</td><td>ユ</td><td>ム</td><td>フ</td><td>ヌ</td><td>ツ</td><td>ス</td><td>ク</td><td>ウ</td>
              </tr>
              <tr>
                <td></td><td>レ</td><td></td><td>メ</td><td>ヘ</td><td>ネ</td><td>テ</td><td>セ</td><td>ケ</td><td>エ</td>
              </tr>
              <tr>
                <td>ン</td><td>ロ</td><td>ヨ</td><td>モ</td><td>ホ</td><td>ノ</td><td>ト</td><td>ソ</td><td>コ</td><td>オ</td>
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
  `,
}
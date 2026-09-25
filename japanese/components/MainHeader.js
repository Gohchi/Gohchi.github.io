import { toRefs, defineEmits } from 'vue';

import {
  voiceStore,
  zoomStore,
} from 'store';

import {
  showDialog,
  closeDialog,
} from 'tools';

// Dakuten (゛) and handakuten (゜) pairs, hiragana + katakana combined,
// used to modify the last character typed into the word builder.
const DAKUTEN_MAP = {
  'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
  'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
  'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
  'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ',
  'う': 'ゔ',
  'カ': 'ガ', 'キ': 'ギ', 'ク': 'グ', 'ケ': 'ゲ', 'コ': 'ゴ',
  'サ': 'ザ', 'シ': 'ジ', 'ス': 'ズ', 'セ': 'ゼ', 'ソ': 'ゾ',
  'タ': 'ダ', 'チ': 'ヂ', 'ツ': 'ヅ', 'テ': 'デ', 'ト': 'ド',
  'ハ': 'バ', 'ヒ': 'ビ', 'フ': 'ブ', 'ヘ': 'ベ', 'ホ': 'ボ',
  'ウ': 'ヴ',
};

const HANDAKUTEN_MAP = {
  'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ',
  'ハ': 'パ', 'ヒ': 'ピ', 'フ': 'プ', 'ヘ': 'ペ', 'ホ': 'ポ',
};

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
      onOpenZoom: () => zoomStore.openZoom(),
      hideFurigana,
      hideZoom,
    };
  },
  data() {
    return {
      "showMenu": false,
      "voices": [],
      "wordBuilder": '', // word being assembled by clicking kana in the dialog
      zoomStore,
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

    // --- word builder (kana dialog) ---
    appendToWordBuilder(char) {
      this.wordBuilder += char;
    },
    appendSpaceToWordBuilder() {
      this.wordBuilder += '　'; // ideographic (full-width) space
    },
    backspaceWordBuilder() {
      this.wordBuilder = [...this.wordBuilder].slice(0, -1).join('');
    },
    clearWordBuilder() {
      this.wordBuilder = '';
    },
    applyDakutenToWordBuilder() {
      const chars = [...this.wordBuilder];
      if (!chars.length) return;
      const lastIndex = chars.length - 1;
      const mapped = DAKUTEN_MAP[chars[lastIndex]];
      if (mapped) {
        chars[lastIndex] = mapped;
        this.wordBuilder = chars.join('');
      }
    },
    applyHandakutenToWordBuilder() {
      const chars = [...this.wordBuilder];
      if (!chars.length) return;
      const lastIndex = chars.length - 1;
      const mapped = HANDAKUTEN_MAP[chars[lastIndex]];
      if (mapped) {
        chars[lastIndex] = mapped;
        this.wordBuilder = chars.join('');
      }
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
        <li><router-link to="/">HOME</router-link></li>
        <li><router-link to="/roadmap">ROADMAP</router-link></li>
        <li><router-link to="/common-phrases">COMMON PHRASES</router-link></li>
        <li><router-link to="/translations">TRANSLATIONS</router-link></li>
        <li><router-link to="/kana-keyboard">KANA KEYBOARD</router-link></li>
        <li><router-link to="/hiragana-practice">HIRAGANA PRACTICE</router-link></li>
        <li><router-link to="/katakana-practice">KATAKANA PRACTICE</router-link></li>
        <li><router-link to="/kanji-practice">KANJI PRACTICE</router-link></li>
        <li><router-link to="/verbs-practice">VERB PRACTICE</router-link></li>
        <li><router-link to="/adjectives-practice">ADJECTIVE PRACTICE</router-link></li>
        <li><router-link to="/topics">TOPICS</router-link></li>
        <li><router-link to="/print-practice">PRINT PRACTICE</router-link></li>
        <li><router-link to="/donate">DONATE ♥</router-link></li>
        <li aria-hidden="true"><hr></li>
        <li><a href="#" @click.prevent="showDialog('dialog-kana')">Hiragana and Katakana</a></li>
        <li v-if="!hideFurigana"><a href="#" @click.prevent="onChangeFurigana()">Switch furigana</a></li>
        <li v-if="!hideZoom"><a href="#" @click.prevent="onOpenZoom()">Zoom level</a></li>
        <li v-if="!!voices.length"><a href="#" @click.prevent="showDialog('dialog-voices'); showMenu=false;">Change voice</a></li>
      </ul>
      
      <div class="icon-menu" @click="showMenu=!showMenu">
      </div>
    </header>

    
    <div v-if="zoomStore.showZoomMenu" class="zoom-menu">
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
    </div>
    
    <dialog id="dialog-kana">
      <button class="close-btn" @click="closeDialog('dialog-kana')" aria-label="Close">&times;</button>

      <div class="word-builder">
        <input
          type="text"
          class="word-builder-input"
          v-model="wordBuilder"
          placeholder="Click kana below to build a word..."
          aria-label="Word being built"
        />
        <button class="word-builder-action" title="Backspace" @click="backspaceWordBuilder()">⌫</button>
        <button class="word-builder-action" title="Clear" @click="clearWordBuilder()">✕</button>
      </div>

      <div class="tables">
        <div>
          <h2>Hiragana</h2>
          <div class="content">
            <table class="hiragana-table kana-table">
              <tr>
                <td class="kana-action" title="Chōonpu — long vowel mark" @click="appendToWordBuilder('ー')">ー</td>
                <td class="kana-cell" @click="appendToWordBuilder('わ')">わ</td><td class="kana-cell" @click="appendToWordBuilder('ら')">ら</td><td class="kana-cell" @click="appendToWordBuilder('や')">や</td><td class="kana-cell" @click="appendToWordBuilder('ま')">ま</td><td class="kana-cell" @click="appendToWordBuilder('は')">は</td><td class="kana-cell" @click="appendToWordBuilder('な')">な</td><td class="kana-cell" @click="appendToWordBuilder('た')">た</td><td class="kana-cell" @click="appendToWordBuilder('さ')">さ</td><td class="kana-cell" @click="appendToWordBuilder('か')">か</td><td class="kana-cell" @click="appendToWordBuilder('あ')">あ</td>
              </tr>
              <tr>
                <td class="kana-action" title="Dakuten — modifies the last character" @click="applyDakutenToWordBuilder()">゛</td>
                <td class="kana-cell" @click="appendToWordBuilder('「')">「</td><td class="kana-cell" @click="appendToWordBuilder('り')">り</td><td class="kana-cell" @click="appendToWordBuilder('」')">」</td><td class="kana-cell" @click="appendToWordBuilder('み')">み</td><td class="kana-cell" @click="appendToWordBuilder('ひ')">ひ</td><td class="kana-cell" @click="appendToWordBuilder('に')">に</td><td class="kana-cell" @click="appendToWordBuilder('ち')">ち</td><td class="kana-cell" @click="appendToWordBuilder('し')">し</td><td class="kana-cell" @click="appendToWordBuilder('き')">き</td><td class="kana-cell" @click="appendToWordBuilder('い')">い</td>
              </tr>
              <tr>
                <td class="kana-action" title="Handakuten — modifies the last character" @click="applyHandakutenToWordBuilder()">゜</td>
                <td class="kana-cell" @click="appendToWordBuilder('を')">を</td><td class="kana-cell" @click="appendToWordBuilder('る')">る</td><td class="kana-cell" @click="appendToWordBuilder('ゆ')">ゆ</td><td class="kana-cell" @click="appendToWordBuilder('む')">む</td><td class="kana-cell" @click="appendToWordBuilder('ふ')">ふ</td><td class="kana-cell" @click="appendToWordBuilder('ぬ')">ぬ</td><td class="kana-cell" @click="appendToWordBuilder('つ')">つ</td><td class="kana-cell" @click="appendToWordBuilder('す')">す</td><td class="kana-cell" @click="appendToWordBuilder('く')">く</td><td class="kana-cell" @click="appendToWordBuilder('う')">う</td>
              </tr>
              <tr>
                <td class="kana-action" title="Space" @click="appendSpaceToWordBuilder()">␣</td>
                <td class="kana-cell" @click="appendToWordBuilder('。')">。</td><td class="kana-cell" @click="appendToWordBuilder('れ')">れ</td><td class="kana-cell" @click="appendToWordBuilder('、')">、</td><td class="kana-cell" @click="appendToWordBuilder('め')">め</td><td class="kana-cell" @click="appendToWordBuilder('へ')">へ</td><td class="kana-cell" @click="appendToWordBuilder('ね')">ね</td><td class="kana-cell" @click="appendToWordBuilder('て')">て</td><td class="kana-cell" @click="appendToWordBuilder('せ')">せ</td><td class="kana-cell" @click="appendToWordBuilder('け')">け</td><td class="kana-cell" @click="appendToWordBuilder('え')">え</td>
              </tr>
              <tr>
                <td class="kana-action" title="Backspace" @click="backspaceWordBuilder()">⌫</td>
                <td class="kana-cell" @click="appendToWordBuilder('ん')">ん</td><td class="kana-cell" @click="appendToWordBuilder('ろ')">ろ</td><td class="kana-cell" @click="appendToWordBuilder('よ')">よ</td><td class="kana-cell" @click="appendToWordBuilder('も')">も</td><td class="kana-cell" @click="appendToWordBuilder('ほ')">ほ</td><td class="kana-cell" @click="appendToWordBuilder('の')">の</td><td class="kana-cell" @click="appendToWordBuilder('と')">と</td><td class="kana-cell" @click="appendToWordBuilder('そ')">そ</td><td class="kana-cell" @click="appendToWordBuilder('こ')">こ</td><td class="kana-cell" @click="appendToWordBuilder('お')">お</td>
              </tr>
            </table>
          </div>
        </div>

        <div>
          <h2>Katakana</h2>
          <div class="content">
            <table class="katakana-table kana-table">
              <tr>
                <td class="kana-action" title="Dasshu — double-hyphen dash" @click="appendToWordBuilder('゠')">゠</td>
                <td class="kana-cell" @click="appendToWordBuilder('ワ')">ワ</td><td class="kana-cell" @click="appendToWordBuilder('ラ')">ラ</td><td class="kana-cell" @click="appendToWordBuilder('ヤ')">ヤ</td><td class="kana-cell" @click="appendToWordBuilder('マ')">マ</td><td class="kana-cell" @click="appendToWordBuilder('ハ')">ハ</td><td class="kana-cell" @click="appendToWordBuilder('ナ')">ナ</td><td class="kana-cell" @click="appendToWordBuilder('タ')">タ</td><td class="kana-cell" @click="appendToWordBuilder('サ')">サ</td><td class="kana-cell" @click="appendToWordBuilder('カ')">カ</td><td class="kana-cell" @click="appendToWordBuilder('ア')">ア</td>
              </tr>
              <tr>
                <td class="kana-action" title="Dakuten — modifies the last character" @click="applyDakutenToWordBuilder()">゛</td>
                <td class="kana-cell" @click="appendToWordBuilder('ー')">ー</td><td class="kana-cell" @click="appendToWordBuilder('リ')">リ</td><td class="kana-cell" @click="appendToWordBuilder('・')">・</td><td class="kana-cell" @click="appendToWordBuilder('ミ')">ミ</td><td class="kana-cell" @click="appendToWordBuilder('ヒ')">ヒ</td><td class="kana-cell" @click="appendToWordBuilder('ニ')">ニ</td><td class="kana-cell" @click="appendToWordBuilder('チ')">チ</td><td class="kana-cell" @click="appendToWordBuilder('シ')">シ</td><td class="kana-cell" @click="appendToWordBuilder('キ')">キ</td><td class="kana-cell" @click="appendToWordBuilder('イ')">イ</td>
              </tr>
              <tr>
                <td class="kana-action" title="Handakuten — modifies the last character" @click="applyHandakutenToWordBuilder()">゜</td>
                <td class="kana-cell" @click="appendToWordBuilder('ヲ')">ヲ</td><td class="kana-cell" @click="appendToWordBuilder('ル')">ル</td><td class="kana-cell" @click="appendToWordBuilder('ユ')">ユ</td><td class="kana-cell" @click="appendToWordBuilder('ム')">ム</td><td class="kana-cell" @click="appendToWordBuilder('フ')">フ</td><td class="kana-cell" @click="appendToWordBuilder('ヌ')">ヌ</td><td class="kana-cell" @click="appendToWordBuilder('ツ')">ツ</td><td class="kana-cell" @click="appendToWordBuilder('ス')">ス</td><td class="kana-cell" @click="appendToWordBuilder('ク')">ク</td><td class="kana-cell" @click="appendToWordBuilder('ウ')">ウ</td>
              </tr>
              <tr>
                <td class="kana-action" title="Space" @click="appendSpaceToWordBuilder()">␣</td>
                <td class="kana-cell" @click="appendToWordBuilder('『')">『</td><td class="kana-cell" @click="appendToWordBuilder('レ')">レ</td><td class="kana-cell" @click="appendToWordBuilder('』')">』</td><td class="kana-cell" @click="appendToWordBuilder('メ')">メ</td><td class="kana-cell" @click="appendToWordBuilder('ヘ')">ヘ</td><td class="kana-cell" @click="appendToWordBuilder('ネ')">ネ</td><td class="kana-cell" @click="appendToWordBuilder('テ')">テ</td><td class="kana-cell" @click="appendToWordBuilder('セ')">セ</td><td class="kana-cell" @click="appendToWordBuilder('ケ')">ケ</td><td class="kana-cell" @click="appendToWordBuilder('エ')">エ</td>
              </tr>
              <tr>
                <td class="kana-action" title="Backspace" @click="backspaceWordBuilder()">⌫</td>
                <td class="kana-cell" @click="appendToWordBuilder('ン')">ン</td><td class="kana-cell" @click="appendToWordBuilder('ロ')">ロ</td><td class="kana-cell" @click="appendToWordBuilder('ヨ')">ヨ</td><td class="kana-cell" @click="appendToWordBuilder('モ')">モ</td><td class="kana-cell" @click="appendToWordBuilder('ホ')">ホ</td><td class="kana-cell" @click="appendToWordBuilder('ノ')">ノ</td><td class="kana-cell" @click="appendToWordBuilder('ト')">ト</td><td class="kana-cell" @click="appendToWordBuilder('ソ')">ソ</td><td class="kana-cell" @click="appendToWordBuilder('コ')">コ</td><td class="kana-cell" @click="appendToWordBuilder('オ')">オ</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <p>Hiragana and Katakana are two of the three main scripts used in Japanese writing. Hiragana is used for native Japanese words, while Katakana is typically used for foreign words and names. Click any kana to add it to the word above — the leftmost column and the former blank cells hold ー (chōonpu), ゠ (dasshu), ゛ (dakuten), ゜ (handakuten), ␣ (space), ⌫ (backspace), and 「」『』。、 (closing/ending punctuation).</p>
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
import { ref } from 'vue';
import MainHeader from 'components/MainHeader.js';


export default {
  components: {
    MainHeader,
  },
  setup() {
    const capture = ref(null);

    return { capture };
  },
  data() {
    return {
      showMenu: false,
      furigana: true,
      KANA: [
        "あ","い","う","え","お",
        "か","き","く","け","こ",
        "さ","し","す","せ","そ",
        "た","ち","つ","て","と",
        "な","に","ぬ","ね","の",
        "は","ひ","ふ","へ","ほ",
        "ま","み","む","め","も",
        "や","ゆ","よ",
        "ら","り","る","れ","ろ",
        "わ","を","ん"
      ],
      target: "",
      score: 0,
      streak: 0,
      last: "-",
      status: "Click anywhere and start typing.",
      statusClass: "status",
      inputValue: ""
    }
  },
  methods: {
    randomKana() {
      return this.KANA[Math.floor(Math.random() * this.KANA.length)];
    },
    newTarget() {
      this.target = this.randomKana();
      this.status = "Type the kana shown above.";
      this.statusClass = "status";
      this.inputValue = "";
      this.$nextTick(() => this.focusInput());
    },
    resetScore() {
      this.score = 0;
      this.streak = 0;
      this.status = "Score reset.";
      this.statusClass = "status";
      this.$nextTick(() => this.focusInput());
    },
    handleKana(kana) {
      this.last = kana;
      if (kana === this.target) {
        this.score++;
        this.streak++;
        this.status = "Correct!";
        this.statusClass = "status ok";
        this.newTarget();
      } else {
        this.streak = 0;
        this.status = `Wrong: "${kana}"`;
        this.statusClass = "status bad";
      }
    },
    onInput(e) {
      const { data } = e;
      if (!data) return;
      const kana = [...data].at(-1);
      this.handleKana(kana);
      this.inputValue = data;
      e.target.value = '';
    },
    focusInput() {
      this.$refs.capture.focus();
    }
  },
  mounted() {
    this.newTarget();
    document.addEventListener("click", () => this.focusInput());
  },
  template: /*html*/`
    <div class="kana-keyboard">
      <main-header
        title="KANA KEYBOARD"
        hideFurigana="true"
        hideZoom="true"
      >
      </main-header>

      <main>
        <div class="card">
          <div style="text-align:center">Type this kana:</div>
          <div id="prompt" class="prompt">{{ target }}</div>

          <div id="status" :class="statusClass">{{ status }}</div>

          <div class="row">
            <button @click="newTarget">Next</button>
            <button @click="resetScore">Reset</button>
            <button @click="focusInput">Focus</button>
          </div>

          <div class="stats">
            <div>Score: <span id="score">{{ score }}</span></div>
            <div>Streak: <span id="streak">{{ streak }}</span></div>
            <div>Last: <span id="last">{{ last }}</span></div>
          </div>
        </div>

        <!-- Hidden input for IME-safe capture -->
        <input ref="capture" autocomplete="off" v-model="inputValue" @input="onInput" id="capture" />
      </main>
    </div>
  `
}


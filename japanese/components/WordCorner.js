import { reactive } from 'vue';

import { speak } from 'tools';

// "Auto" next to Listen: read every new word aloud as soon as it is presented.
// One setting shared by every practice section (and remembered in this browser).
const AUTO_KEY = 'auto-listen';

const autoListen = reactive({
  on: (() => {
    try {
      return localStorage.getItem(AUTO_KEY) === 'true';
    } catch {
      return false;
    }
  })(),
});

const sayNow = text => {
  if (!text) return;
  window.speechSynthesis?.cancel(); // never queue up words when answering fast
  speak(text);
};

export default {
  props: {
    word: String,
    level: String, // optional: the badge is hidden when there is no level
    tags: { type: Array, default: () => [] }, // optional: kanji groups, shown as #hashtags
    speech: String, // optional: text to read aloud, defaults to `word`
  },
  data() {
    return { autoListen };
  },
  computed: {
    jishoUrl() {
      return this.word ? 'https://jisho.org/search/' + encodeURIComponent(this.word) : '';
    },
    speechText() {
      return this.speech || this.word;
    },
  },
  watch: {
    // runs when the component shows up and every time the word changes
    speechText: {
      immediate: true,
      handler(text) {
        if (autoListen.on) sayNow(text);
      },
    },
  },
  methods: {
    listen() {
      if (this.speechText) speak(this.speechText);
    },
    toggleAuto() {
      autoListen.on = !autoListen.on;
      try {
        localStorage.setItem(AUTO_KEY, String(autoListen.on));
      } catch {
        // ignore privacy-mode errors
      }
      if (autoListen.on) sayNow(this.speechText); // immediate feedback
    },
  },
  template: /*html*/`
    <div class="kanji-corner">
      <div v-if="speechText" class="listen-group">
        <button
          type="button"
          class="listen-link"
          title="Listen"
          @click="listen"
        >Listen</button>
        <button
          type="button"
          class="auto-listen"
          :class="{ on: autoListen.on }"
          :aria-pressed="autoListen.on"
          title="Read every new word aloud automatically"
          @click="toggleAuto"
        >Auto {{ autoListen.on ? 'on' : 'off' }}</button>
      </div>

      <div class="kanji-corner-info">
        <div v-if="tags.length" class="word-tags"><span v-for="tag in tags" :key="tag" class="word-tag">#{{ tag }}</span></div>
        <div v-if="level" class="JLPT-level" :class="{ ['level-'+level]: true }">JLPT {{ level }}</div>
        <a
          v-if="jishoUrl"
          class="jisho-link"
          :href="jishoUrl"
          target="_blank"
          rel="noopener noreferrer"
          title="Look it up on Jisho"
          @click.stop
        >Jisho ↗</a>
      </div>
    </div>
  `,
};
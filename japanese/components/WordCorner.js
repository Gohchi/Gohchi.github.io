import { speak } from 'tools';

export default {
  props: {
    word: String,
    level: String, // optional: the badge is hidden when there is no level
    tags: { type: Array, default: () => [] }, // optional: kanji groups, shown as #hashtags
    speech: String, // optional: text to read aloud, defaults to `word`
  },
  computed: {
    jishoUrl() {
      return this.word ? 'https://jisho.org/search/' + encodeURIComponent(this.word) : '';
    },
    speechText() {
      return this.speech || this.word;
    },
  },
  methods: {
    listen() {
      if (this.speechText) speak(this.speechText);
    },
  },
  template: /*html*/`
    <div class="kanji-corner">
      <button
        v-if="speechText"
        type="button"
        class="listen-link"
        title="Listen"
        @click="listen"
      >Listen</button>

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
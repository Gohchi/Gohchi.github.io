export default {
  props: {
    word: String,
    level: String, // optional: the badge is hidden when there is no level
  },
  computed: {
    jishoUrl() {
      return this.word ? 'https://jisho.org/search/' + encodeURIComponent(this.word) : '';
    },
  },
  template: /*html*/`
    <div class="kanji-corner">
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
  `,
};
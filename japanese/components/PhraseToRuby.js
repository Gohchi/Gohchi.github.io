import { toRefs } from 'vue';

import { tokenize } from 'tools';

import { ruby } from 'data/kanji.js';
import { words } from 'data/words.js';

import KanjiWithRuby from './KanjiWithRuby.js';

import {
  furiganaStore
} from 'store';

export default {
  props: {
    text: String,
    furigana: Boolean,
    zoom: Boolean,
  },
  setup(props) {
    const { text, zoom } = toRefs(props);

    return {
      "text": text,
      "zoom": zoom,
    };
  },
  data() {
    return {
      furiganaStore,
    };
  },
  components: {
    KanjiWithRuby,
  },
  computed: {
    // [{ surface, entry? }] - `entry` is set when the token has furigana
    tokens() {
      return tokenize(this.text, { ruby, words });
    },
  },
  template: /*html*/`
    <span>
      <template v-for="(token, index) in tokens" :key="index">
        <KanjiWithRuby
          v-if="furiganaStore.showFurigana && token.entry"
          :zoom="zoom"
          :text="token.surface"
          :entry="token.entry"
        ></KanjiWithRuby>
        <span v-else>{{ token.surface }}</span>
      </template>
    </span>
  `,
}
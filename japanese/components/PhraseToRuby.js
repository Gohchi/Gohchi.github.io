import { toRefs } from 'vue';

import { extractKanji, splitByKanji } from 'tools';

import { ruby } from 'data/kanji.js';

import KanjiWithRuby from './KanjiWithRuby.js';

import {
  furiganaStore
} from 'store';

export default {
  props: {
    text: String,
    furigana: Boolean,
  },
  setup(props) {
    const { text } = toRefs(props);
    
    return {
      "text": text,
      "ruby": ruby,
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
  methods: {
    extractKanji,
    splitByKanji,
  },
  template: /*html*/`
    <template v-for="(group, index) in splitByKanji(text, extractKanji(text))" :key="index">
      <template v-if="furiganaStore.showFurigana && !!ruby[group]">
        <KanjiWithRuby :key="index" :text="group"></KanjiWithRuby>
      </template>
      <template v-else>
        <span>{{ group }}</span>
      </template>
    </template>
  `,
}
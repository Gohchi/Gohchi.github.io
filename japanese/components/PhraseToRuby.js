import { extractKanji, splitByKanji } from "../tools.js";

import { ruby } from '../data/kanji.js';

import KanjiWithRuby from './KanjiWithRuby.js';

export default {
  props: {
    text: String,
  },
  setup({ text }) {
    return {
      "text": text,
      "ruby": ruby,
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
      <template v-if="!!ruby[group]">
        <kanji-with-ruby :text="group"></kanji-with-ruby>
      </template>
      <template v-else>
        <span>{{ group }}</span>
      </template>
    </template>
  `,
}
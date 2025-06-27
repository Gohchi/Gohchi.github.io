// import { ref } from 'vue';

import { extractKanji, splitByKanji } from "../tools.js";
import { ruby } from '../data/kanji.js';

export default {
  props: {
    text: String,
  },
  setup(props) {
    // const count = ref(0);
    return {
      "text": props.text,
    }
  },
  data() {
    return {
      "ruby": ruby,
    };
  },
  methods: {
    extractKanji,
    splitByKanji,
  },
  template: `
    <template v-for="(group, index) in splitByKanji(text, extractKanji(text))" :key="index">
      <template v-if="!!ruby[group]">
        <ruby>{{ group }}<rp>(</rp><rt>{{ ruby[group] }}</rt><rp>)</rp></ruby>
      </template>
      <template v-else>
        <span>{{ group }}</span>
      </template>
    </template>
  `,
}
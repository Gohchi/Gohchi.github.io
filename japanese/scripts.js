
import { createApp } from 'vue';

import { data, ruby } from './data/phrases.js';

createApp({
  components: {
  },
  methods: {
    "extractKanji": phrase => {
      const kanjiList = [];
      let kanjiGroup = '';
      for (let i = 0; i < phrase.length; i++) {
        const unicodeCode = phrase.charCodeAt(i);
        if (unicodeCode >= 0x4E00 && unicodeCode <= 0x9FFF) {
          kanjiGroup += phrase[i];
        } else {
          if (kanjiGroup !== '') {
            kanjiList.push(kanjiGroup);
            kanjiGroup = '';
          }
        }
      }
      if (kanjiGroup !== '') {
        kanjiList.push(kanjiGroup);
      }
      return kanjiList;
    },
    "splitByKanji": (sentence, kanjiList) => {
      let result = [];
      let currentIndex = 0;
      for (let i = 0; i < kanjiList.length; i++) {
        const kanji = kanjiList[i];
        const index = sentence.indexOf(kanji, currentIndex);
        if (index !== -1) {
          result.push(sentence.substring(currentIndex, index));
          result.push(kanji);
          currentIndex = index + kanji.length;
        }
      }
      result.push(sentence.substring(currentIndex));
      return result;
    },
  },
  mounted() {
  },
  data() {
    return {
      "showMenu": false,
      "articles": data,
      "ruby": ruby,
    }
  },
}).mount('#app');

import { createApp } from 'vue';

import { data } from './data/phrases.js';
import { ruby } from './data/kanji.js';
import { translations } from './data/translations.js';

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
    "showRefsDialog": refs => {
      if (!refs) { // If no references are provided, do nothing
        return;
      }

      const dialog = document.querySelector('dialog');
      if (dialog) {
        const content = dialog.querySelector('.content');
        content.innerHTML = ''; // Clear previous content
        for (let i = 0; i < refs.length; i++) {
          const ref = refs[i];
          const p = document.createElement('p');
          p.textContent = `${'*'.repeat(i + 1)} ${ref}`;
          content.appendChild(p); // Add each reference as a paragraph
        }

        dialog.showModal(); // Finally, show the dialog
      }
    },
    "showDialog": id => {
      const dialog = document.getElementById(id);
      if (dialog) {
        dialog.showModal(); // Finally, show the dialog
      }
    },
    "closeDialog": id => {
      const dialog = document.getElementById(id);
      if (dialog) {
        dialog.close();
      }
    },
    "goTo": url => {
      window.location.href = url; // Navigate to the specified URL
    },
  },
  mounted() {
  },
  data() {
    return {
      "showMenu": false,
      "articles": data,
      "ruby": ruby,
      "translations": translations,
      "pageSelected": 1,
      "hideDisclaimer": true,
      "lang": 'eng', // Default language
      "showTranslation": true,
    }
  },
  computed: {
    page() {
      return this.translations.find(({ pageNumber }) => this.pageSelected === pageNumber);
    },
    main() {
      return this.page.main;
    },
    title() {
      return this.page.title;
    },
    subtitle() {
      return this.page.subtitle;
    },
    pageNumber() {
      return this.page.pageNumber;
    },
  }
}).mount('#app');

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
    "goToIndex": function() {
      const index = this.translations.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
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
      "pageSelected": 1, // Default to the first page
      "hideDisclaimer": false,
      "lang": 'eng', // Default language
      "showTranslation": true,
      "writingDirection": 'yokogaki', // Default writing direction - horizontal writing
    }
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
    type() {
      if (!this.translations[this.pageSelected-1]) {
        return 'unknown';
      }

      return this.page.type;
    },
    title() {
      return this.page.title;
    },
    subtitle() {
      return this.page.subtitle;
    },
    chapters() {
      return this.page.chapters;
    },
    footer() {
      return this.page.footer;
    },
    showPage() {
      return this.page.showPage;
    },
    first() {
      if (this.pageSelected > this.translations.length) {
        return true; // If the selected page is out of bounds, consider it as the first page
      }
      return this.pageSelected === 1;
    },
    last() {
      if (this.pageSelected > this.translations.length) {
        return true; // If the selected page is out of bounds, consider it as the last page
      }
      return this.pageSelected === this.translations.length;
    }
  }
}).mount('#app');
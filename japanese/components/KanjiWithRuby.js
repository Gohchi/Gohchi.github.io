import { toRefs } from 'vue';

import { closeDialog, showDialog } from 'tools';

import { ruby } from 'data/kanji.js';

export default {
  props: {
    text: String,
  },
  setup(props) {

    const { text } = toRefs(props);

    return {
      "text": text,
      "ruby": ruby,
    };
  },
  computed: {
    dialogId() {
      return this.text.split('').reduce((res, value) => res + value.charCodeAt(0), '');
    },
    info() {
      return this.ruby[this.text];
    },
    furigana() {
      return this.info.furigana;
    },
    eng() {
      return this.info.eng;
    }
  },
  methods: {
    showDialog,
    closeDialog,
  },
  template: /*html*/`
    <ruby class="open-dialog"
      @click="showDialog(dialogId)"
    >{{ text }}<rp>(</rp><rt>{{ furigana }}</rt><rp>)</rp></ruby>
    <dialog :id="dialogId" @click="closeDialog(dialogId)">
      <div class="kanji-furigana">{{ furigana }}</div>
      <div class="kanji-details">{{ text }}</div>
      <ul class="kanji-meaning">
        <li v-for="(item, index) in eng" :key="index">
          {{ item }}
        </li>
      </ul>
    </dialog>
  `,
}
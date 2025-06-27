// import { ref, useTemplateRef } from 'vue';

import { closeDialog, showDialog } from "../tools.js";

import { ruby } from '../data/kanji.js';

export default {
  props: {
    text: String,
  },
  setup({ text }) {
    // const count = ref(0);
    const getId = text => text.split('').reduce((res, value) => res + value.charCodeAt(0), '');

    return {
      "text": text,
      "dialogId": getId(text),
      "ruby": ruby,
    };
  },
  computed: {
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
      <h4>{{ furigana }}</h4>
      <h2>{{ text }}</h2>
      <ul>
        <li v-for="(item, index) in eng" :key="index">
          {{ item }}
        </li>
      </ul>
    </dialog>
  `,
}
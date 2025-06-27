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
    };
  },
  data() {
    return {
      "ruby": ruby,
    };
  },
  methods: {
    showDialog,
    closeDialog,
  },
  template: /*html*/`
    <ruby class="open-dialog"
      @click="showDialog(dialogId)"
    >{{ text }}<rp>(</rp><rt>{{ ruby[text] }}</rt><rp>)</rp></ruby>
    <dialog :id="dialogId" @click="closeDialog(dialogId)">
      <h4>{{ ruby[text] }}</h4>
      <h2>{{ text }}</h2>
    </dialog>
  `,
}
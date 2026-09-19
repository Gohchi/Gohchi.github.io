import { toRefs } from 'vue';

import { closeDialog, showDialog, alignFurigana } from 'tools';

import { ruby } from 'data/kanji.js';

import {
  zoomStore,
} from 'store';

export default {
  props: {
    text: String,
    zoom: Boolean,
    entry: Object, // optional: dictionary entry chosen by the tokenizer (words.js or kanji.js)
  },
  setup(props) {
    const { text, zoom } = toRefs(props);

    return {
      "text": text,
      "ruby": ruby,
      "zoom": zoom,
    };
  },
  computed: {
    zoomLevel() {
      if (this.zoom) {
        return zoomStore.getZoomLevel();
      }
    },
    dialogId() {
      return this.text.split('').reduce((res, value) => res + value.charCodeAt(0), '');
    },
    info() {
      return this.entry || this.ruby[this.text];
    },
    furigana() {
      return this.info.furigana;
    },
    // [{ text, rt? }]: the reading only goes over the kanji (お父さん -> お + 父(とう) + さん)
    parts() {
      return alignFurigana(this.text, this.furigana, this.info.parts);
    },
    eng() {
      return this.info.eng;
    },
    JLPT_level() {
      return this.info.JLPT_level;
    }
  },
  methods: {
    showDialog,
    closeDialog,
  },
  template: /*html*/`
    <span class="open-dialog" @click="showDialog(dialogId)">
      <template v-for="(part, index) in parts" :key="index">
        <ruby v-if="part.rt">{{ part.text }}<rp>(</rp><rt>{{ part.rt }}</rt><rp>)</rp></ruby>
        <template v-else>{{ part.text }}</template>
      </template>
    </span>
    <dialog :style="zoomLevel" class="kanji-dialog" :id="dialogId" @click="closeDialog(dialogId)">
      <div v-if="JLPT_level" class="JLPT-level">JLPT {{ JLPT_level }}</div>
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
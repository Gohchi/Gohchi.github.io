import { toRefs } from 'vue';

import { closeDialog, showDialog, alignFurigana, speak } from 'tools';

import { ruby } from 'data/kanji.js';
import * as translations from 'data/kanji-translations.js';
import { kanjiFavorites } from 'data/kanji-favorites.js';
import { claimPopover, releasePopover } from 'data/popovers.js';

const meaningOf = translations.meaningOf ?? translations.meaning ?? (() => []);

import {
  zoomStore,
} from 'store';

const KANJI = /[一-鿿々〆]/;

// every instance owns its dialog: the same word can appear many times on a page
let nextDialogId = 0;

// The word with its furigana. Clicking it opens a dialog with the reading, the meanings,
// the kanji it is made of, a Listen button, a link to Jisho and a ★ to save it in the profile.
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
  data() {
    return {
      dialogId: `kanji-dialog-${++nextDialogId}`,
      opened: false, // the dialog body is only rendered once it has been opened
    };
  },
  computed: {
    zoomLevel() {
      if (this.zoom) {
        return zoomStore.getZoomLevel();
      }
    },
    info() {
      return this.entry || this.ruby[this.text];
    },
    reading() {
      return this.info.reading ?? this.info.furigana;
    },
    // [{ text, rt? }]: the reading only goes over the kanji (お父さん -> お + 父(とう) + さん)
    parts() {
      return alignFurigana(this.text, this.reading, this.info.parts);
    },
    // Entries from words.js carry their own, context-specific meanings ((my) father).
    // Entries from kanji.js have no meanings: they live in data/kanji-translations.js.
    meanings() {
      return this.info.eng?.length ? this.info.eng : meaningOf(this.text);
    },
    JLPT_level() {
      return this.info.JLPT_level;
    },
    jishoUrl() {
      return this.text ? 'https://jisho.org/search/' + encodeURIComponent(this.text) : '';
    },
    isFavorite() {
      return kanjiFavorites.has(this.text);
    },
    // words made of several kanji: what each kanji reads and means on its own
    breakdown() {
      const chars = [...new Set([...this.text].filter(char => KANJI.test(char)))];
      if (chars.length < 2) return [];

      return chars
        .map(char => ({
          char,
          reading: this.ruby[char]?.reading ?? '',
          meaning: (meaningOf(char) || []).slice(0, 2).join(', '),
        }))
        .filter(item => item.reading || item.meaning);
    },
  },
  methods: {
    open() {
      this.opened = true;
      claimPopover(this.dialogId, () => this.close()); // closes any open menu / filter first
      this.$nextTick(() => showDialog(this.dialogId));
    },
    close() {
      closeDialog(this.dialogId);
    },
    // Esc, the × and the backdrop all end up here
    onClosed() {
      releasePopover(this.dialogId);
    },
    // only the dark backdrop closes it: the card itself is interactive
    onDialogClick(event) {
      if (event.target === event.currentTarget) this.close();
    },
    toggleFavorite() {
      kanjiFavorites.toggle(this.text);
    },
    listen() {
      speak(this.reading);
    },
  },
  beforeUnmount() {
    releasePopover(this.dialogId);
  },
  template: /*html*/`
    <span class="open-dialog" role="button" tabindex="0" @click="open" @keydown.enter="open" @keydown.space.prevent="open">
      <template v-for="(part, index) in parts" :key="index">
        <ruby v-if="part.rt">{{ part.text }}<rp>(</rp><rt>{{ part.rt }}</rt><rp>)</rp></ruby>
        <template v-else>{{ part.text }}</template>
      </template>
    </span>
    <dialog
      :style="zoomLevel"
      class="kanji-dialog"
      :id="dialogId"
      :aria-label="text + ' · ' + reading"
      @click="onDialogClick"
      @close="onClosed"
    >
      <div v-if="opened" class="kd-card">
        <div class="kd-toolbar">
          <span v-if="JLPT_level" class="kd-level" :class="'level-' + JLPT_level">{{ JLPT_level }}</span>

          <div class="kd-actions">
            <button
              type="button"
              class="kd-action kd-favorite"
              :class="{ on: isFavorite }"
              :aria-pressed="isFavorite"
              :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              @click="toggleFavorite"
            >{{ isFavorite ? '★' : '☆' }}</button>
            <button type="button" class="kd-action" title="Listen" aria-label="Listen" @click="listen">🔊</button>
            <a
              v-if="jishoUrl"
              class="kd-action kd-jisho"
              :href="jishoUrl"
              target="_blank"
              rel="noopener noreferrer"
              title="Look it up on Jisho"
            >Jisho ↗</a>
            <button type="button" class="kd-action kd-close" title="Close" aria-label="Close" autofocus @click="close">&times;</button>
          </div>
        </div>

        <div class="kd-reading">{{ reading }}</div>
        <div class="kd-word">{{ text }}</div>

        <ul v-if="meanings.length" class="kd-meanings">
          <li v-for="(item, index) in meanings" :key="index">{{ item }}</li>
        </ul>

        <section v-if="breakdown.length" class="kd-breakdown" aria-label="Kanji in this word">
          <div v-for="item in breakdown" :key="item.char" class="kd-part">
            <span class="kd-part-char">{{ item.char }}</span>
            <span class="kd-part-reading">{{ item.reading }}</span>
            <span class="kd-part-meaning">{{ item.meaning }}</span>
          </div>
        </section>
      </div>
    </dialog>
  `,
}

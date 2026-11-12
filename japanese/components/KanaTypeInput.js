// Text field for typing kana answers (hiragana-words, katakana-words, kanji-reading, verbs, adjectives).
// Same typing rules as the listen / keyboard practices:
//  - Settings > Typing on: romaji letters turn into kana as they are typed ("kyou" -> きょう);
//    letters that cannot be a kana yet wait at the end ("か" + "s" -> かs).
//  - Enter confirms: a lone n at the end becomes ん, then `submit` is emitted.
//  - IME composition (desktop Japanese IME, phone keyboards) is never touched while it is in progress,
//    and Enter that confirms a composition does not submit.
//
//   <KanaTypeInput ref="input" v-model="value" :readonly="locked" placeholder="..." @submit="check" />
//
// The parent can call this.$refs.input.focus() / .select().

import { romajiInput, romajiToKana, romajiTail } from 'data/romaji-input.js';

export default {
  props: {
    modelValue: { type: String, default: '' },
    readonly: Boolean,
    placeholder: String,
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      romajiInput, // Settings > Typing
      composing: false,
    };
  },
  computed: {
    // letters still waiting to become a kana
    waiting() {
      return romajiInput.on && !this.composing && Boolean(romajiTail(this.modelValue));
    },
  },
  methods: {
    focus() {
      this.$refs.field && this.$refs.field.focus();
    },
    select() {
      this.$refs.field && this.$refs.field.select();
    },
    update(value) {
      const field = this.$refs.field;
      if (field && field.value !== value) field.value = value;
      this.$emit('update:modelValue', value);
    },
    onInput(e) {
      const value = e.target.value;
      if (romajiInput.on && !this.composing && !e.isComposing) {
        this.update(romajiToKana(value));
      } else {
        this.$emit('update:modelValue', value);
      }
    },
    onCompositionEnd(e) {
      this.composing = false;
      this.$emit('update:modelValue', e.target.value);
    },
    onEnter(e) {
      // Enter that confirms an IME composition must not check the answer
      if (this.composing || e.isComposing || e.keyCode === 229) return;
      e.preventDefault();
      if (romajiInput.on) this.update(romajiToKana(this.$refs.field.value, { final: true }));
      this.$emit('submit');
    },
  },
  template: /*html*/`
    <input
      ref="field"
      class="type-input"
      type="text"
      lang="ja"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      enterkeyhint="done"
      :value="modelValue"
      :readonly="readonly"
      :placeholder="placeholder"
      @input="onInput"
      @compositionstart="composing = true"
      @compositionend="onCompositionEnd"
      @keydown.enter="onEnter"
    />
    <div v-if="waiting" class="typing-hint">Keep going… (Enter to confirm what you typed)</div>
  `,
};
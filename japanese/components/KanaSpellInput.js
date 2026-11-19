// The "Words" typing of hiragana-listen, for any practice that asks for a reading:
// the answer (hiragana) is split in kana, one slot per kana, and you type it kana by kana.
// A right kana paints its slot green and moves on; a wrong one shows in red and the same slot is asked again.
//
//   <KanaSpellInput ref="spell" :key="round" :answer="reading" :readonly="locked"
//                   @mistake="onMistake" @done="onSpelled" @next="next" />
//
//   mistake(typed)       a wrong kana was typed
//   done({ mistakes })   every kana was typed right (mistakes = how many wrong ones on the way)
//   next                 Enter after the word is finished (completed or revealed): go to the next word
//
// Methods for the parent: focus(), submit() (the Check button), reveal() (fills the slots with the answer).
// Change `:key` to start the same answer again.
//
// Typing rules are the ones of the listen practice (data/kana-input.js, data/romaji-input.js):
//  - modified kana arrive in steps on phone keyboards (は -> ば -> ぱ) and are not judged until final;
//  - Settings > Typing on: romaji letters become kana ("kyou" -> きょう), っ with "kk", ん with "nn" / a lone n + Enter;
//  - a long vowel mark (ー) also accepts the vowel it stands for (こーひー = こおひい).

import { romajiInput, romajiToKana, romajiTail } from 'data/romaji-input.js';
import { typedVerdict } from 'data/kana-input.js';
import { toHiraganaText } from 'data/kana-romaji.js';
import { expandLongVowels } from 'tools';

// Same split as kanaUnits() in views/KanaPractice.js: しゃ is one unit, っ and ー are units of their own.
const SMALL_YAYUYO = /[ゃゅょャュョ]/;
const kanaUnits = word => {
  const units = [];
  for (const ch of word) {
    const last = units.at(-1);
    if (SMALL_YAYUYO.test(ch) && last && !/^[っッー]$/.test(last)) units[units.length - 1] = last + ch;
    else units.push(ch);
  }
  return units;
};

export default {
  props: {
    answer: { type: String, required: true }, // the reading to spell
    readonly: Boolean, // the answer is already shown: typing is ignored
  },
  emits: ['mistake', 'done', 'next'],
  data() {
    return {
      slots: [], // { char, shown, state: 'todo' | 'right' | 'wrong' | 'revealed' }
      index: 0, // the slot being answered
      mistakes: 0,
      pending: '', // typed so far, on its way to the answer (は -> ば -> ぱ)
      finished: false,
    };
  },
  computed: {
    target() {
      return this.slots[this.index]?.char || '';
    },
  },
  watch: {
    answer() {
      this.build();
      this.$nextTick(() => this.focus());
    },
  },
  created() {
    this.build();
  },
  mounted() {
    this.focus();
  },
  methods: {
    build() {
      this.slots = kanaUnits(this.answer).map(char => ({ char, shown: '', state: 'todo' }));
      this.index = 0;
      this.mistakes = 0;
      this.finished = false;
      this.clear();
    },
    focus() {
      this.$refs.capture && this.$refs.capture.focus();
    },
    clear() {
      this.pending = '';
      if (this.$refs.capture) this.$refs.capture.value = '';
    },

    // the long vowel mark also accepts the vowel of the kana before it
    same(typed, wanted) {
      if (wanted !== 'ー' || this.index === 0) return false;
      const before = toHiraganaText(this.slots[this.index - 1].char).slice(-1);
      return expandLongVowels(before + 'ー').slice(-1) === typed;
    },

    accept() {
      const slot = this.slots[this.index];
      slot.state = 'right';
      slot.shown = slot.char;
      this.index++;
      this.clear();
      if (this.index >= this.slots.length) {
        this.finished = true;
        this.$emit('done', { mistakes: this.mistakes });
      }
    },
    reject(typed) {
      this.mistakes++;
      const slot = this.slots[this.index];
      slot.state = 'wrong';
      slot.shown = typed;
      this.$emit('mistake', typed);
    },

    // Nothing is judged until the text is the answer or cannot become it any more.
    judge(final = false) {
      const input = this.$refs.capture;
      if (!input || !input.value || this.finished) return;
      if (this.readonly) return this.clear();

      let value = input.value;
      let done = final;

      if (romajiInput.on) {
        const typedLetters = /[a-z]/i.test(value); // qwerty letters; kana typed on a kana keyboard are left alone
        // letters become kana as they are typed; the ones that cannot be a kana yet wait at the end
        value = romajiToKana(value, { final });
        input.value = value;
        if (!value) return;

        const tail = romajiTail(value);
        // っ asked and "kk" typed: the っ is right and the second k already starts the next kana
        if (toHiraganaText(this.target) === 'っ' && value.startsWith('っ') && tail && value.length === 1 + tail.length) {
          this.accept();
          if (!this.finished && this.$refs.capture) {
            this.$refs.capture.value = tail;
            this.pending = tail;
          }
          return;
        }
        // a lone n is enough when ん is the answer; otherwise wait for the rest of the syllable
        const waiting = tail && !(tail === 'n' && toHiraganaText(this.target) === 'ん');
        if (waiting && !final) {
          this.pending = value;
          return;
        }
        if (tail === 'n') value = value.slice(0, -1) + 'ん';
        input.value = value;
        // letters turned into kana are complete (ji is じ). Kana typed directly still go step by step (し -> じ)
        done = final || typedLetters;
      }

      const { verdict, typed } = typedVerdict(value, this.target, {
        final: done,
        same: (a, b) => this.same(a, b),
      });

      if (verdict === 'pending') {
        this.pending = typed;
        return;
      }
      if (verdict === 'correct') {
        this.accept();
      } else {
        this.clear();
        this.reject(typed);
      }
    },
    onInput() {
      this.judge(false);
    },
    onEnter(e) {
      // Enter that confirms an IME composition must not check the answer
      if (e.isComposing || e.keyCode === 229) return;
      this.submit();
    },
    // Enter / the Check button: judge what is typed; once the word is finished it goes to the next one
    submit() {
      if (this.finished) this.$emit('next');
      else this.judge(true);
    },
    // gives up: the rest of the word is shown, nothing more is judged
    reveal() {
      for (let i = this.index; i < this.slots.length; i++) {
        this.slots[i].state = 'revealed';
        this.slots[i].shown = this.slots[i].char;
      }
      this.finished = true;
      this.clear();
    },
  },
  template: /*html*/`
    <div class="word-slots" aria-live="polite">
      <span
        v-for="(slot, i) in slots" :key="i"
        class="word-slot"
        :class="[slot.state, { current: i === index && !finished }]"
      >{{ slot.shown || '・' }}</span>
    </div>

    <div class="typed-preview" :class="{ empty: !pending }" aria-live="polite">{{ pending || '・・・' }}</div>

    <input
      id="capture" ref="capture"
      autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"
      @input="onInput" @keydown.enter.prevent="onEnter"
    />
  `,
};
// One implementation for the kana character routes:
//   /hiragana-practice  makeKanaPractice({ script: 'hiragana', mode: 'choice' })   pick the reading
//   /hiragana-keyboard  makeKanaPractice({ script: 'hiragana', mode: 'type' })     type the kana
//   /hiragana-listen    makeKanaPractice({ script: 'hiragana', listen: true })     hear the kana, pick it (4 options)
//                                                                                  or type it; the mode is switched in the page
//   /katakana-practice, /katakana-keyboard and /katakana-listen: same with script 'katakana'
// Hiragana (or katakana) choice and typing share the progress category, so XP is never counted twice.
// Listening has its own category (`kana-<script>-listen`): what you can hear is not what you can read.
// It keeps its own memory for picking the next kana, and it counts for the daily streak, but not for XP.

import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import InfoIcons from 'components/InfoIcons.js';

import template from 'templates/KanaPractice.js';

import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import { KANA_GROUPS, kanaTable, toHiraganaText, toKatakana } from 'data/kana-romaji.js';
import { typedVerdict, typingHint } from 'data/kana-input.js';
import { romajiInput, romajiToKana, romajiTail } from 'data/romaji-input.js';
import { feedbackMixin } from 'data/feedback.js';
import { isRouteUnlocked } from 'data/progression.js';
import { shuffle, speak } from 'tools';
import wordsData from 'data/words.js';
import {
  MAX_MEMORY,
  getEntry,
  recordAnswer,
  getStats,
  resetProgress,
  weightedPick,
} from 'data/progress.js';

const HISTORY_LIMIT = 50;

const LISTEN_MODE_KEY = 'kana-listen-input-mode';
const UNIT_KEY = 'kana-listen-unit';
const GROUP_KEYS = KANA_GROUPS.map(({ key }) => key);

// Sounds that cannot be told apart by ear: を is read o, ぢ is じ, づ is ず (romaji already says so)
// A word split in what is typed in one go: しゃ is one unit, っ and ー are units of their own
const SMALL_YAYUYO = /[ゃゅょャュョ]/;
export const kanaUnits = word => {
  const units = [];
  for (const ch of word) {
    const last = units.at(-1);
    if (SMALL_YAYUYO.test(ch) && last && !/^[っッー]$/.test(last)) units[units.length - 1] = last + ch;
    else units.push(ch);
  }
  return units;
};

const soundOf = (table, kana) => (/^[をヲ]$/.test(kana) ? 'o' : table[kana]);

export function makeKanaPractice({ script, mode = 'choice', listen = false }) {
  // every kana of the script with its romaji (basic + extras), to look readings up
  const table = { ...kanaTable(script, GROUP_KEYS), 'ー': 'long vowel' };
  // every kana-only word of this script (たまご, コーヒー): what the Words mode speaks
  const WORDS = wordsData.filter(item => item.type === script);
  // the kana a wrong option can come from in Words mode, whatever the Kana filter says
  const ALL_KANA = Object.keys(kanaTable(script, GROUP_KEYS)).filter(kana => !/^[ぢづヂヅ]$/.test(kana));
  const category = listen ? `kana-${script}-listen` : `kana-${script}`;
  const Script = script === 'hiragana' ? 'HIRAGANA' : 'KATAKANA';

  // the other way to practice the same kana: shown only when that route is unlocked
  const siblingRoute = `/${script}-${mode === 'type' ? 'practice' : 'keyboard'}`;

  return {
    mixins: [feedbackMixin],
    components: { MainHeader, SessionHistory, WordCorner, InfoIcons, FilterMenu },
    data() {
      return {
        // listen: 'choice' (pick among 4) or 'type', remembered; the other routes are fixed
        mode: listen ? (localStorage.getItem(LISTEN_MODE_KEY) === 'type' ? 'type' : 'choice') : mode,
        listen,
        // listen: one kana at a time ('kana') or a whole word, kana by kana ('word'), remembered
        unit: listen && localStorage.getItem(UNIT_KEY) === 'word' ? 'word' : 'kana',
        word: null, // Words mode: the item being spelled
        slots: [], // Words mode: one { char, shown, state: 'todo' | 'right' | 'wrong' } per kana of the word
        index: 0, // Words mode: the slot being answered
        mistakes: 0, // Words mode: wrong answers in this word
        finished: false, // Words mode: the word is complete, the next one is about to come
        MAX_MEMORY,
        romajiInput, // Settings > Typing: a QWERTY keyboard writes kana (sa -> さ)
        sessionHistory: [],

        groupOptions: KANA_GROUPS,
        // Basic is the default: dakuten, sokuon and combos are added from the Kana filter
        selectedGroups: loadSelection(`kana-groups-${script}`, ['basic']).filter(key => GROUP_KEYS.includes(key)),
        target: '',
        pending: '', // typed so far, on its way to the answer (は -> ば -> ぱ)
        kanaOptions: [],
        score: 0,
        streak: 0,
        last: '-',
        status: listen ? 'Press 🔊 to hear the kana.' : 'Click anywhere and start typing.',
        statusClass: 'status',
        inputValue: '',
        progressVersion: 0, // bumped after each save so the memory bar/stats refresh
      };
    },
    computed: {
      // the kana practiced: the groups chosen in the toolbar (never empty)
      KANA() {
        const groups = this.selectedGroups.length ? this.selectedGroups : ['basic'];
        const pool = Object.keys(kanaTable(script, groups));
        // listening: kana that sound the same as another one are never asked (づ/ず, ぢ/じ)
        return listen ? pool.filter(kana => !/^[ぢづヂヅ]$/.test(kana)) : pool;
      },
      wordMode() {
        return listen && this.unit === 'word';
      },
      hint() {
        return !listen && this.mode === 'type' && !romajiInput.on ? typingHint(this.target) : '';
      },
      title() {
        if (listen) return `${Script} LISTEN`;
        return `${Script} ${this.mode === 'type' ? 'KEYBOARD' : 'CHARACTERS'}`;
      },
      // the other way to practice the same kana (listening switches mode in the page instead)
      siblingTo() {
        return !listen && isRouteUnlocked(siblingRoute) ? siblingRoute : '';
      },
      siblingIcon() {
        return this.mode === 'type' ? 'check-icon' : 'keyboard-icon';
      },
      siblingTitle() {
        return this.mode === 'type' ? 'Options mode' : 'Type mode';
      },
      kanaMemory() {
        this.progressVersion; // reactive dependency
        return this.target ? getEntry(category, this.target).memory : 0;
      },
      kanaStats() {
        this.progressVersion; // reactive dependency
        return getStats(category, this.KANA);
      },
    },
    methods: {
      pushHistory(entry) {
        this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
        if (this.sessionHistory.length > HISTORY_LIMIT) this.sessionHistory.length = HISTORY_LIMIT;
      },
      buildKanaOptions(correctKana, pool = this.KANA) {
        // options must not repeat a reading (じ/ぢ are both "ji"), nor a sound when listening
        const key = kana => (listen ? soundOf(table, kana) : table[kana]);
        const taken = new Set([key(correctKana)]);
        const wrongs = [];
        for (const kana of shuffle(pool)) {
          if (wrongs.length === 3) break;
          if (taken.has(key(kana))) continue;
          taken.add(key(kana));
          wrongs.push(kana);
        }
        return shuffle([correctKana, ...wrongs]).map(k => ({ kana: k, romaji: table[k] }));
      },
      setGroups(groups) {
        this.selectedGroups = groups;
        saveSelection(`kana-groups-${script}`, groups);
        this.newTarget();
      },
      // Words mode: pick a word (the ones with weaker kana come more often) and start at its first kana
      newWord() {
        clearTimeout(this.nextTimer);
        const pool = WORDS.length > 1 ? WORDS.filter(item => item !== this.word) : WORDS;
        const weights = pool.map(item => kanaUnits(item.word).reduce(
          (sum, unit) => sum + (MAX_MEMORY + 1) - getEntry(category, unit).memory, 0,
        ));
        let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
        this.word = pool[weights.findIndex(weight => (roll -= weight) < 0)] || pool[0];

        this.slots = kanaUnits(this.word.word).map(char => ({ char, shown: '', state: 'todo' }));
        this.index = 0;
        this.mistakes = 0;
        this.finished = false;
        this.target = this.slots[0].char;
        this.kanaOptions = this.buildKanaOptions(this.target, ALL_KANA);
        this.status = this.mode === 'type' ? 'Listen and type the word, kana by kana.' : 'Listen and pick each kana of the word.';
        this.statusClass = 'status';
        this.inputValue = '';
        this.clearTyped();
        if (this.mode === 'type') this.$nextTick(() => this.focusInput());
        this.$nextTick(() => this.playTarget());
      },
      // Words mode: the right kana turns its slot green and moves on; the last one completes the word
      advanceWord() {
        const slot = this.slots[this.index];
        slot.state = 'right';
        slot.shown = slot.char;
        this.index++;

        if (this.index >= this.slots.length) {
          this.finished = true;
          this.status = `${this.word.word} = ${this.word.meaning}`;
          this.statusClass = 'status ok';
          this.clearTyped();
          this.nextTimer = setTimeout(() => this.newWord(), 1600);
          return;
        }
        this.target = this.slots[this.index].char;
        this.kanaOptions = this.buildKanaOptions(this.target, ALL_KANA);
        this.status = 'Correct!';
        this.statusClass = 'status ok';
        this.inputValue = '';
        this.clearTyped();
      },
      // Words mode: the wrong kana shows in its slot, in red, and the same slot is asked again
      markWrong(candidate) {
        this.mistakes++;
        const slot = this.slots[this.index];
        slot.state = 'wrong';
        slot.shown = candidate;
      },
      newTarget() {
        if (this.wordMode) return this.newWord();
        clearTimeout(this.nextTimer);
        this.word = null;
        this.slots = [];
        this.finished = false;
        this.target = weightedPick(category, this.KANA, k => k);
        this.kanaOptions = this.buildKanaOptions(this.target);
        if (listen) {
          this.status = this.mode === 'type' ? 'Listen and type the kana.' : 'Listen and pick the kana.';
        } else {
          this.status = this.mode === 'type' ? 'Type the kana shown above.' : 'Pick the reading that matches.';
        }
        this.statusClass = 'status';
        this.inputValue = '';
        this.clearTyped();
        if (this.mode === 'type') this.$nextTick(() => this.focusInput());
        if (listen) this.$nextTick(() => this.playTarget());
      },
      // listening: say the kana (again)
      // listening: a click anywhere on the card replays the sound, except on buttons / fields / links
      onCardClick(event) {
        if (event.target.closest?.('button, a, input, textarea, select, label, .row, .choice-grid, .info-icons, .kanji-corner')) return;
        this.playTarget();
      },
      playTarget() {
        if (!this.target) return;
        window.speechSynthesis?.cancel();
        speak(this.word ? this.word.word : this.target);
      },
      // listening: switch between "pick among 4" and "type it"
      toggleMode() {
        this.mode = this.mode === 'type' ? 'choice' : 'type';
        try {
          localStorage.setItem(LISTEN_MODE_KEY, this.mode);
        } catch {
          // ignore privacy-mode errors
        }
        this.newTarget();
      },
      // listening: one kana at a time <-> whole words
      toggleUnit() {
        this.unit = this.unit === 'word' ? 'kana' : 'word';
        try {
          localStorage.setItem(UNIT_KEY, this.unit);
        } catch {
          // ignore privacy-mode errors
        }
        this.newTarget();
      },
      resetScore() {
        this.score = 0;
        this.streak = 0;
        resetProgress(category);
        this.progressVersion++;
        this.status = 'Score and memory reset.';
        this.statusClass = 'status';
        this.$nextTick(() => this.focusInput());
      },
      clearTyped() {
        this.pending = '';
        if (this.$refs.capture) this.$refs.capture.value = '';
      },
      handleKana(candidate, correct = candidate === this.target) {
        this.last = candidate;
        const heard = this.target;
        recordAnswer(category, this.target, correct);
        this.flash(correct, correct ? this.streak + 1 : 0);
        this.progressVersion++;

        this.pushHistory({
          type: 'kana',
          prompt: this.target,
          detail: this.word ? this.word.word : '',
          chosen: candidate,
          correctAnswer: this.target,
          isCorrect: correct,
        });

        if (correct) {
          this.score++;
          this.streak++;
          if (this.wordMode) return this.advanceWord();
          this.status = 'Correct!';
          this.statusClass = 'status ok';
          this.newTarget();
          if (listen) { // show what it was while the next one plays
            this.status = `Correct! ${heard} = ${table[heard]}`;
            this.statusClass = 'status ok';
          }
        } else {
          this.streak = 0;
          this.status = `Wrong: "${candidate}"`;
          this.statusClass = 'status bad';
          if (this.wordMode) this.markWrong(candidate);
          else if (listen) this.playTarget(); // hear it once more
        }
      },
      // The hidden input receives what the keyboard types. Modified kana arrive in steps (は, ば, ぱ),
      // so nothing is judged until the text is the answer or cannot become it any more.
      judgeTyped(final = false) {
        const input = this.$refs.capture;
        if (!input || !input.value || this.finished) return;

        let value = input.value;
        let done = final;
        if (romajiInput.on) {
          // letters become kana as they are typed; the ones that cannot be a kana yet wait at the end
          value = romajiToKana(value, { final });
          input.value = value;
          if (!value) return;
          const tail = romajiTail(value);
          // a lone n is enough when ん is the answer; otherwise wait for the rest of the syllable
          const waiting = tail && !(tail === 'n' && toHiraganaText(this.target) === 'ん');
          if (waiting && !final) {
            this.pending = value;
            this.status = 'Keep going… (Enter to check what you typed)';
            this.statusClass = 'status';
            return;
          }
          if (tail === 'n') value = value.slice(0, -1) + 'ん';
          input.value = value;
          done = true; // the letters are kana now, nothing is on its way to another one
        }

        const { verdict, typed } = typedVerdict(value, this.target, {
          final: done,
          // listening: a homophone is the same answer
          same: listen ? (a, b) => {
            const inScript = kana => (script === 'katakana' ? toKatakana(kana) : kana);
            const sound = soundOf(table, inScript(a));
            return sound !== undefined && sound === soundOf(table, inScript(b));
          } : undefined,
        });

        if (verdict === 'pending') {
          this.pending = typed;
          this.status = typed ? 'Keep going… (Enter to check what you typed)' : this.status;
          this.statusClass = 'status';
          return;
        }

        // katakana is typed on a hiragana keyboard: show / compare it in the script asked
        const shown = script === 'katakana' ? toKatakana(typed) : typed;
        this.inputValue = input.value;
        this.clearTyped();
        this.handleKana(verdict === 'correct' ? this.target : shown, verdict === 'correct');
      },
      onInput() {
        this.judgeTyped(false);
      },
      submitTyped() {
        this.judgeTyped(true);
      },
      chooseKanaOption(option) {
        if (this.finished) return;
        this.handleKana(option.kana);
      },
      focusInput() {
        if (this.mode === 'type') this.$refs.capture && this.$refs.capture.focus();
      },
      onDocumentClick() {
        if (this.mode === 'type') this.focusInput();
      },
    },
    mounted() {
      this.newTarget();
      document.addEventListener('click', this.onDocumentClick);
    },
    beforeUnmount() {
      clearTimeout(this.nextTimer);
      document.removeEventListener('click', this.onDocumentClick);
    },
    template,
  };
}

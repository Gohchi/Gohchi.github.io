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
import { KANA_GROUPS, kanaTable, toKatakana } from 'data/kana-romaji.js';
import { typedVerdict, typingHint } from 'data/kana-input.js';
import { feedbackMixin } from 'data/feedback.js';
import { isRouteUnlocked } from 'data/progression.js';
import { shuffle, speak } from 'tools';
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
const GROUP_KEYS = KANA_GROUPS.map(({ key }) => key);

// Sounds that cannot be told apart by ear: を is read o, ぢ is じ, づ is ず (romaji already says so)
const soundOf = (table, kana) => (/^[をヲ]$/.test(kana) ? 'o' : table[kana]);

export function makeKanaPractice({ script, mode = 'choice', listen = false }) {
  // every kana of the script with its romaji (basic + extras), to look readings up
  const table = kanaTable(script, GROUP_KEYS);
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
        MAX_MEMORY,
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
      hint() {
        return !listen && this.mode === 'type' ? typingHint(this.target) : '';
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
      buildKanaOptions(correctKana) {
        // options must not repeat a reading (じ/ぢ are both "ji"), nor a sound when listening
        const key = kana => (listen ? soundOf(table, kana) : table[kana]);
        const taken = new Set([key(correctKana)]);
        const wrongs = [];
        for (const kana of shuffle(this.KANA)) {
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
      newTarget() {
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
        speak(this.target);
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
          detail: '',
          chosen: candidate,
          correctAnswer: this.target,
          isCorrect: correct,
        });

        if (correct) {
          this.score++;
          this.streak++;
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
          if (listen) this.playTarget(); // hear it once more
        }
      },
      // The hidden input receives what the keyboard types. Modified kana arrive in steps (は, ば, ぱ),
      // so nothing is judged until the text is the answer or cannot become it any more.
      judgeTyped(final = false) {
        const input = this.$refs.capture;
        if (!input || !input.value) return;

        const { verdict, typed } = typedVerdict(input.value, this.target, {
          final,
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
      document.removeEventListener('click', this.onDocumentClick);
    },
    template,
  };
}

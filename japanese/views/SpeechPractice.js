import MainHeader from 'components/MainHeader.js';
import SessionHistory from 'components/SessionHistory.js';
import WordCorner from 'components/WordCorner.js';
import InfoIcons from 'components/InfoIcons.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import KanjiPoolMenu from 'components/KanjiPoolMenu.js';

import template from 'templates/SpeechPractice.js';

import speechWords from 'data/speech-words.js';
import { ruby } from 'data/kanji.js';
import { words as wordForms } from 'data/words.js';
import { feedbackMixin } from 'data/feedback.js';
import { normalizeReading } from 'tools';

const HISTORY_LIMIT = 50;
const NEXT_DELAY = 900; // ms before moving to the next word after a correct answer

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const TYPES = [
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
  { key: 'kanji', label: 'Kanji' },
];
const TYPE_KEYS = TYPES.map(({ key }) => key);

const LEVELS_KEY = 'speech-practice-levels';
const TYPES_KEY = 'speech-practice-types';
// Words the user turned off in the pool. Stored as "excluded" so new words are in the pool by default.
const EXCLUDED_KEY = 'speech-practice-excluded';

const SpeechRecognitionAPI = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

const ERROR_MESSAGES = {
  'not-allowed': 'Microphone permission was denied. Allow it in your browser and try again.',
  'service-not-allowed': 'Speech recognition is not allowed in this browser or context.',
  'audio-capture': 'No microphone was found.',
  'network': 'Speech recognition needs a network connection.',
  'language-not-supported': 'Japanese is not supported by this recognizer.',
};

// Punctuation and spaces are ignored; katakana, hiragana and long vowels are
// compared the same way as the other practice views (normalizeReading).
const normalize = text => normalizeReading(String(text ?? '').replace(/[。、．，.,!?！？「」『』\s]/g, ''));

// Every written form with the same reading (おかあさん -> お母さん, ねこ -> 猫),
// taken from data/kanji.js (kanji runs) and data/words.js (full words with okurigana).
let readingIndex = null;

const getReadingIndex = () => {
  if (!readingIndex) {
    readingIndex = new Map();
    [ruby, wordForms].forEach(dictionary => {
      Object.entries(dictionary).forEach(([form, entry]) => {
        const key = normalize(entry.furigana);
        if (!readingIndex.has(key)) readingIndex.set(key, new Set());
        readingIndex.get(key).add(form);
      });
    });
  }
  return readingIndex;
};

const homophones = reading => [...(getReadingIndex().get(normalize(reading)) || [])];

export default {
  mixins: [feedbackMixin],
  components: {
    MainHeader,
    SessionHistory,
    WordCorner,
    InfoIcons,
    FilterMenu,
    KanjiPoolMenu,
  },
  data() {
    return {
      supported: !!SpeechRecognitionAPI,
      listening: false,

      words: speechWords,
      target: null,

      levelOptions: LEVELS.map(level => ({ key: level, label: level })),
      typeOptions: TYPES,
      selectedLevels: loadSelection(LEVELS_KEY, LEVELS).filter(l => LEVELS.includes(l)),
      selectedTypes: loadSelection(TYPES_KEY, TYPE_KEYS).filter(t => TYPE_KEYS.includes(t)),
      excludedWords: loadSelection(EXCLUDED_KEY, []),

      heard: '', // live transcript (interim or final)
      typedValue: '', // fallback when SpeechRecognition is not available
      status: '',
      statusClass: 'status',

      score: 0,
      streak: 0,
      locked: false, // correct answer shown, waiting for the next word
      revealed: false,
      sessionHistory: [],
    };
  },
  computed: {
    // Words that pass the JLPT + type filters (what the pool matrix shows).
    // With every level selected nothing is filtered by level, so words without a level still show up.
    levelTypeWords() {
      const allLevels = this.selectedLevels.length === LEVELS.length;
      return this.words.filter(({ level, type }) => (
        this.selectedTypes.includes(type)
        && (allLevels || this.selectedLevels.includes(level))
      ));
    },
    excludedSet() {
      return new Set(this.excludedWords);
    },
    // The practice pool: JLPT + type filters AND not turned off in the pool matrix
    filteredWords() {
      return this.levelTypeWords.filter(({ word }) => !this.excludedSet.has(word));
    },
    poolItems() {
      return this.levelTypeWords.map(({ word, reading, meaning }) => ({
        word,
        reading,
        meaning,
        memory: 0, // no progress is saved for speech practice yet
      }));
    },
    // Everything that counts as a correct answer for the current word, already normalized
    acceptedForms() {
      if (!this.target) return new Set();
      const { word, reading, accept = [] } = this.target;
      return new Set(
        [word, reading, ...accept, ...homophones(reading)].map(normalize)
      );
    },
  },
  created() {
    // non-reactive state
    this.internals = { recognition: null, timer: 0, gotResult: false, hadError: false };
  },
  methods: {
    pushHistory(entry) {
      this.sessionHistory.unshift({ ...entry, id: Date.now() + '-' + Math.random() });
      if (this.sessionHistory.length > HISTORY_LIMIT) {
        this.sessionHistory.length = HISTORY_LIMIT;
      }
    },

    // --- filters ---
    setLevels(levels) {
      this.selectedLevels = levels;
      saveSelection(LEVELS_KEY, levels);
      this.refreshTargetIfNeeded();
    },
    setTypes(types) {
      this.selectedTypes = types;
      saveSelection(TYPES_KEY, types);
      this.refreshTargetIfNeeded();
    },
    setExcluded(words) {
      this.excludedWords = words;
      saveSelection(EXCLUDED_KEY, words);
      this.refreshTargetIfNeeded();
    },
    // After a filter change, pick a new word only if the current one left the pool
    refreshTargetIfNeeded() {
      if (!this.target || !this.filteredWords.includes(this.target)) {
        this.newTarget();
      }
    },

    // --- targets ---
    newTarget() {
      this.stopListening();
      clearTimeout(this.internals.timer);

      // avoid the same word twice in a row
      const previous = this.target?.word;
      const pool = this.filteredWords.length > 1
        ? this.filteredWords.filter(({ word }) => word !== previous)
        : this.filteredWords;

      this.target = pool[Math.floor(Math.random() * pool.length)] || null;
      this.heard = '';
      this.typedValue = '';
      this.locked = false;
      this.revealed = false;

      if (!this.target) {
        this.statusClass = 'status bad';
        this.status = this.levelTypeWords.length
          ? 'Every word is turned off in the pool.'
          : 'No words match the selected filters.';
        return;
      }

      this.statusClass = 'status';
      this.status = this.supported
        ? 'Press the microphone and say the word.'
        : 'Speech recognition is not available here. Type the word to test instead.';
    },

    // --- grading ---
    isMatch(candidate) {
      const value = normalize(candidate);
      return !!value && this.acceptedForms.has(value);
    },
    // `candidates` = every alternative the recognizer gave (best first)
    grade(candidates) {
      if (!this.target || this.locked) return;

      const list = candidates.filter(Boolean);
      const matched = list.find(this.isMatch);
      const correct = !!matched;
      // show what actually matched; otherwise the recognizer's best guess
      const chosen = matched || list[0] || '';
      const { word, reading, meaning } = this.target;

      this.heard = chosen;
      this.flash(correct, correct ? this.streak + 1 : 0);
      this.pushHistory({
        type: 'speech',
        prompt: word,
        detail: meaning,
        chosen: chosen || '(nothing)',
        correctAnswer: reading,
        isCorrect: correct,
      });

      if (correct) {
        this.score++;
        this.streak++;
        this.locked = true;
        this.statusClass = 'status ok';
        this.status = `Correct! ${word} (${reading})`;
        this.internals.timer = setTimeout(() => this.newTarget(), NEXT_DELAY);
      } else {
        this.streak = 0;
        this.statusClass = 'status bad';
        this.status = chosen ? `Heard "${chosen}". Try again.` : 'Not quite, try again.';
      }
    },

    // --- speech recognition ---
    toggleListening() {
      if (this.listening) this.stopListening();
      else this.startListening();
    },
    startListening() {
      if (!this.supported || !this.target || this.locked || this.listening) return;

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.maxAlternatives = 5;
      recognition.continuous = false;

      this.internals.gotResult = false;
      this.internals.hadError = false;
      this.internals.recognition = recognition;

      recognition.onstart = () => {
        this.listening = true;
        this.heard = '';
        this.statusClass = 'status';
        this.status = 'Listening... say the word.';
      };

      recognition.onresult = event => {
        const result = event.results[event.results.length - 1];
        const alternatives = [...result].map(({ transcript }) => transcript.trim());
        this.heard = alternatives[0] || '';

        if (result.isFinal) {
          this.internals.gotResult = true;
          this.grade(alternatives);
        }
      };

      recognition.onerror = event => {
        this.internals.hadError = true;
        if (event.error === 'aborted') return;
        if (event.error === 'no-speech') {
          this.statusClass = 'status bad';
          this.status = "Didn't hear anything. Try again.";
          return;
        }
        this.statusClass = 'status bad';
        this.status = ERROR_MESSAGES[event.error] || `Speech recognition error: ${event.error}`;
      };

      recognition.onend = () => {
        this.listening = false;
        this.internals.recognition = null;
        if (!this.internals.gotResult && !this.internals.hadError) {
          this.statusClass = 'status bad';
          this.status = "Didn't catch that. Try again.";
        }
      };

      try {
        recognition.start();
      } catch (error) {
        this.listening = false;
        this.statusClass = 'status bad';
        this.status = 'Could not start the microphone.';
      }
    },
    stopListening() {
      const { recognition } = this.internals;
      if (recognition) {
        try { recognition.abort(); } catch (e) { /* ignore */ }
      }
      this.listening = false;
    },

    // --- fallback (no SpeechRecognition) ---
    onTypedEnter(e) {
      // Enter that confirms an IME composition must not check the answer
      if (e.isComposing || e.keyCode === 229) return;
      const value = this.typedValue.trim();
      if (!value) return;
      this.heard = value;
      this.grade([value]);
      if (!this.locked) this.$nextTick(() => this.$refs.typedInput && this.$refs.typedInput.select());
    },

    // --- actions ---
    reveal() {
      if (!this.target || this.locked) return;
      const { word, reading, meaning } = this.target;

      // giving up counts as a miss, once per word
      if (!this.revealed) {
        this.streak = 0;
        this.flash(false);
        this.pushHistory({
          type: 'speech',
          prompt: word,
          detail: meaning,
          chosen: '(revealed)',
          correctAnswer: reading,
          isCorrect: false,
        });
      }
      this.revealed = true;
      this.statusClass = 'status';
      this.status = `Answer: ${reading}`;
    },
    resetScore() {
      this.score = 0;
      this.streak = 0;
      this.statusClass = 'status';
      this.status = 'Score reset.';
    },
  },
  mounted() {
    this.newTarget();
  },
  beforeUnmount() {
    this.stopListening();
    clearTimeout(this.internals.timer);
  },
  template,
};
import MainHeader from 'components/MainHeader.js';
import { ruby } from 'data/kanji.js';
import template from 'templates/PrintPractice.js';

const kana = {
  hiragana: {
    'あ': { strokes: [{ x: 1.2, y: 3.2 }, { x: 1.8, y: 2.2 }, { x: 3, y: 3.8 }]},
    'い': { strokes: [{ x: 1.5, y: 2.5 }, { x: 3.1, y: 2.8 }]},
    'う': { strokes: [{ x: 1.6, y: 2.6 }, { x: 1.4, y: 3.6 }]},
    'え': {},
    'お': {},
    'か': {},
    'き': {},
    'く': {},
    'け': {},
    'こ': {},
    'さ': {},
    'し': {},
    'す': {}, 
    'せ': {}, 
    'そ': {},
    'た': {},
    'ち': {}, 
    'つ': {}, 
    'て': {}, 
    'と': {},
    'な': {}, 
    'に': {}, 
    'ぬ': {},
    'ね': {},
    'の': {},
    'は': {},
    'ひ': {}, 
    'ふ': {},
    'へ': {}, 
    'ほ': {},
    'ま': {}, 
    'み': {},
    'む': {}, 
    'め': {},
    'も': {},
    'や': {},
    'ゆ': {},
    'よ': {},
    'ら': {},
    'り': {}, 
    'る': {},
    'れ': {},
    'ろ': {},
    'わ': {},
    'を': {},
    'ん': {},
  },
  katakana: {
    'ア': { strokes: [{ x: 1.2, y: 3.2 }, { x: 2, y: 3.5 }]},
    'イ': {},
    'ウ': {},
    'エ': {},
    'オ': {},
    'カ': {},
    'キ': {},
    'ク': {},
    'ケ': {},
    'コ': {},
    'サ': {},
    'シ': {},
    'ス': {},
    'セ': {},
    'ソ': {},
    'タ': {},
    'チ': {},
    'ツ': {},
    'テ': {},
    'ト': {},
    'ナ': {},
    'ニ': {},
    'ヌ': {},
    'ネ': {},
    'ノ': {},
    'ハ': {},
    'ヒ': {},
    'フ': {},
    'ヘ': {},
    'ホ': {},
    'マ': {},
    'ミ': {},
    'ム': {},
    'メ': {},
    'モ': {},
    'ヤ': {},
    'ユ': {},
    'ヨ': {},
    'ラ': {},
    'リ': {},
    'ル': {},
    'レ': {},
    'ロ': {},
    'ワ': {},
    'ヲ': {},
    'ン': {}
  }
};

const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default {
  components: { MainHeader },
  data() {
    return {
      script: 'hiragana',
      level: 'N5',
      levels,
      kana,
      ruby,
    };
  },
  computed: {
    title() {
      return this.script === 'kanji' ? 'Kanji' : this.script[0].toUpperCase() + this.script.slice(1);
    },
    items() {
      if (this.script === 'kanji') {
        return Object.entries(this.ruby)
          .filter(([word, entry]) => [...word].length === 1 && entry.JLPT_level === this.level)
          .map(([character, entry]) => ({ character, reading: entry.furigana }));
      }

      return Object.entries(this.kana[this.script])
        .map(([character, entry]) => ({ character, strokes: entry.strokes, reading: '' }));
    }
  },
  methods: {
    printWorksheet() {
      window.print();
    }
  },
  template
};

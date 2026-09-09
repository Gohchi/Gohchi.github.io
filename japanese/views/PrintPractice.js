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
      script: 'kanji',
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
    },
    pages() {
      const pages = [];
      const firstPageRows = 8;
      pages.push(this.items.slice(0, firstPageRows));
      for (let start = firstPageRows; start < this.items.length; start += firstPageRows) {
        pages.push(this.items.slice(start, start + firstPageRows));
      }
      return pages;
    }
  },
  watch: {
    items: {
      handler() {
        this.$nextTick(() => this.drawPracticeSheet());
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawPracticeSheet();
      setTimeout(() => this.drawPracticeSheet(), 100); // fix
    }
    );
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.drawPracticeSheet);
  },
  methods: {
    drawPracticeSheet() {
      const canvases = Array.isArray(this.$refs.practiceSheets)
        ? this.$refs.practiceSheets
        : [this.$refs.practiceSheets];
      if (!canvases[0]) return;

      canvases.forEach((canvas, pageIndex) => {
        this.drawPracticePage(canvas, this.pages[pageIndex], pageIndex);
      });
    },
    drawPracticePage(canvas, pageItems, pageIndex) {
      const width = Math.max(canvas.clientWidth, 320);
      const columns = 1; //width < 640 ? 2 : 4;
      const cardWidth = width - 48;
      const cardHeight = 78; //width < 640 ? 150 : 176;
      const rows = Math.ceil(pageItems.length / columns);
      const height = 72 + rows * (cardHeight);
      const scale = window.devicePixelRatio || 1;

      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      context.scale(scale, scale);
      context.fillStyle = '#fffdf8';
      context.fillRect(0, 0, width, height);

      context.fillStyle = '#273f3a';
      context.font = '700 13px Meiryo, sans-serif';
      context.fillText(`${this.title}${this.script === 'kanji' ? ` ${this.level}` : ''}  Page ${pageIndex + 1}`, 24, 28);
      context.fillStyle = '#58635e';
      context.font = '12px Meiryo, sans-serif';
      context.fillText('Name: ____________________', width - 220, 28);
      context.strokeStyle = '#c9c2b5';
      context.beginPath();
      context.moveTo(24, 48);
      context.lineTo(width - 24, 48);
      context.stroke();

      pageItems.forEach((item, index) => {
        const row = Math.floor(index);
        const x = 24;
        const y = 60 + row * cardHeight;
        this.drawPracticeCard(context, item, x, y, cardWidth, cardHeight);
      });
    },
    drawPracticeCard(context, item, x, y, width, height) {
      context.fillStyle = '#fffdf8';
      context.strokeStyle = '#d7d0c4';
      context.fillRect(x, y, width, height);
      context.strokeRect(x, y, width, height);

      context.save();
      context.beginPath();
      context.rect(x, y, width, height);
      context.clip();
      context.strokeStyle = '#e7e0d5';
      context.lineWidth = 1;
      for (let gridX = x + 16; gridX < x + width; gridX += 24) {
        context.beginPath();
        context.moveTo(gridX, y);
        context.lineTo(gridX, y + height);
        context.stroke();
      }
      for (let gridY = y + 16; gridY < y + height; gridY += 24) {
        context.beginPath();
        context.moveTo(x, gridY);
        context.lineTo(x + width, gridY);
        context.stroke();
      }
      context.restore();

      context.fillStyle = '#273f3a';
      context.font = '44px "Zen Antique Soft", Meiryo, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(item.character, x + 40, y + 40);

      if (item.strokes) {
        context.font = '6px "Zen Antique Soft", Meiryo, sans-serif';

        for (const i in item.strokes) {
          const stroke = item.strokes[i];

          context.beginPath();
          context.arc(x + stroke.x * 16, y + stroke.y * 16 - 16, 3.5, 0, 2 * Math.PI);
          context.fillStyle = "red";
          context.fill();

          context.fillStyle = 'white';
          context.fillText(1 + +i, x + stroke.x * 16, y + stroke.y * 16 - 16);
        }
      }

      const boxStart = x + 80;
      const boxWidth = 60;
      context.strokeStyle = '#a9a196';
      context.setLineDash([3, 3]);
      context.beginPath();
      context.moveTo(boxStart, y + 10);
      context.lineTo(boxStart, y + 10 + boxWidth);
      context.stroke();

      for (let box = 0; box < 17; box += 1) {
        const boxX = boxStart + box * boxWidth;
        context.setLineDash([3, 3]);
        context.beginPath();

        context.moveTo(boxX, y + 10);
        context.lineTo(boxX + boxWidth, y + 10);
        context.lineTo(boxX + boxWidth, y + 10 + boxWidth);
        context.lineTo(boxX, y + 10 + boxWidth);

        context.stroke();

        context.setLineDash([]);
        context.fillStyle = `rgba(39, 63, 58, ${.18 - box * .01})`;
        context.font = `44px "Zen Antique Soft", Meiryo, sans-serif`;
        context.fillText(item.character, boxX + boxWidth / 2, y + 10 + boxWidth / 2);
      }

      if (item.reading) {
        context.fillStyle = '#b34f35';
        context.font = '12px Meiryo, sans-serif';
        context.textAlign = 'left';
        context.fillText(item.reading, x + 4, y + 9);
      }
      context.textAlign = 'start';
      context.textBaseline = 'alphabetic';
    },
    printWorksheet() {
      window.print();
    },
  },
  template
};

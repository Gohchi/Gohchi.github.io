import MainHeader from 'components/MainHeader.js';
import { ruby } from 'data/kanji.js';
import template from 'templates/PrintPractice.js';

const kana = {
  hiragana: {
    'あ': { strokes: [{ x: 1.2, y: 3.2 }, { x: 1.8, y: 2.2 }, { x: 3, y: 3.8 }]},
    'い': { strokes: [{ x: 1.5, y: 2.5 }, { x: 3.1, y: 2.9 }]},
    'う': { strokes: [{ x: 1.7, y: 2.6 }, { x: 1.4, y: 3.6 }]},
    'え': { strokes: [{ x: 1.8, y: 2.7 }, { x: 1.3, y: 3.3 }]},
    'お': { strokes: [{ x: 1, y: 3.5 }, { x: 1.8, y: 2.2 }, { x: 3.2, y: 2.9 }]},
    'か': { strokes: [{ x: 0.9, y: 3.5 }, { x: 1.9, y: 2.2 }, { x: 3.1, y: 2.9 }]},
    'き': { strokes: [{ x: 1.3, y: 2.8 }, { x: 1.2, y: 3.6 }, { x: 2.0, y: 2 }]},
    'く': { strokes: [{ x: 3.1, y: 2.2 }]},
    'け': { strokes: [{ x: 1.4, y: 2.2 }, { x: 2.4, y: 2.9 }, { x: 3, y: 2.2 }]},
    'こ': { strokes: [{ x: 1.4, y: 2.8 }, { x: 2, y: 4 }]},
    'さ': { strokes: [{ x: 1.2, y: 3.1 }, { x: 2.3, y: 2.2 }]},
    'し': { strokes: [{ x: 2.0, y: 2.2 }]},
    'す': { strokes: [{ x: 1, y: 2.7 }, { x: 2.8, y: 2.2 }]},
    'せ': { strokes: [{ x: 1.1, y: 3.3 }, { x: 3.1, y: 2.3 }, { x: 1.8, y: 2.5 }]},
    'そ': { strokes: [{ x: 1.5, y: 2.7 }]},
    'た': { strokes: [{ x: 1.5, y: 2.8 }, { x: 2.5, y: 2.4 }, { x: 3.2, y: 3.1 }]},
    'ち': { strokes: [{ x: 1.7, y: 2.7 }, { x: 3.0, y: 2.8 }]},
    'つ': { strokes: [{ x: 1.6, y: 2.3 }, { x: 3.0, y: 2.9 }]},
    'て': { strokes: [{ x: 1.4, y: 2.8 }, { x: 2.5, y: 3.1 }]},
    'と': { strokes: [{ x: 1.6, y: 2.7 }, { x: 2.4, y: 2.0 }, { x: 3.3, y: 3.0 }]},
    'な': { strokes: [{ x: 1.4, y: 2.6 }, { x: 2.8, y: 3.0 }]},
    'に': { strokes: [{ x: 1.5, y: 2.8 }, { x: 2.7, y: 2.3 }]},
    'ぬ': { strokes: [{ x: 1.8, y: 2.4 }, { x: 2.8, y: 3.1 }]},
    'ね': { strokes: [{ x: 1.4, y: 2.8 }, { x: 2.8, y: 3.0 }]},
    'の': { strokes: [{ x: 1.5, y: 2.7 }, { x: 2.7, y: 3.2 }]},
    'は': { strokes: [{ x: 1.4, y: 2.8 }, { x: 2.4, y: 2.4 }, { x: 3.2, y: 3.0 }]},
    'ひ': { strokes: [{ x: 1.7, y: 2.8 }, { x: 3.0, y: 2.7 }]},
    'ふ': { strokes: [{ x: 1.6, y: 2.4 }, { x: 2.6, y: 2.7 }, { x: 3.1, y: 3.2 }]},
    'へ': { strokes: [{ x: 1.7, y: 2.8 }, { x: 2.7, y: 3.2 }]},
    'ほ': { strokes: [{ x: 1.5, y: 2.4 }, { x: 2.4, y: 2.7 }, { x: 3.1, y: 3.0 }]},
    'ま': { strokes: [{ x: 1.6, y: 3.1 }, { x: 2.6, y: 2.5 }]},
    'み': { strokes: [{ x: 1.6, y: 2.7 }, { x: 2.9, y: 2.7 }]},
    'む': { strokes: [{ x: 1.5, y: 2.7 }, { x: 2.6, y: 3.0 }]},
    'め': { strokes: [{ x: 1.4, y: 2.8 }, { x: 2.8, y: 3.0 }]},
    'も': { strokes: [{ x: 1.5, y: 2.7 }, { x: 2.5, y: 2.7 }]},
    'や': { strokes: [{ x: 2.0, y: 2.7 }]},
    'ゆ': { strokes: [{ x: 1.8, y: 2.8 }]},
    'よ': { strokes: [{ x: 1.8, y: 2.7 }]},
    'ら': { strokes: [{ x: 1.4, y: 2.9 }, { x: 2.8, y: 2.6 }]},
    'り': { strokes: [{ x: 1.6, y: 2.9 }, { x: 2.9, y: 2.7 }]},
    'る': { strokes: [{ x: 1.5, y: 2.8 }, { x: 2.9, y: 2.9 }]},
    'れ': { strokes: [{ x: 1.7, y: 3.0 }, { x: 2.7, y: 2.6 }]},
    'ろ': { strokes: [{ x: 1.5, y: 2.8 }, { x: 2.7, y: 2.7 }]},
    'わ': { strokes: [{ x: 1.8, y: 2.9 }]},
    'を': { strokes: [{ x: 1.8, y: 2.8 }, { x: 2.8, y: 3.0 }]},
    'ん': { strokes: [{ x: 2.3, y: 3.0 }]},
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
      font: '"Zen Antique Soft", Meiryo, sans-serif',
      secondaryFont: 'Meiryo, sans-serif',
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
      const firstPageRows = 5;
      pages.push(this.items.slice(0, firstPageRows));
      let rowPerPage = 5;
      let page = 0;
      for (let start = firstPageRows; start < this.items.length; start += rowPerPage) {
        if (['hiragana', 'katakana'].includes(this.script) && [6, 8].includes(page)) {
          rowPerPage = 3;
        } else {
          rowPerPage = 5;
        }
        pages.push(this.items.slice(start, start + rowPerPage));
        page++;
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
      // window.scrollTo(0,1700);
    },
    drawPracticePage(canvas, pageItems, pageIndex) {
      const width = Math.max(canvas.clientWidth, 320);
      const cardWidth = width - 48;
      const cardHeight = 128; //width < 640 ? 150 : 176; // 176.92%
      const rows = pageItems.length;
      const height = cardHeight / 5 + rows * 138;
      const scale = 3; window.devicePixelRatio || 1;

      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      context.scale(scale, scale);
      context.fillStyle = 'white'; //'#fffdf8';
      context.fillRect(0, 0, width, height);

      context.fillStyle = '#273f3a';
      context.font = `700 13px ${this.secondaryFont}`;
      context.fillText(`${this.title}${this.script === 'kanji' ? ` ${this.level}` : ''}  Page ${pageIndex + 1}`, 24, 28);
      context.fillStyle = '#58635e';
      context.font = `12px ${this.secondaryFont}`;
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
    async drawPracticeCard(context, item, x, y, width, height) {
      await document.fonts.ready;

      context.fillStyle = 'white'; //'#fffdf8';
      context.strokeStyle = '#d7d0c4';
      context.fillRect(x, y, width, height);
      context.strokeRect(x, y, width, height);

      context.save();
      context.beginPath();
      context.rect(x, y, width, height);
      context.clip();
      context.strokeStyle = '#e7e0d5';
      context.lineWidth = 1;
      const gridStartOffset = 0;
      const gridSizeOffset = 18;
      for (let gridX = x + gridStartOffset; gridX < x + width; gridX += gridSizeOffset) {
        context.beginPath();
        context.moveTo(gridX, y);
        context.lineTo(gridX, y + height);
        context.stroke();
      }
      for (let gridY = y + gridStartOffset - 4; gridY < y + height; gridY += gridSizeOffset) {
        context.beginPath();
        context.moveTo(x, gridY);
        context.lineTo(x + width, gridY);
        context.stroke();
      }
      context.restore();

      context.fillStyle = '#273f3a';
      const fontSize = 78;
      context.font = `${fontSize}px ${this.font}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(item.character, x + 54, y + 70);

      if (item.strokes) {
        context.font = `6px ${this.font}`;

        for (const i in item.strokes) {
          const stroke = item.strokes[i];

          context.beginPath();
          const offsetX = 22;
          const offsetY = 23;
          context.arc(x + stroke.x * offsetX, y + stroke.y * offsetY - 16, 3.5, 0, 2 * Math.PI);
          context.fillStyle = "red";
          context.fill();

          context.fillStyle = 'white';
          context.fillText(1 + +i, x + stroke.x * offsetX, y + stroke.y * offsetY - 16);
        }
      }

      const boxStart = x + 108;
      const boxWidth = 108;
      context.strokeStyle = '#a9a196';
      context.setLineDash([3, 3]);
      context.beginPath();
      const dashOffset = 18;
      context.moveTo(boxStart, y + dashOffset);
      context.lineTo(boxStart, y + 10 + boxWidth);
      context.stroke();

      const amountBoxes = Math.round((width - boxStart) / 108);
      for (let box = 0; box < amountBoxes; box += 1) {
        const boxX = boxStart + box * boxWidth;
        context.setLineDash([3, 3]);
        context.beginPath();

        context.moveTo(boxX, y + dashOffset);
        context.lineTo(boxX + boxWidth, y + dashOffset);
        context.lineTo(boxX + boxWidth, y + 10 + boxWidth);
        context.lineTo(boxX, y + 10 + boxWidth);

        context.stroke();

        context.setLineDash([]);
        const step = 0.18 / amountBoxes;
        const opacity = Math.max(0, 0.18 - box * step);
        context.fillStyle = `rgba(39, 63, 58, ${opacity.toFixed(3)})`;
        context.font = `${fontSize}px ${this.font}`;
        context.fillText(item.character, boxX + boxWidth / 2, y + dashOffset + boxWidth / 2 - 2);
      }

      if (item.reading) {
        context.fillStyle = '#b34f35';
        context.font = `12px ${this.secondaryFont}`;
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

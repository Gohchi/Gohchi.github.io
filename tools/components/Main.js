import MainHeader from 'components/MainHeader.js';
import Tools from 'components/Tools.js';

const SIZE_PRESETS = {
  A4: { width: 3535, height: 5000 },
  A3: { width: 3633, height: 5000 },
};

function aspectRatio(presetName) {
  const { width, height } = SIZE_PRESETS[presetName];
  return width / height;
}

function dimensionsFromWidth(presetName, width) {
  const w = Math.max(1, Math.round(Number(width) || 1));
  return { width: w, height: Math.round(w / aspectRatio(presetName)) };
}

function dimensionsFromHeight(presetName, height) {
  const h = Math.max(1, Math.round(Number(height) || 1));
  return { width: Math.round(h * aspectRatio(presetName)), height: h };
}

export default {
  components: {
    MainHeader,
    Tools,
  },
  data() {
    return {
      type: {
        A4: { ...SIZE_PRESETS.A4 },
        A3: { ...SIZE_PRESETS.A3 },
      },
      orientation: 'v',
      customRatioBase: 'A4',
      customWidth: SIZE_PRESETS.A4.width,
      customHeight: SIZE_PRESETS.A4.height,
      message: 'Seleccione un tipo de hoja y cargue una imagen para armar el mosaico.',
      ready: false,
      showBorder: true,
      internalSize: null,
      // sizeName: 'A3',
      sizeName: '',
      showHelp: false,
      amountHorizontal: 4,
      marginTop: 40,
      marginRight: 30,
      marginBottom: 15,
      marginLeft: 20,
      gap: 4,
      lineStyles: 'NONE',
      bgColor: 'white',
      download: 'download',
      menu: {},
      file: null,
      more: '',
      showPaperType: false,
      legend: '',
    };
  },
  created: function () {
    this.size = this.type.A3;
    this.sizeName = 'A3';
  },
  computed: {
    size: {
      get: function(){
        return this.internalSize
          ? this.orientation == 'v' ? { width: this.internalSize.width, height: this.internalSize.height }
            : this.orientation == 'h' ? { width: this.internalSize.height, height: this.internalSize.width }
              : null
          : null;
      },
      set: function(value) {
        this.internalSize = value;
      }
    },
    zoomSize: {
      get: function(){
        // return this.size;
        return {
          "width": this.size.width * .05,
          "height": this.size.height * .05
        }
      },
    },
    styleCanvas: function () {
      return {
        border: '2px dashed black'
      }
    }
  },
  methods: {
    moreOptionSelected(key) {
      this.more = key;

      if (key === 'show-type') {
        this.showPaperType = !this.showPaperType;
      } else if (key === 'add-legend') {
        this.legend = this.legend ? '' : prompt('Agregar leyenda:');
      }

      this.refresh();
    },
    applyCustomSize() {
      this.internalSize = { width: this.customWidth, height: this.customHeight };
    },
    updateCustomDimension(changedSide, value) {
      const dims = changedSide === 'width'
        ? dimensionsFromWidth(this.customRatioBase, value)
        : dimensionsFromHeight(this.customRatioBase, value);
      this.customWidth = dims.width;
      this.customHeight = dims.height;

      if (this.sizeName === 'CUSTOM') {
        this.applyCustomSize();
        this.refresh();
      }
    },
    changeCustomRatioBase(base) {
      if (base !== 'A3' && base !== 'A4') return;
      this.customRatioBase = base;
      this.updateCustomDimension('width', this.customWidth);
    },
    changeType(bgColor, lineStyles, sizeName, download) {
      const prevSizeName = this.sizeName;
      this.bgColor = bgColor;
      this.lineStyles = lineStyles;
      this.sizeName = sizeName;
      this.download = download;

      if (this.sizeName === 'CUSTOM') {
        if (prevSizeName === 'A3' || prevSizeName === 'A4') {
          this.customRatioBase = prevSizeName;
          this.customWidth = this.type[prevSizeName].width;
          this.customHeight = this.type[prevSizeName].height;
        }
        this.applyCustomSize();
      } else {
        this.internalSize = { ...this.type[this.sizeName] };
      }

      this.refresh();
    },
    clearCanvas() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    clearAll() {
      this.clearCanvas();
      this.ready = false;
      this.menu = {};
      this.file = null;
      this.updateZoom();
    },
    updateZoom() {
      const canvas = document.getElementById('canvas');
      const zoom = document.getElementById('zoom');
      const ctx = zoom.getContext('2d');
      ctx.drawImage(canvas, 0, 0, zoom.width, zoom.height);
    },
    refresh() {
      const fn = () => {
        this.ready = true;
        const canvas = document.getElementById('canvas');
        /** @type {CanvasRenderingContext2D} */
        const ctx = canvas.getContext('2d');
        
        this.clearCanvas();

        // Create a temporary canvas for the limited horizontal repeat
        const patternCanvas = document.createElement('canvas');
        const patternCtx = patternCanvas.getContext('2d');
        const marginTop = +this.marginTop;
        const marginRight = +this.marginRight;
        const marginBottom = +this.marginBottom;
        const marginLeft = +this.marginLeft;
        const gap = +this.gap;
        const amountHorizontal = +this.amountHorizontal;

        if (this.lineStyles != 'NONE') {
          if (this.lineStyles === 'DASH') {
            ctx.setLineDash([10, 5]);
          } else {
            ctx.setLineDash([]);
          }
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.strokeRect(marginLeft, marginTop, canvas.width - marginRight - marginLeft, canvas.height - marginBottom - marginTop);
        }

        patternCanvas.width = (canvas.width - marginLeft - marginRight - gap * (amountHorizontal-1)) / amountHorizontal;
        patternCanvas.height = img.height * (patternCanvas.width / img.width);
        patternCtx.drawImage(img, 0, 0, patternCanvas.width, patternCanvas.height);

        const amountVertical = Math.floor((canvas.height - marginTop - marginBottom + gap) / (patternCanvas.height + gap));

        ctx.fillStyle = this.bgColor;
        const totalImageWidth = amountHorizontal * patternCanvas.width + gap * (amountHorizontal - 1);
        const totalImageHeight = amountVertical * patternCanvas.height + gap * (amountVertical - 1);
        ctx.fillRect(marginLeft, marginTop, totalImageWidth, totalImageHeight);
        
        for (let i = 0; i < amountHorizontal; i++) {
          const offsetLeft = marginLeft + patternCanvas.width * i + (i > 0 ? gap * i : 0);
          
          for (let l = 0; l < amountVertical; l++) {
            const offsetTop = patternCanvas.height * l;
            ctx.drawImage(patternCanvas, offsetLeft+1, marginTop+1 + offsetTop + (l > 0 ? gap * l : 0));
          }
        }
        const textPadding = 10;
        const lineCount = this.showPaperType || this.legend ? 1 : 0;
        const availableHeight = Math.max(4, marginTop - textPadding * 2);
        const fontSize = Math.max(4, Math.min(48, availableHeight / Math.max(1, lineCount)));
        ctx.fillStyle = 'black';
        ctx.font = `${fontSize}px Arial`;

        let x = marginLeft + textPadding;
        const y = textPadding + fontSize;

        if (this.showPaperType) {
          ctx.fillText(this.sizeName, x, y);
          x += fontSize * 1.5;
        }

        if (this.legend) {
          ctx.fillText(this.legend, x, y);
        }

        this.updateZoom();
      }

      const img = this.imageSizeHeight && this.imageSizeWidth
        ? new Image( this.imageSizeWidth, this.imageSizeHeight ) : new Image();
      setTimeout(() => {
        const file = this.file;
        if (file) {
          this.ready = true;
          const reader  = new FileReader();

          reader.onloadend = () => {
            img.src = reader.result;
            setTimeout(() => {
              fn();
            }, 0);
          }

          reader.readAsDataURL(file);
        } else {
          fn();
        }
      }, 0);

    },
    saveCanvas: function() {
      const canvas = document.getElementById('canvas');
    },
    swapOrientation() {
      this.orientation = this.orientation=='h' ? 'v': 'h';
      this.refresh();
    },
    downloadFile(action) {
      const canvas = document.getElementById('canvas');

      const now = new Date();
      const dateStr = now.getFullYear() + '-' 
        + String(now.getMonth() + 1).padStart(2, '0') + '-' 
        + String(now.getDate()).padStart(2, '0') + '_' 
        + String(now.getHours()).padStart(2, '0') + '-' 
        + String(now.getMinutes()).padStart(2, '0') + '-' 
        + String(now.getSeconds()).padStart(2, '0');

      const filename = 'mosaico_' + dateStr;

      if (action === 'download') {
        const link = document.createElement('a');
        link.download = filename + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (['pdf', 'print'].includes(action)) {
        const { jsPDF } = window.jspdf; 
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: this.orientation === 'h' ? 'l' : 'p',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        
        if (action === 'print') {
          const blob = pdf.output('blob');
          const url = URL.createObjectURL(blob);

          const iframe = document.createElement('iframe');
          iframe.style.display = 'none'; // Hide the iframe
          iframe.src = url;
          document.body.appendChild(iframe);

          iframe.onload = function() {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          };
        } else {
          pdf.save(filename + '.pdf');
        }
      }
    },
    openMenu(id) {
      const buttonEl = document.getElementById('button-'+id);
      
      const key = 'menu-'+id;
      let menu = this.menu[key];
      
      if (!menu) {
        const menuEl = document.getElementById(key);

        menu = new mdc.menu.MDCMenu(menuEl);
        this.menu[key] = menu;
      }
      
      menu.open = !menu.open;
      menu.setAnchorCorner(mdc.menu.Corner.BOTTOM_LEFT);
      menu.setAnchorElement(buttonEl);
    },
    fileLoaded() {
      const input = document.getElementById('file');
      this.file = input.files[0];
      this.refresh();
    },
    moveZoom() {
      const canvas = document.getElementById('zoom');
      if (canvas.classList.contains('moved')) {
        canvas.classList.remove('moved');
      } else {
        canvas.classList.add('moved');
      }
    },
    changeAmountHorizontal(value) {
      if (value < 1) return;
      this.amountHorizontal = value;
      this.refresh();
    },
    changeMarginTop(value) {
      if (value < 0) return;
      this.marginTop = value;
      this.refresh();
    },
    changeMarginRight(value) {
      if (value < 0) return;
      this.marginRight = value;
      this.refresh();
    },
    changeMarginBottom(value) {
      if (value < 0) return;
      this.marginBottom = value;
      this.refresh();
    },
    changeMarginLeft(value) {
      if (value < 0) return;
      this.marginLeft = value;
      this.refresh();
    },
    changeGap(value) {
      if (value < 0) return;
      this.gap = value;
      this.refresh();
    },
  },
  template: /*html*/`
    <main-header
      :title="title"
      :ready="ready"
      :showBorder="showBorder"
      :showPaperType="showPaperType"
      :hideZoom="hideZoom"
      :legend="legend"
      @fileLoaded="fileLoaded"
      @changeType="changeType"
      @refresh="refresh"
      @swapOrientation="swapOrientation"
      @swapBorder="showBorder=!showBorder"
      @clearAll="clearAll"
      @moreOptionSelected="moreOptionSelected"
      @openMenu="openMenu"
      @downloadFile="downloadFile"
    />
    <main class="mdc-top-app-bar--fixed-adjust">
      <!-- <div v-if="showHelp" style="padding: 20px;">{{ message }}</div> -->
      <canvas id="canvas"
        v-if="size"
        v-bind:width="size.width"
        v-bind:height="size.height"
        v-bind:style="showBorder ? styleCanvas : null"
      ></canvas>

      <tools
        :ready="ready"
        :sizeName="sizeName"
        :orientation="orientation"
        :size="size"
        :customWidth="customWidth"
        :customHeight="customHeight"
        :customRatioBase="customRatioBase"
        :amountHorizontal="amountHorizontal"
        :marginTop="marginTop"
        :marginRight="marginRight"
        :marginBottom="marginBottom"
        :marginLeft="marginLeft"
        :gap="gap"
        @refresh="refresh"
        @updateCustomDimension="updateCustomDimension"
        @changeCustomRatioBase="changeCustomRatioBase"
        @changeAmountHorizontal="changeAmountHorizontal"
        @changeMarginTop="changeMarginTop"
        @changeMarginRight="changeMarginRight"
        @changeMarginBottom="changeMarginBottom"
        @changeMarginLeft="changeMarginLeft"
        @changeGap="changeGap"
      />

      <canvas id="zoom"
        v-bind:width="zoomSize.width"
        v-bind:height="zoomSize.height"
        @click="moveZoom()"
      ></canvas>
    </main>
  `,
}
import { markRaw } from 'vue';

import NumberField from 'components/NumberField.js';
import SegmentedControl from 'components/SegmentedControl.js';
import ImageList from 'components/ImageList.js';

import template from 'templates/Mosaic.js';

import {
  PAPERS,
  PAPER_OPTIONS,
  RATIO_OPTIONS,
  ORIENTATION_OPTIONS,
  BACKGROUND_OPTIONS,
  LINE_OPTIONS,
  LIMITS,
  clamp,
  dimensionsFromWidth,
  dimensionsFromHeight,
  getPaperSize,
  getPaperName,
  loadSettings,
  saveSettings,
  loadImageFile,
  renderMosaic,
  fileStamp,
  canvasToBlob,
  downloadBlob,
  buildPdfBlob,
  printPdfBlob,
  nextPaint,
} from 'data/mosaic.js';

const STAGE_PADDING = 24; // must match .paper-wrap padding in styles.css
const MAX_ZOOM = 6;
const MAX_PREVIEW_PIXELS = 4000; // longest side of the preview bitmap

const TABS = [
  { key: 'paper', label: 'Hoja', icon: 'description' },
  { key: 'layout', label: 'Diseño', icon: 'grid_view' },
  { key: 'images', label: 'Imágenes', icon: 'photo_library' },
  { key: 'style', label: 'Estilo', icon: 'palette' },
];

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const hasFiles = e => [...(e.dataTransfer?.types || [])].includes('Files');

export default {
  components: { NumberField, SegmentedControl, ImageList },
  data() {
    return {
      settings: loadSettings(),
      images: [],

      tabs: TABS,
      activeTab: 'paper',
      sheetOpen: true,
      isMobile: false,
      isCoarse: false,
      canShare: false,

      zoom: 1,
      stageSize: { width: 0, height: 0 },
      tiles: 0,

      dragging: false,
      exportOpen: false,
      busy: '', // '' | 'png' | 'pdf' | 'print' | 'share'
      toast: null,

      limits: LIMITS,
      paperOptions: PAPER_OPTIONS,
      ratioOptions: RATIO_OPTIONS,
      orientationOptions: ORIENTATION_OPTIONS,
      backgroundOptions: BACKGROUND_OPTIONS,
      lineOptions: LINE_OPTIONS,
    };
  },
  computed: {
    paperSize() {
      return getPaperSize(this.settings);
    },
    paperName() {
      return getPaperName(this.settings);
    },
    renderOptions() {
      return { ...this.settings, ...this.paperSize, paperName: this.paperName };
    },
    sizeText() {
      return `${this.paperSize.width} × ${this.paperSize.height} px`;
    },
    marginSliderMax() {
      return Math.round(Math.min(this.paperSize.width, this.paperSize.height) * 0.12);
    },

    // Preview: the canvas is drawn at a reduced resolution and scaled with CSS.
    fitScale() {
      const padding = STAGE_PADDING * 2;
      const availableWidth = Math.max(80, this.stageSize.width - padding);
      const availableHeight = Math.max(80, this.stageSize.height - padding);
      return Math.min(availableWidth / this.paperSize.width, availableHeight / this.paperSize.height);
    },
    displaySize() {
      const scale = this.fitScale * this.zoom;
      return {
        width: Math.max(1, Math.round(this.paperSize.width * scale)),
        height: Math.max(1, Math.round(this.paperSize.height * scale)),
      };
    },
    canvasStyle() {
      return { width: this.displaySize.width + 'px', height: this.displaySize.height + 'px' };
    },
    previewScale() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const longest = Math.max(this.displaySize.width, this.displaySize.height) * dpr;
      const target = clamp(longest, 400, MAX_PREVIEW_PIXELS);
      const raw = Math.min(1, target / Math.max(this.paperSize.width, this.paperSize.height));
      return Math.ceil(raw * 20) / 20; // steps of 5% to avoid redrawing on every pixel
    },
    zoomLabel() {
      if (this.zoom <= 1.001) return 'Ajustar';
      return Math.round((this.displaySize.width / this.paperSize.width) * 100) + '%';
    },
    infoText() {
      const orientation = this.settings.orientation === 'v' ? 'vertical' : 'horizontal';
      return `${this.paperName} ${orientation}`;
    },
    emptyText() {
      return this.isCoarse
        ? 'Elegí las imágenes desde tu dispositivo.'
        : 'Arrastralas hasta acá, pegalas con Ctrl+V o elegilas desde tu equipo.';
    },
    labelHint() {
      const hasLabel = this.settings.showPaperType || this.settings.legend.trim();
      return hasLabel && this.settings.marginTop < 24
        ? 'El texto usa el margen superior. Aumentalo en la pestaña Diseño para verlo mejor.'
        : '';
    },
  },
  watch: {
    settings: {
      deep: true,
      handler() {
        saveSettings(this.settings);
        this.scheduleRender();
      },
    },
    images: {
      deep: true,
      handler() {
        this.scheduleRender();
      },
    },
    previewScale() {
      this.scheduleRender();
    },
  },
  created() {
    // non-reactive state
    this.internals = {
      raf: 0,
      pointers: new Map(),
      pan: null,
      pinch: null,
      dragDepth: 0,
      toastTimer: 0,
    };
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      this.stageSize = { width, height };
    });
    this.resizeObserver.observe(this.$refs.stage);

    this.mobileQuery = window.matchMedia('(max-width: 859px)');
    this.coarseQuery = window.matchMedia('(pointer: coarse)');
    this.onQueryChange = () => {
      this.isMobile = this.mobileQuery.matches;
      this.isCoarse = this.coarseQuery.matches;
    };
    this.onQueryChange();
    this.mobileQuery.addEventListener('change', this.onQueryChange);
    this.coarseQuery.addEventListener('change', this.onQueryChange);

    try {
      this.canShare = typeof navigator.canShare === 'function'
        && navigator.canShare({ files: [new File([], 'a.png', { type: 'image/png' })] });
    } catch (e) {
      this.canShare = false;
    }

    window.addEventListener('dragenter', this.onDragEnter);
    window.addEventListener('dragover', this.onDragOver);
    window.addEventListener('dragleave', this.onDragLeave);
    window.addEventListener('drop', this.onDrop);
    window.addEventListener('paste', this.onPaste);
    window.addEventListener('keydown', this.onKeydown);
    document.addEventListener('click', this.closeMenu);

    this.scheduleRender();
  },
  beforeUnmount() {
    this.resizeObserver.disconnect();
    this.mobileQuery.removeEventListener('change', this.onQueryChange);
    this.coarseQuery.removeEventListener('change', this.onQueryChange);

    window.removeEventListener('dragenter', this.onDragEnter);
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('dragleave', this.onDragLeave);
    window.removeEventListener('drop', this.onDrop);
    window.removeEventListener('paste', this.onPaste);
    window.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('click', this.closeMenu);

    cancelAnimationFrame(this.internals.raf);
    clearTimeout(this.internals.toastTimer);
    this.images.forEach(({ url }) => URL.revokeObjectURL(url));
  },
  methods: {
    // --- rendering ---
    scheduleRender() {
      if (this.internals.raf) return;
      this.internals.raf = requestAnimationFrame(() => {
        this.internals.raf = 0;
        this.renderPreview();
      });
    },
    renderItems() {
      return this.images.map(({ img, repeat }) => ({ img, repeat }));
    },
    renderPreview() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      try {
        const { tiles } = renderMosaic(canvas, this.renderItems(), this.renderOptions, this.previewScale);
        this.tiles = tiles;
      } catch (error) {
        console.error(error);
      }
    },

    // --- feedback ---
    notify(text, error = false) {
      clearTimeout(this.internals.toastTimer);
      this.toast = { text, error };
      this.internals.toastTimer = setTimeout(() => { this.toast = null; }, 3500);
    },

    // --- images ---
    pickFiles() {
      this.exportOpen = false;
      this.$refs.fileInput.click();
    },
    onFilesPicked(e) {
      this.addFiles(e.target.files);
      e.target.value = ''; // allows picking the same file again
    },
    async addFiles(fileList) {
      const files = [...(fileList || [])].filter(file => file.type.startsWith('image/'));
      if (!files.length) {
        this.notify('Elegí archivos de imagen.', true);
        return;
      }

      const results = await Promise.allSettled(files.map(loadImageFile));
      const loaded = results
        .filter(result => result.status === 'fulfilled')
        .map(({ value }) => ({ ...value, img: markRaw(value.img), repeat: 'rest', lastFixed: 1 }));
      const failed = results.length - loaded.length;

      this.images.push(...loaded);

      if (failed) {
        this.notify(`${failed} archivo(s) no se pudieron abrir.`, true);
      } else {
        this.notify(loaded.length === 1 ? 'Imagen agregada.' : `${loaded.length} imágenes agregadas.`);
      }
    },
    removeImage(id) {
      const index = this.images.findIndex(item => item.id === id);
      if (index === -1) return;
      URL.revokeObjectURL(this.images[index].url);
      this.images.splice(index, 1);
    },
    clearImages() {
      if (!this.images.length || !confirm('¿Quitar todas las imágenes?')) return;
      this.images.forEach(({ url }) => URL.revokeObjectURL(url));
      this.images = [];
    },
    setRepeat(id, value) {
      const item = this.images.find(entry => entry.id === id);
      if (!item) return;
      item.repeat = value;
      if (value !== 'rest') item.lastFixed = value;
    },

    // --- paper ---
    setPaper(key) {
      const s = this.settings;
      if (key === 'CUSTOM' && s.paper !== 'CUSTOM') {
        // start from the paper that was selected
        s.customRatioBase = s.paper;
        s.customWidth = PAPERS[s.paper].width;
        s.customHeight = PAPERS[s.paper].height;
      }
      s.paper = key;
    },
    setRatio(base) {
      const s = this.settings;
      const size = dimensionsFromWidth(base, s.customWidth);
      s.customRatioBase = base;
      s.customWidth = size.width;
      s.customHeight = size.height;
    },
    setCustom(side, value) {
      const s = this.settings;
      const size = side === 'width'
        ? dimensionsFromWidth(s.customRatioBase, value)
        : dimensionsFromHeight(s.customRatioBase, value);
      s.customWidth = size.width;
      s.customHeight = size.height;
    },

    // --- panel ---
    selectTab(key) {
      if (this.isMobile && key === this.activeTab) {
        this.sheetOpen = !this.sheetOpen; // second tap collapses the sheet
      } else {
        this.activeTab = key;
        this.sheetOpen = true;
      }
    },

    // --- zoom & pan ---
    setZoom(next) {
      const value = clamp(next, 1, MAX_ZOOM);
      if (Math.abs(value - this.zoom) < 0.001) return;

      // keep the centre of the view where it was
      const el = this.$refs.stage;
      const centerX = (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth;
      const centerY = (el.scrollTop + el.clientHeight / 2) / el.scrollHeight;

      this.zoom = value;
      this.$nextTick(() => {
        el.scrollLeft = centerX * el.scrollWidth - el.clientWidth / 2;
        el.scrollTop = centerY * el.scrollHeight - el.clientHeight / 2;
      });
    },
    zoomBy(factor) {
      this.setZoom(this.zoom * factor);
    },
    onWheel(e) {
      if (!(e.ctrlKey || e.metaKey)) return; // plain wheel scrolls; Ctrl+wheel / trackpad pinch zooms
      e.preventDefault();
      this.zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12);
    },
    beginGesture() {
      const { pointers } = this.internals;
      const el = this.$refs.stage;
      const points = [...pointers.values()];

      if (points.length >= 2) {
        this.internals.pan = null;
        this.internals.pinch = { distance: distance(points[0], points[1]) || 1, zoom: this.zoom };
      } else if (points.length === 1) {
        this.internals.pinch = null;
        this.internals.pan = { x: points[0].x, y: points[0].y, left: el.scrollLeft, top: el.scrollTop };
      } else {
        this.internals.pan = null;
        this.internals.pinch = null;
      }
    },
    onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      try { this.$refs.stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      this.internals.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.beginGesture();
    },
    onPointerMove(e) {
      const { pointers, pan, pinch } = this.internals;
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size >= 2 && pinch) {
        const [a, b] = [...pointers.values()];
        this.setZoom(pinch.zoom * distance(a, b) / pinch.distance);
      } else if (pan) {
        const el = this.$refs.stage;
        el.scrollLeft = pan.left - (e.clientX - pan.x);
        el.scrollTop = pan.top - (e.clientY - pan.y);
      }
    },
    onPointerUp(e) {
      this.internals.pointers.delete(e.pointerId);
      this.beginGesture();
    },

    // --- drag & drop, paste, keyboard ---
    onDragEnter(e) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      this.internals.dragDepth++;
      this.dragging = true;
    },
    onDragOver(e) {
      if (hasFiles(e)) e.preventDefault();
    },
    onDragLeave(e) {
      if (!hasFiles(e)) return;
      this.internals.dragDepth = Math.max(0, this.internals.dragDepth - 1);
      if (!this.internals.dragDepth) this.dragging = false;
    },
    onDrop(e) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      this.internals.dragDepth = 0;
      this.dragging = false;
      this.addFiles(e.dataTransfer.files);
    },
    onPaste(e) {
      const files = [...(e.clipboardData?.files || [])].filter(file => file.type.startsWith('image/'));
      if (files.length) this.addFiles(files);
    },
    onKeydown(e) {
      if (e.key === 'Escape') {
        this.exportOpen = false;
        return;
      }
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.ctrlKey || e.metaKey) return;
      if (e.key === '+' || e.key === '=') this.zoomBy(1.25);
      else if (e.key === '-') this.zoomBy(1 / 1.25);
      else if (e.key === '0') this.setZoom(1);
    },
    closeMenu() {
      this.exportOpen = false;
    },

    // --- export ---
    async runExport(kind) {
      this.exportOpen = false;
      if (!this.images.length || this.busy) return;

      this.busy = kind;
      const canvas = document.createElement('canvas');

      try {
        await nextPaint(); // let the "Generando…" state show up before the heavy work
        renderMosaic(canvas, this.renderItems(), this.renderOptions, 1);
        const name = `mosaico_${fileStamp()}`;

        if (kind === 'png') {
          downloadBlob(await canvasToBlob(canvas, 'image/png'), `${name}.png`);
          this.notify('Imagen descargada.');
        } else if (kind === 'pdf') {
          downloadBlob(buildPdfBlob(canvas), `${name}.pdf`);
          this.notify('PDF descargado.');
        } else if (kind === 'print') {
          printPdfBlob(buildPdfBlob(canvas));
        } else if (kind === 'share') {
          const blob = await canvasToBlob(canvas, 'image/png');
          const file = new File([blob], `${name}.png`, { type: 'image/png' });
          await navigator.share({ files: [file], title: 'Mosaico' });
        }
      } catch (error) {
        if (error?.name !== 'AbortError') { // AbortError = the person closed the share sheet
          console.error(error);
          this.notify('No se pudo generar el archivo. Probá con una hoja más chica (Hoja → Personalizado).', true);
        }
      } finally {
        canvas.width = canvas.height = 0; // frees the memory right away
        this.busy = '';
      }
    },
  },
  template,
};
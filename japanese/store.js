import { reactive } from 'vue';

const zoomLevel = localStorage.getItem('zoom-level');

export const zoomStore = reactive({
  "showMenu": false,
  "showZoomMenu": false,
  "zoomLevel": zoomLevel ?? 100,
  "prevZoomLevel": zoomLevel ?? 100,

  openZoom() {
    this.showMenu = false;
    this.prevZoomLevel = this.zoomLevel;
    this.showZoomMenu = true;
  },
  confirmZoomLevel() {
    this.showZoomMenu = false;
    localStorage.setItem('zoom-level', this.zoomLevel);
  },
  cancelZoomLevel() {
    this.zoomLevel = this.prevZoomLevel;
    this.showZoomMenu = false;
  },
  onZoomChange(e) {
    this.zoomLevel = e.target.value;
  },
});

const furiganaEnabled = localStorage.getItem('furigana-enabled') === 'true';

export const furiganaStore = reactive({
  "showFurigana": furiganaEnabled ?? true,
  
  switchFurigana() {
    this.showFurigana = !this.showFurigana;
    localStorage.setItem('furigana-enabled', this.showFurigana);
  },
});
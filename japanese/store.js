import { reactive } from 'vue';

import {
  speak,
  getVoices,
} from 'tools';

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


const selectedVoiceURI = localStorage.getItem('voice');

export const voiceStore = reactive({
  "selectedVoice": null,
  "voices": [],

  selectVoice(voice) {
    this.selectedVoice = voice;
    localStorage.setItem('voice', voice.voiceURI);
  },
  speak(text) {
    speak(text, this.selectedVoice);
  },
  async getVoices() {
    const voices = await getVoices();
    this.voices = voices;
    this.selectVoice(voices.find(v => v.voiceURI === selectedVoiceURI) || voices[0]);
    return voices;
  }
});
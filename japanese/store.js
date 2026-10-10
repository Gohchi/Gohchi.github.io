import { reactive } from 'vue';

import {
  speak,
  getVoices,
} from 'tools';

import {
  loadProfile,
  saveProfile,
  resetProfile,
} from 'data/profile.js';

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
  getZoomLevel() {
    return 'zoom: ' + this.zoomLevel + '%';
  }
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


// User profile.
// Firebase seam:
//  - on login/logout call `profileStore.setUser(firebaseUser | null)` (e.g. from onAuthStateChanged)
//  - persist remotely inside `save()` (and load the remote profile after `setUser`)
export const profileStore = reactive({
  "user": null, // { uid, email, displayName, photoURL } once signed in
  "profile": loadProfile(),

  setUser(user) {
    this.user = user
      ? {
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      }
      : null;

    // First login: start from the name the account already has.
    if (this.user?.displayName && !this.profile.displayName) {
      this.save({ displayName: this.user.displayName });
    }
  },
  async save(changes) {
    this.profile = saveProfile({ ...this.profile, ...changes });
    // Firebase: await setDoc(doc(db, 'users', this.user.uid), this.profile, { merge: true })
    return this.profile;
  },
  async reset() {
    this.profile = resetProfile();
  },
});
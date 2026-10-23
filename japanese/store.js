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

import {
  watchAuth,
  signInWithGoogle,
  signOutUser,
} from 'data/firebase.js';

import {
  startSync,
  stopSync,
  flushSync,
} from 'data/sync.js';

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


const SILENT_AUTH_ERRORS = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];
const AUTH_ERRORS = {
  'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.',
  'auth/unauthorized-domain': 'This domain is not authorized in the Firebase console yet.',
  'auth/network-request-failed': 'Could not reach Google. Check your connection and try again.',
};
const authMessage = error => AUTH_ERRORS[error?.code] || 'Could not sign in right now. Are you offline?';

// User profile + login.
//  - localStorage stays the source of truth (works offline).
//  - Signing in with Google syncs progress, activity, profile, favorites and roadmap
//    to Firestore (see data/sync.js).
//  - Firebase is loaded lazily; if it can't be reached the app simply stays signed out.
export const profileStore = reactive({
  "user": null, // { uid, email, displayName, photoURL } once signed in
  "profile": loadProfile(),
  "authReady": false, // true once Firebase answered (or failed to load)
  "authBusy": false, // a sign in / out is in progress
  "authError": '',
  "authStarted": false,

  // Starts listening to the auth state. Called once, at the bottom of this file.
  async init() {
    if (this.authStarted) return;
    this.authStarted = true;

    try {
      await watchAuth(async user => {
        try {
          if (user) {
            // sync BEFORE setUser, so a profile saved on another device wins over the Google name
            await startSync(user);
            this.profile = loadProfile();
          } else {
            stopSync();
          }
        } catch (error) {
          console.error('[sync] failed', error);
        }
        this.setUser(user);
        this.authReady = true;
      });
    } catch (error) {
      console.warn('[auth] Firebase unavailable (offline?)', error);
      this.authReady = true;
    }
  },

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
  async signIn() {
    this.authError = '';
    this.authBusy = true;
    try {
      await signInWithGoogle(); // watchAuth's callback does the rest
    } catch (error) {
      if (!SILENT_AUTH_ERRORS.includes(error?.code)) this.authError = authMessage(error);
    } finally {
      this.authBusy = false;
    }
  },
  async signOut() {
    this.authError = '';
    this.authBusy = true;
    try {
      await flushSync(); // push what is still waiting, then leave
      await signOutUser();
    } catch (error) {
      this.authError = 'Could not sign out right now.';
    } finally {
      this.authBusy = false;
    }
  },
  async save(changes) {
    this.profile = saveProfile({ ...this.profile, ...changes });
    return this.profile;
  },
  async reset() {
    this.profile = resetProfile();
  },
});

profileStore.init();
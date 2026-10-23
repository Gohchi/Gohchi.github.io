import { reactive, watch } from 'vue';

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
  // '' = idle | 'checking' (restoring the session on load) | 'signing-in' | 'syncing' | 'signing-out'
  "authStatus": 'checking',
  "authError": '',
  "authStarted": false,

  get authBusy() {
    return this.authStatus !== '';
  },

  // Starts listening to the auth state. Called once, at the bottom of this file.
  async init() {
    if (this.authStarted) return;
    this.authStarted = true;

    // safety net: a hung SDK download must not lock the app forever
    setTimeout(() => {
      if (this.authStatus === 'checking') this.authStatus = '';
    }, 10000);

    try {
      await watchAuth(async user => {
        try {
          if (user) {
            this.authStatus = 'syncing';
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
        this.authStatus = ''; // only now the UI shows "signed in" / "not signed in"
      });
    } catch (error) {
      console.warn('[auth] Firebase unavailable (offline?)', error);
      this.authStatus = '';
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
    this.authStatus = 'signing-in';
    try {
      // On success the status is NOT cleared here: the watchAuth callback keeps it
      // ('syncing') until the data is merged, then clears it.
      await signInWithGoogle();
    } catch (error) {
      this.authStatus = '';
      if (!SILENT_AUTH_ERRORS.includes(error?.code)) this.authError = authMessage(error);
    }
  },
  async signOut() {
    this.authError = '';
    this.authStatus = 'signing-out';
    try {
      await flushSync(); // push what is still waiting, then leave
      await signOutUser(); // the watchAuth callback clears the status
    } catch (error) {
      this.authStatus = '';
      this.authError = 'Could not sign out right now.';
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

// While Firebase is checking the session / signing in / syncing, the whole page is locked
// (any view). `inert` blocks mouse, touch, keyboard and focus inside .main, the header included.
watch(
  () => profileStore.authBusy,
  busy => {
    document.querySelector('.main')?.toggleAttribute('inert', busy);
    document.documentElement.classList.toggle('auth-busy', busy);
  },
  { immediate: true },
);

profileStore.init();
// Thin wrapper around the Firebase web SDK.
//
// The SDK is loaded lazily with dynamic import() from Google's CDN, so:
//  - there is still no build step
//  - if the CDN can't be reached (offline), only login/sync fail; the rest of
//    the app keeps working from localStorage as before.
//
// Nothing else in the app imports the SDK directly: everything goes through here.

const SDK_VERSION = '10.14.1'; // pin it, bump it on purpose
const SDK = `https://www.gstatic.com/firebasejs/${SDK_VERSION}`;

// Firebase console -> Project settings -> Your apps -> Web app -> SDK setup (config).
// These values are NOT secret; access is protected by the Firestore rules.
export const firebaseConfig = {
    apiKey: "AIzaSyBS83u_BVTkqY3kW_VCi8qc3en5IXNSOZc",
    authDomain: "mando-memo.firebaseapp.com",
    projectId: "mando-memo",
    storageBucket: "mando-memo.firebasestorage.app",
    messagingSenderId: "442152036278",
    appId: "1:442152036278:web:6037fc72f14fc783f4c317",
    measurementId: "G-PEELQVLS4W"
  };

let loading = null;

export function loadFirebase() {
  if (!loading) {
    loading = (async () => {
      const [{ initializeApp }, auth, fs] = await Promise.all([
        import(`${SDK}/firebase-app.js`),
        import(`${SDK}/firebase-auth.js`),
        import(`${SDK}/firebase-firestore.js`),
      ]);
      const app = initializeApp(firebaseConfig);
      return { auth, authInstance: auth.getAuth(app), fs, db: fs.getFirestore(app) };
    })();
    // a failed load (offline) can be retried later
    loading.catch(() => { loading = null; });
  }
  return loading;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

// callback(user | null) runs on page load (restored session) and on every sign in / out.
export async function watchAuth(callback) {
  const { auth, authInstance } = await loadFirebase();
  return auth.onAuthStateChanged(authInstance, callback);
}

export async function signInWithGoogle() {
  const { auth, authInstance } = await loadFirebase();
  const provider = new auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return auth.signInWithPopup(authInstance, provider);
}

export async function signOutUser() {
  const { auth, authInstance } = await loadFirebase();
  return auth.signOut(authInstance);
}

// ---------------------------------------------------------------------------
// Firestore: users/{uid}/data/{name}  ->  { json: '<stringified value>', updatedAt }
//
// Values are stored as a JSON string on purpose: Firestore forbids nested arrays
// and has rules about field names, and our data (kana, kanji, verbs as keys) is
// free-form. One doc per kind of data keeps every doc far below the 1 MB limit.
// ---------------------------------------------------------------------------

const docRef = ({ fs, db }, uid, name) => fs.doc(db, 'users', uid, 'data', name);

export async function readDoc(uid, name) {
  const firebase = await loadFirebase();
  const snap = await firebase.fs.getDoc(docRef(firebase, uid, name));
  if (!snap.exists()) return null;
  try {
    return JSON.parse(snap.data().json);
  } catch {
    return null;
  }
}

export async function writeDoc(uid, name, value) {
  const firebase = await loadFirebase();
  await firebase.fs.setDoc(docRef(firebase, uid, name), {
    json: JSON.stringify(value),
    updatedAt: firebase.fs.serverTimestamp(),
  });
}
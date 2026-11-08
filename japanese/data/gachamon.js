// Gachamon (gacha as a service): client for the JSON API.
//
// Gachamon checks players against ITS OWN Firebase project, which is not the one the rest of this
// app uses (data/firebase.js). So the sign-in here is a second, separately named Firebase app whose
// settings come from GET /api/config. Nothing else in the app is touched by it.
//
// The API key identifies the project and only works from the domains listed in Gachamon
// (Projects -> Domains), so it is fine to ship it in page code.

export const GACHAMON_URL = 'https://gohchi.pythonanywhere.com';
export const GACHAMON_KEY = 'gm_uHuGjBO8unZKJvkuX9lcOTfw8XP1JfZt19d9p2CXphE';

const SDK = 'https://www.gstatic.com/firebasejs/10.14.1';

export class GachamonError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Media paths come back relative ("/media/x.png"): point them at the Gachamon host.
export const mediaUrl = path => (path ? (/^https?:/.test(path) ? path : GACHAMON_URL + path) : '');

async function request(path, { method = 'GET', body, token, text = false } = {}) {
  const headers = { 'X-API-Key': GACHAMON_KEY };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(GACHAMON_URL + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new GachamonError('Could not reach Gachamon. Are you offline?', 0);
  }
  if (text && response.ok) return response.text();
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new GachamonError(data.error || `Request failed (${response.status})`, response.status);
  return data;
}

// ---------------------------------------------------------------------------
// Sign in (Gachamon's Firebase project, loaded lazily)
// ---------------------------------------------------------------------------

let loading = null;

function loadAuth() {
  if (!loading) {
    loading = (async () => {
      const { firebase, pull_sources } = await request('/api/config');
      const [{ initializeApp }, auth] = await Promise.all([
        import(`${SDK}/firebase-app.js`),
        import(`${SDK}/firebase-auth.js`),
      ]);
      const app = initializeApp(firebase, 'gachamon');
      return { auth, instance: auth.getAuth(app), sources: pull_sources || {} };
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}

export async function pullSources() {
  return (await loadAuth()).sources;
}

// callback(user | null): restored session on load, then every sign in / out
export async function watchGachamonAuth(callback) {
  const { auth, instance } = await loadAuth();
  return auth.onAuthStateChanged(instance, callback);
}

export async function signInGachamon() {
  const { auth, instance } = await loadAuth();
  const provider = new auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return auth.signInWithPopup(instance, provider);
}

export async function signOutGachamon() {
  const { auth, instance } = await loadAuth();
  return auth.signOut(instance);
}

const idToken = async () => {
  const { instance } = await loadAuth();
  if (!instance.currentUser) throw new GachamonError('Sign in first.', 401);
  return instance.currentUser.getIdToken();
};

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export const listBanners = () => request('/api/banners');
// `?cards=html`: each item also carries `card_html`, the card drawn by Gachamon with its layout and foil
// (null for items that use the standard card, which the page draws itself).
export const getBanner = id => request(`/api/banners/${id}?cards=html`);

// The styles for that HTML. A <link> can't send the API key header, so fetch it and inject a <style>, once.
let cardStyles = null;
export function loadCardStyles() {
  if (!cardStyles) {
    cardStyles = request('/api/card.css', { text: true }).then(css => {
      const style = document.createElement('style');
      style.id = 'gachamon-card-css';
      style.textContent = css;
      document.head.appendChild(style);
    });
    cardStyles.catch(() => { cardStyles = null; });
  }
  return cardStyles;
}

export const getMe = async () => request('/api/me', { token: await idToken() });
export const getInventory = async () => request('/api/me/inventory?cards=html', { token: await idToken() });
export const pullBanner = async (bannerId, count = 1) =>
  request(`/api/banners/${bannerId}/pull?cards=html`, { method: 'POST', body: { count }, token: await idToken() });
export const listDrops = async () => request('/api/me/drops', { token: await idToken() });
export const claimDrop = async id =>
  request(`/api/me/drops/${id}/claim`, { method: 'POST', token: await idToken() });
export const redeemCode = async code =>
  request('/api/me/redeem', { method: 'POST', body: { code }, token: await idToken() });

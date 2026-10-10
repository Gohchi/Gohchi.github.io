const STORAGE_KEY = 'jp-common-phrases-favorites';

function loadFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
}

export function getFavorites() {
  return loadFavorites();
}

export function isFavorite(id) {
  return loadFavorites().includes(id);
}

export function toggleFavorite(id) {
  const list = loadFavorites();
  const index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }
  saveFavorites(list);
  return list;
}
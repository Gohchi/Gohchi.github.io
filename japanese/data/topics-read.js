const STORAGE_KEY = 'jp-topics-read';

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
}

export function getRead() {
  return load();
}

export function markRead(id) {
  const list = load();
  if (!list.includes(id)) {
    list.push(id);
    save(list);
  }
  return list;
}

export function clearRead() {
  save([]);
  return [];
}
const STORAGE_KEY = 'jp-roadmap-progress';

function loadCompleted() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveCompleted(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
}

export function getCompleted() {
  return loadCompleted();
}

export function isCompleted(id) {
  return loadCompleted().includes(id);
}

export function toggleCompleted(id) {
  const list = loadCompleted();
  const index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }
  saveCompleted(list);
  return list;
}
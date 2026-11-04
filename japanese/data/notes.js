// Personal notes, kept only in this browser (localStorage). Not synced to the account.
//
//   note:   { id, title, content, tags: [string], folder: folderId | null, createdAt, updatedAt }  (times in ms)
//   folder: { id, name, parent: folderId | null }   (a folder can contain other folders)
//
// The order of `notes` and `folders` is the order shown in the list (drag and drop reorders them).
//
// `notesStore` is reactive: views read `notesStore.notes` / `notesStore.folders` directly and call
// the functions below to change them (every change is saved right away).

import { reactive } from 'vue';

const STORAGE_KEY = 'jp-notes';

const makeId = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// "Tag", " tag ", "#tag" -> "tag"
export const cleanTag = tag => String(tag ?? '').trim().replace(/^#+/, '').trim().toLowerCase();

const cleanTags = tags => [...new Set((tags || []).map(cleanTag).filter(Boolean))];

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const notes = Array.isArray(parsed?.notes) ? parsed.notes : [];
    const folders = Array.isArray(parsed?.folders) ? parsed.folders : [];
    return {
      notes: notes.filter(note => note && note.id),
      folders: folders.filter(folder => folder && folder.id).map(folder => ({ ...folder, parent: folder.parent ?? null })),
    };
  } catch (e) {
    return { notes: [], folders: [] };
  }
}

export const notesStore = reactive(load());

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      notes: notesStore.notes,
      folders: notesStore.folders,
    }));
  } catch (e) {
    // ignore quota / privacy-mode errors
  }
}

// another tab changed the notes
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY) return;
  const { notes, folders } = load();
  notesStore.notes = notes;
  notesStore.folders = folders;
});

export function getNote(id) {
  return notesStore.notes.find(note => note.id === id) || null;
}

// Creates the note (no id) or updates it. Returns the saved note.
export function saveNote({ id, title, content, tags, folder }) {
  const now = Date.now();
  const fields = {
    title: String(title ?? '').trim(),
    content: String(content ?? ''),
    tags: cleanTags(tags),
    folder: folder && notesStore.folders.some(item => item.id === folder) ? folder : null,
  };

  const existing = id ? getNote(id) : null;
  if (existing) {
    Object.assign(existing, fields, { updatedAt: now });
    save();
    return existing;
  }

  const note = { id: makeId('note'), ...fields, createdAt: now, updatedAt: now };
  notesStore.notes.unshift(note);
  save();
  return note;
}

export function deleteNote(id) {
  notesStore.notes = notesStore.notes.filter(note => note.id !== id);
  save();
}

export function moveNote(id, folder) {
  const note = getNote(id);
  if (!note) return;
  note.folder = folder || null;
  save();
}

// --- moving / reordering ---

// Puts item `id` right before (or after) item `targetId` in the array.
function reorder(list, id, targetId, after) {
  if (id === targetId) return list;
  const item = list.find(entry => entry.id === id);
  if (!item || !list.some(entry => entry.id === targetId)) return list;
  const rest = list.filter(entry => entry.id !== id);
  const index = rest.findIndex(entry => entry.id === targetId);
  rest.splice(after ? index + 1 : index, 0, item);
  return rest;
}

export function reorderNote(id, targetId, after = false) {
  notesStore.notes = reorder(notesStore.notes, id, targetId, after);
  save();
}

export function reorderFolder(id, targetId, after = false) {
  const target = notesStore.folders.find(folder => folder.id === targetId);
  const folder = notesStore.folders.find(item => item.id === id);
  if (!folder || !target) return;
  folder.parent = target.parent ?? null; // dropping next to a folder puts it at the same level
  if (isInside(target.id, id)) return;   // would end up inside itself
  notesStore.folders = reorder(notesStore.folders, id, targetId, after);
  save();
}

// --- folders ---

export const getFolder = id => notesStore.folders.find(folder => folder.id === id) || null;

export const childFolders = parent => notesStore.folders.filter(folder => (folder.parent ?? null) === (parent ?? null));

// Folders from the top to `id`: [Work, Work/2026, ...]
export function folderPath(id) {
  const path = [];
  const seen = new Set();
  let folder = getFolder(id);
  while (folder && !seen.has(folder.id)) {
    seen.add(folder.id);
    path.unshift(folder);
    folder = folder.parent ? getFolder(folder.parent) : null;
  }
  return path;
}

// true when `id` is `ancestorId` or lives somewhere below it
export function isInside(id, ancestorId) {
  return folderPath(id).some(folder => folder.id === ancestorId);
}

// All folders as a flat tree in display order: [{ folder, depth }]
export function folderTree(parent = null, depth = 0) {
  return childFolders(parent).flatMap(folder => [{ folder, depth }, ...folderTree(folder.id, depth + 1)]);
}

// How many notes / folders are inside a folder, at any depth
export function folderCounts(id) {
  const tree = folderTree(id);
  const ids = new Set([id, ...tree.map(({ folder }) => folder.id)]);
  return {
    folders: tree.length,
    notes: notesStore.notes.filter(note => ids.has(note.folder)).length,
  };
}

export function addFolder(name, parent = null) {
  const clean = String(name ?? '').trim();
  if (!clean) return null;
  const level = parent && getFolder(parent) ? parent : null;
  const same = childFolders(level).find(folder => folder.name.toLowerCase() === clean.toLowerCase());
  if (same) return same;
  const folder = { id: makeId('folder'), name: clean, parent: level };
  notesStore.folders.push(folder);
  save();
  return folder;
}

export function renameFolder(id, name) {
  const folder = getFolder(id);
  const clean = String(name ?? '').trim();
  if (!folder || !clean) return;
  folder.name = clean;
  save();
}

// Puts a folder inside another one (null = top level). A folder can't go inside itself or its own subfolders.
export function moveFolder(id, parent) {
  const folder = getFolder(id);
  if (!folder) return false;
  const target = parent && getFolder(parent) ? parent : null;
  if (target && isInside(target, id)) return false;
  folder.parent = target;
  save();
  return true;
}

// Its notes and subfolders move up to the parent folder.
export function deleteFolder(id) {
  const folder = getFolder(id);
  if (!folder) return;
  const parent = folder.parent ?? null;
  notesStore.folders.forEach(item => {
    if (item.parent === id) item.parent = parent;
  });
  notesStore.notes.forEach(note => {
    if (note.folder === id) note.folder = parent;
  });
  notesStore.folders = notesStore.folders.filter(item => item.id !== id);
  save();
}

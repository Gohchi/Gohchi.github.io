// Personal notes, kept only in this browser (localStorage). Not synced to the account.
//
//   note:   { id, title, content, tags: [string], folder: folderId | null, createdAt, updatedAt }  (times in ms)
//   folder: { id, name }
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
      folders: folders.filter(folder => folder && folder.id),
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

export function addFolder(name) {
  const clean = String(name ?? '').trim();
  if (!clean) return null;
  const same = notesStore.folders.find(folder => folder.name.toLowerCase() === clean.toLowerCase());
  if (same) return same;
  const folder = { id: makeId('folder'), name: clean };
  notesStore.folders.push(folder);
  save();
  return folder;
}

export function renameFolder(id, name) {
  const folder = notesStore.folders.find(item => item.id === id);
  const clean = String(name ?? '').trim();
  if (!folder || !clean) return;
  folder.name = clean;
  save();
}

// The notes of the folder stay, without a folder.
export function deleteFolder(id) {
  notesStore.folders = notesStore.folders.filter(folder => folder.id !== id);
  notesStore.notes.forEach(note => {
    if (note.folder === id) note.folder = null;
  });
  save();
}

import { markRaw } from 'vue';
import { useRouter } from 'vue-router';

import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import FilterMenu, { loadSelection, saveSelection } from 'components/FilterMenu.js';
import template from 'templates/Notes.js';

import {
  notesStore,
  getNote,
  saveNote,
  deleteNote,
  addFolder,
  renameFolder,
  deleteFolder,
  moveNote,
  moveFolder,
  reorderNote,
  reorderFolder,
  getFolder,
  childFolders,
  folderPath,
  folderTree,
  folderCounts,
  isInside,
  cleanTag,
} from 'data/notes.js';

import { zoomStore } from 'store';

const SCOPES = [
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
  { key: 'tags', label: 'Tags' },
];
const SCOPE_KEYS = SCOPES.map(({ key }) => key);
const SCOPE_KEY = 'notes-scope';

const VIEWS = [
  { key: 'folders', icon: '📁', label: 'Folders' },
  { key: 'tree', icon: '🌳', label: 'Tree' },
  { key: 'month', icon: '📅', label: 'Month' },
  { key: 'week', icon: '🗓', label: 'Week' },
];
const VIEW_KEYS = VIEWS.map(({ key }) => key);
const VIEW_KEY = 'notes-view';

const SORTS = [
  { key: 'manual', label: 'My order' },
  { key: 'name-asc', label: 'Name ↑' },
  { key: 'name-desc', label: 'Name ↓' },
  { key: 'date-asc', label: 'Date ↑' },
  { key: 'date-desc', label: 'Date ↓' },
];
const SORT_KEYS = SORTS.map(({ key }) => key);
const SORT_KEY = 'notes-sort';
const COLLAPSED_KEY = 'notes-tree-collapsed';
const VIEWBAR_KEY = 'notes-viewbar-open';

const compareText = (a, b) => String(a).localeCompare(String(b), 'ja', { numeric: true, sensitivity: 'base' });

// Monday of the week of a date
const weekStart = ms => {
  const date = new Date(ms);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7));
};

// Voice to text: browser speech recognition (Chrome / Edge / Safari; needs the microphone)
const SpeechRecognitionAPI = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

const VOICE_LANGS = [
  { lang: 'ja-JP', label: '日本語' },
  { lang: 'en-US', label: 'English' },
  { lang: 'es-AR', label: 'Español' },
];
const VOICE_LANG_KEY = 'notes-voice-lang';

const PAUSE_COMMA_MS = 3000;  // silence of 3 s or more adds 、
const PAUSE_PERIOD_MS = 5000; // silence of 5 s or more adds 。
const PAUSE_MARKS = { 'ja-JP': { comma: '、', period: '。' } };
const DEFAULT_PAUSE_MARKS = { comma: ',', period: '.' };
const ENDS_WITH_MARK = /[、。,.!?！？]\s*$/;

const VOICE_ERRORS = {
  'not-allowed': 'Microphone blocked. Allow it in the browser settings.',
  'service-not-allowed': 'Microphone blocked. Allow it in the browser settings.',
  'audio-capture': 'No microphone found.',
  'network': 'Voice recognition needs an internet connection.',
  'language-not-supported': 'This language is not supported for voice input.',
};

const normalize = text => String(text ?? '').toLowerCase();

const emptyDraft = folder => ({ id: null, title: '', content: '', tags: [], folder: folder || null });

export default {
  components: {
    PhraseToRuby,
    MainHeader,
    FilterMenu,
  },
  props: {
    note: String, // route param: a note id, "new", or undefined = show the list
  },
  setup() {
    const router = useRouter();
    return { router, notesStore };
  },
  data() {
    const savedLang = loadSelection(VOICE_LANG_KEY, null);
    return {
      listScroll: 0,

      query: '',
      searchOpen: false, // mobile only: panel under the header
      folderId: null, // folder being shown (null = top level)
      viewOptions: VIEWS,
      sortOptions: SORTS,
      viewMode: VIEW_KEYS.includes(loadSelection(VIEW_KEY, [])[0]) ? loadSelection(VIEW_KEY, [])[0] : 'folders',
      sortMode: SORT_KEYS.includes(loadSelection(SORT_KEY, [])[0]) ? loadSelection(SORT_KEY, [])[0] : 'manual',
      collapsed: loadSelection(COLLAPSED_KEY, []), // tree: folders that are closed
      viewBarOpen: loadSelection(VIEWBAR_KEY, [false])[0] === true, // view / sort buttons shown
      tagFilter: '',
      scopeOptions: SCOPES,
      searchScope: loadSelection(SCOPE_KEY, SCOPE_KEYS).filter(s => SCOPE_KEYS.includes(s)),

      // folders
      folderFormOpen: false,
      folderName: '',
      renamingFolder: false,
      folderParent: null, // 'inside' selector of the rename form

      // drag and drop: what is being dragged and where it would land
      dragging: null, // { type: 'note' | 'folder', id }
      dropTarget: null, // { type: 'note' | 'folder' | 'crumb', id, mode: 'before' | 'after' | 'into' }

      // editor
      editing: false,
      draft: emptyDraft(),
      tagInput: '',
      dirty: false,

      // voice to text
      voiceSupported: !!SpeechRecognitionAPI,
      voiceLangs: VOICE_LANGS,
      voiceLang: VOICE_LANGS.some(item => item.lang === savedLang?.[0]) ? savedLang[0] : 'ja-JP',
      listening: false,
      // not reactive: recognition object and the cursor position while dictating
      internals: markRaw({ recognition: null, wantListening: false, insertAt: 0, caret: null, lastActivity: 0, pendingPause: '' }),
      voiceTarget: null, // field being dictated into: 'title' | 'tags' | 'content'
      interim: '',
      voiceMessage: '',
    };
  },
  computed: {
    zoomLevel() {
      return zoomStore.getZoomLevel();
    },
    // the saved order is the displayed order
    allNotes() {
      return notesStore.notes;
    },
    folders() {
      return notesStore.folders;
    },
    currentFolder() {
      return this.folderId ? getFolder(this.folderId) : null;
    },
    activeFolderId() {
      return this.currentFolder ? this.currentFolder.id : null;
    },
    // top level > Work > 2026
    breadcrumb() {
      return folderPath(this.activeFolderId);
    },
    // folders shown as cards: the ones inside the current folder (a search shows only notes)
    visibleFolders() {
      if (this.isFiltering) return [];
      return this.sortFolders(childFolders(this.activeFolderId)).map(folder => ({
        folder,
        id: folder.id,
        name: folder.name,
        counts: folderCounts(folder.id),
      }));
    },
    // the folder select of the editor / rename form: every folder, indented by depth
    folderOptions() {
      return folderTree().map(({ folder, depth }) => ({
        id: folder.id,
        label: '\u00a0\u00a0'.repeat(depth) + (depth ? '↳ ' : '') + folder.name,
      }));
    },
    // folders a folder can be moved into (not itself or its subfolders)
    parentOptions() {
      const folder = this.currentFolder;
      return folder ? this.folderOptions.filter(option => !isInside(option.id, folder.id)) : this.folderOptions;
    },
    isFiltering() {
      return !!(this.query.trim() || this.tagFilter);
    },
    knownTags() {
      return [...new Set(notesStore.notes.flatMap(note => note.tags || []))].sort();
    },
    // lowercase text per note, built once per change
    searchIndex() {
      return this.allNotes.map(note => ({
        note,
        title: normalize(note.title),
        content: normalize(note.content),
        tags: normalize((note.tags || []).join(' ')),
      }));
    },
    activeFilterCount() {
      return (this.query.trim() ? 1 : 0)
        + (this.tagFilter ? 1 : 0);
    },
    // search + tag
    matchedNotes() {
      const terms = normalize(this.query).split(/\s+/).filter(Boolean);
      // nothing selected in "Search in" behaves like everything selected
      const scope = this.searchScope.length ? this.searchScope : SCOPE_KEYS;

      return this.searchIndex
        .filter(entry => {
          if (this.tagFilter && !(entry.note.tags || []).includes(this.tagFilter)) return false;
          if (!terms.length) return true;

          const haystack = scope.map(key => entry[key]).join(' ');
          return terms.every(term => haystack.includes(term));
        })
        .map(({ note }) => note);
    },
    // Notes in the list: the current folder's notes, or every match while searching
    folderNotes() {
      const notes = this.isFiltering
        ? this.matchedNotes
        : this.allNotes.filter(note => (getFolder(note.folder) ? note.folder : null) === this.activeFolderId);
      return this.sortNotes(notes);
    },
    cards() {
      return this.folderNotes.map(note => this.describe(note));
    },

    // Month / week view: notes grouped by the day they were created, newest group first
    groups() {
      if (this.viewMode !== 'month' && this.viewMode !== 'week') return [];
      const weekly = this.viewMode === 'week';
      const notes = this.isFiltering ? this.matchedNotes : this.allNotes;
      const byKey = new Map();

      notes.forEach(note => {
        const date = new Date(note.createdAt);
        const start = weekly ? weekStart(note.createdAt) : new Date(date.getFullYear(), date.getMonth(), 1);
        const key = start.getTime();
        if (!byKey.has(key)) byKey.set(key, { key, start, notes: [] });
        byKey.get(key).notes.push(note);
      });

      const ascending = this.sortMode === 'date-asc';
      return [...byKey.values()]
        .sort((a, b) => (ascending ? a.key - b.key : b.key - a.key))
        .map(group => ({
          key: group.key,
          label: weekly ? this.weekLabel(group.start) : this.monthLabel(group.start),
          cards: this.sortNotes(group.notes).map(note => this.describe(note)),
        }));
    },

    // Tree view: folders and notes as one indented list; closed folders hide their content.
    // While searching only the matching notes (and the folders leading to them) are shown, all open.
    treeRows() {
      if (this.viewMode !== 'tree') return [];
      const filtering = this.isFiltering;
      const matched = new Set(this.matchedNotes.map(note => note.id));
      const withMatches = new Set();
      if (filtering) {
        this.matchedNotes.forEach(note => folderPath(note.folder).forEach(folder => withMatches.add(folder.id)));
      }

      const rows = [];
      const walk = (parent, depth) => {
        const folders = this.sortFolders(childFolders(parent)).filter(folder => !filtering || withMatches.has(folder.id));
        folders.forEach(folder => {
          const closed = !filtering && this.collapsed.includes(folder.id);
          rows.push({ kind: 'folder', id: folder.id, depth, name: folder.name, closed, counts: folderCounts(folder.id) });
          if (!closed) walk(folder.id, depth + 1);
        });

        const notes = this.allNotes.filter(note => (getFolder(note.folder) ? note.folder : null) === parent
          && (!filtering || matched.has(note.id)));
        this.sortNotes(notes).forEach(note => rows.push({ kind: 'note', id: note.id, depth, note, card: this.describe(note) }));
      };
      walk(null, 0);
      return rows;
    },

    // what the detail's previous / next buttons walk through = what the list shows, in order
    filteredNotes() {
      if (this.viewMode === 'tree') return this.treeRows.filter(row => row.kind === 'note').map(row => row.note);
      if (this.viewMode === 'folders') return this.folderNotes;
      return this.groups.flatMap(group => group.cards.map(card => card.note));
    },
    listIsEmpty() {
      if (this.viewMode === 'tree') return this.treeRows.length === 0;
      if (this.viewMode === 'folders') return this.folderNotes.length === 0 && this.visibleFolders.length === 0;
      return this.groups.length === 0;
    },
    // where new notes / folders are created: in the folder being shown, else at the top level
    createIn() {
      return this.viewMode === 'folders' ? this.activeFolderId : null;
    },

    // --- detail ---
    isNew() {
      return this.note === 'new';
    },
    currentNote() {
      return this.note && !this.isNew ? getNote(this.note) : null;
    },
    currentMeta() {
      return this.currentNote ? this.describe(this.currentNote) : null;
    },
    // previous / next follow the current filter (or every note if this one is filtered out)
    navList() {
      return this.filteredNotes.some(item => item.id === this.note) ? this.filteredNotes : this.allNotes;
    },
    noteIndex() {
      return this.navList.findIndex(item => item.id === this.note);
    },
    prevNote() {
      return this.noteIndex > 0 ? this.navList[this.noteIndex - 1] : null;
    },
    nextNote() {
      return this.noteIndex >= 0 && this.noteIndex < this.navList.length - 1
        ? this.navList[this.noteIndex + 1]
        : null;
    },
    tagSuggestions() {
      return this.knownTags.filter(tag => !this.draft.tags.includes(tag));
    },
  },
  methods: {
    // --- helpers ---
    describe(note) {
      const path = folderPath(note.folder);
      return {
        note,
        id: note.id,
        title: note.title || 'Untitled',
        untitled: !note.title,
        content: note.content,
        excerpt: note.content.length > 140 ? note.content.slice(0, 140) + '…' : note.content,
        tags: note.tags || [],
        folderName: path.map(folder => folder.name).join(' / '),
        date: this.formatDate(note.createdAt),
        dateTime: this.formatDate(note.createdAt, true),
        edited: note.updatedAt - note.createdAt > 60000 ? this.formatDate(note.updatedAt, true) : '',
      };
    },
    // 2026年11月4日 (with the time: 2026年11月4日 16:47)
    formatDate(ms, withTime = false) {
      const options = withTime
        ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }
        : { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(ms).toLocaleString('ja-JP', options);
    },

    monthLabel(date) {
      return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
    },
    weekLabel(start) {
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      const first = start.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
      const last = end.toLocaleDateString('ja-JP', start.getMonth() === end.getMonth()
        ? { day: 'numeric' }
        : { month: 'long', day: 'numeric' });
      return `${first} – ${last}`;
    },

    // --- view and sort ---
    toggleViewBar() {
      this.viewBarOpen = !this.viewBarOpen;
      saveSelection(VIEWBAR_KEY, [this.viewBarOpen]);
    },
    setView(view) {
      this.viewMode = view;
      saveSelection(VIEW_KEY, [view]);
    },
    setSort(sort) {
      this.sortMode = sort;
      saveSelection(SORT_KEY, [sort]);
    },
    sortNotes(list) {
      if (this.sortMode === 'manual') return list;
      const sorted = [...list];
      const direction = this.sortMode.endsWith('desc') ? -1 : 1;
      if (this.sortMode.startsWith('name')) {
        // untitled notes go last
        return sorted.sort((a, b) => direction * compareText(a.title || '\uffff', b.title || '\uffff'));
      }
      return sorted.sort((a, b) => direction * (a.createdAt - b.createdAt));
    },
    // folders have no date: they follow the name sort, otherwise your order
    sortFolders(list) {
      if (!this.sortMode.startsWith('name')) return list;
      const direction = this.sortMode.endsWith('desc') ? -1 : 1;
      return [...list].sort((a, b) => direction * compareText(a.name, b.name));
    },
    toggleCollapsed(id) {
      this.collapsed = this.collapsed.includes(id)
        ? this.collapsed.filter(item => item !== id)
        : [...this.collapsed, id];
      saveSelection(COLLAPSED_KEY, this.collapsed);
    },

    // --- navigation ---
    openNote(id) {
      // remember where the list was, to come back to the same place
      if (!this.note) this.listScroll = window.scrollY;
      this.searchOpen = false;
      this.router.push({ name: 'notes', params: { note: id } });
    },
    backToList() {
      if (!this.confirmDiscard()) return;
      this.router.push({ name: 'notes' });
    },
    newNote() {
      if (!this.note) this.listScroll = window.scrollY;
      this.searchOpen = false;
      this.router.push({ name: 'notes', params: { note: 'new' } });
    },
    confirmDiscard() {
      return !(this.editing && this.dirty) || window.confirm('Discard the changes to this note?');
    },

    // --- filters ---
    setScope(scope) {
      this.searchScope = scope;
      saveSelection(SCOPE_KEY, scope);
    },
    clearFilters() {
      this.query = '';
      this.tagFilter = '';
    },
    filterByTag(tag) {
      this.tagFilter = this.tagFilter === tag ? '' : tag;
      if (this.note) this.router.push({ name: 'notes' });
    },
    toggleSearch() {
      this.searchOpen = !this.searchOpen;
      if (this.searchOpen) {
        this.$nextTick(() => this.$refs.searchInput && this.$refs.searchInput.focus());
      }
    },
    onSearchEnter() {
      // on mobile this closes the panel (and the keyboard); the filter stays applied
      this.$refs.searchInput && this.$refs.searchInput.blur();
      this.searchOpen = false;
    },
    onSearchEscape() {
      if (this.query) {
        this.query = '';
      } else {
        this.searchOpen = false;
      }
    },

    // --- folders ---
    openFolderForm() {
      this.folderFormOpen = true;
      this.renamingFolder = false;
      this.folderName = '';
      this.$nextTick(() => this.$refs.folderInput && this.$refs.folderInput.focus());
    },
    startRename() {
      if (!this.currentFolder) return;
      this.folderFormOpen = true;
      this.renamingFolder = true;
      this.folderName = this.currentFolder.name;
      this.folderParent = this.currentFolder.parent ?? null;
      this.$nextTick(() => this.$refs.folderInput && this.$refs.folderInput.select());
    },
    closeFolderForm() {
      this.folderFormOpen = false;
      this.renamingFolder = false;
      this.folderName = '';
    },
    submitFolder() {
      if (!this.folderName.trim()) return this.closeFolderForm();
      if (this.renamingFolder && this.currentFolder) {
        renameFolder(this.currentFolder.id, this.folderName);
        moveFolder(this.currentFolder.id, this.folderParent);
      } else {
        // created inside the folder being shown; you stay in that folder
        addFolder(this.folderName, this.createIn);
      }
      this.closeFolderForm();
    },
    removeFolder() {
      const folder = this.currentFolder;
      if (!folder) return;
      if (!window.confirm(`Delete the folder "${folder.name}"? Its notes and folders move up one level.`)) return;
      const parent = folder.parent ?? null;
      deleteFolder(folder.id);
      this.folderId = parent;
    },
    openFolder(id) {
      this.folderId = id;
      this.clearFilters();
    },

    // --- drag and drop: reorder notes / folders, drop them on a folder or on the path above the list ---
    onDragStart(event, type, id) {
      this.dragging = { type, id };
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', id); // Firefox needs some data to start a drag
    },
    onDragEnd() {
      this.dragging = null;
      this.dropTarget = null;
    },
    // Where would the dragged item land on this target?  -> mode, or null when it can't be dropped here
    dropMode(event, type, id) {
      const drag = this.dragging;
      if (!drag || drag.id === id && drag.type === type) return null;

      if (type === 'crumb') {
        if (drag.type === 'folder' && id && isInside(id, drag.id)) return null;
        return 'into';
      }

      const rect = event.currentTarget.getBoundingClientRect();
      // cards in a column are stacked (before / after = top / bottom half), in a grid they sit side by side
      const stacked = event.currentTarget.parentElement.clientWidth < rect.width * 1.5;
      const ratio = stacked
        ? (event.clientY - rect.top) / rect.height
        : (event.clientX - rect.left) / rect.width;

      // reordering only makes sense when the list is in "My order"
      const manual = this.sortMode === 'manual';

      if (type === 'note') {
        return drag.type === 'note' && manual ? (ratio < .5 ? 'before' : 'after') : null;
      }

      // a folder: notes go inside; another folder goes inside (middle) or next to it (edges)
      if (drag.type === 'note') return 'into';
      if (manual && ratio < .25) return 'before';
      if (manual && ratio > .75) return 'after';
      return isInside(id, drag.id) ? null : 'into';
    },
    onDragOver(event, type, id) {
      const mode = this.dropMode(event, type, id);
      if (!mode) {
        if (this.dropTarget && this.dropTarget.type === type && this.dropTarget.id === id) this.dropTarget = null;
        return;
      }
      event.preventDefault(); // allows the drop
      event.dataTransfer.dropEffect = 'move';
      const target = this.dropTarget;
      if (!target || target.type !== type || target.id !== id || target.mode !== mode) {
        this.dropTarget = { type, id, mode };
      }
    },
    onDragLeave(event, type, id) {
      if (event.currentTarget.contains(event.relatedTarget)) return;
      if (this.dropTarget && this.dropTarget.type === type && this.dropTarget.id === id) this.dropTarget = null;
    },
    onDrop(event, type, id) {
      const drag = this.dragging;
      const mode = this.dropMode(event, type, id);
      this.onDragEnd();
      if (!drag || !mode) return;
      event.preventDefault();

      if (drag.type === 'note') {
        if (type === 'note') {
          // in the tree, dropping next to a note also puts it in that note's folder
          if (this.viewMode === 'tree') moveNote(drag.id, getNote(id)?.folder ?? null);
          reorderNote(drag.id, id, mode === 'after');
        }
        else moveNote(drag.id, id); // onto a folder or a level of the path (id null = top level)
      } else if (type === 'folder' && mode !== 'into') {
        reorderFolder(drag.id, id, mode === 'after');
      } else {
        moveFolder(drag.id, id);
      }
    },
    dropClass(type, id) {
      const target = this.dropTarget;
      return target && target.type === type && target.id === id ? 'drop-' + target.mode : '';
    },

    // --- editor ---
    startEdit() {
      if (!this.currentNote) return;
      const { id, title, content, tags, folder } = this.currentNote;
      this.draft = { id, title, content, tags: [...(tags || [])], folder: folder || null };
      this.tagInput = '';
      this.internals.caret = null;
      this.dirty = false;
      this.voiceMessage = '';
      this.editing = true;
    },
    startNew() {
      this.draft = emptyDraft(this.createIn);
      this.tagInput = '';
      this.internals.caret = null;
      this.dirty = false;
      this.voiceMessage = '';
      this.editing = true;
      this.$nextTick(() => this.$refs.titleInput && this.$refs.titleInput.focus());
    },
    cancelEdit() {
      if (!this.confirmDiscard()) return;
      this.stopVoice();
      if (this.isNew) {
        this.editing = false;
        this.router.push({ name: 'notes' });
      } else {
        this.editing = false;
      }
    },
    commitTagInput() {
      const tag = cleanTag(this.tagInput.replace(/,/g, ' '));
      this.tagInput = '';
      if (tag && !this.draft.tags.includes(tag)) {
        this.draft.tags.push(tag);
        this.dirty = true;
      }
    },
    onTagKeydown(e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        this.commitTagInput();
      } else if (e.key === 'Backspace' && !this.tagInput && this.draft.tags.length) {
        this.draft.tags.pop();
        this.dirty = true;
      }
    },
    removeDraftTag(tag) {
      this.draft.tags = this.draft.tags.filter(item => item !== tag);
      this.dirty = true;
    },
    addSuggestedTag(tag) {
      if (!this.draft.tags.includes(tag)) this.draft.tags.push(tag);
      this.dirty = true;
    },
    saveDraft() {
      this.commitTagInput();
      this.stopVoice();
      const empty = !this.draft.title.trim() && !this.draft.content.trim() && !this.draft.tags.length;
      if (empty) {
        this.voiceMessage = 'Write a title or some content first.';
        return;
      }
      const saved = saveNote(this.draft);
      this.editing = false;
      this.dirty = false;
      if (this.isNew) {
        this.router.replace({ name: 'notes', params: { note: saved.id } });
      }
    },
    removeNote() {
      const note = this.currentNote;
      if (!note) return;
      if (!window.confirm(`Delete "${note.title || 'Untitled'}"? This can't be undone.`)) return;
      deleteNote(note.id);
      this.editing = false;
      this.router.replace({ name: 'notes' });
    },

    // --- voice to text ---
    setVoiceLang(lang) {
      this.voiceLang = lang;
      saveSelection(VOICE_LANG_KEY, [lang]);
      // restart with the new language
      if (this.listening) {
        const target = this.voiceTarget;
        this.stopVoice();
        this.$nextTick(() => {
          this.voiceTarget = target;
          this.startVoice();
        });
      }
    },
    // One mic per field (title, tags, content). Pressing another field's mic moves the dictation there.
    toggleVoice(target = 'content') {
      if (this.listening && this.voiceTarget === target) return this.stopVoice();
      this.voiceTarget = target;
      if (target === 'content') {
        // dictated text goes where the cursor was (the end if the field was never focused)
        const length = this.draft.content.length;
        this.internals.insertAt = Math.min(this.internals.caret ?? length, length);
      }
      if (!this.listening) this.startVoice();
    },
    rememberCaret(event) {
      this.internals.caret = event.target.selectionStart;
    },
    startVoice() {
      if (!SpeechRecognitionAPI || this.listening) return;

      this.internals.wantListening = true;
      this.internals.lastActivity = Date.now();
      this.internals.pendingPause = '';
      this.voiceMessage = '';
      this.interim = '';
      this.launchRecognition();
    },
    launchRecognition() {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = this.voiceLang;
      recognition.interimResults = true;
      recognition.continuous = true;
      this.internals.recognition = recognition;

      recognition.onstart = () => {
        this.listening = true;
      };

      recognition.onresult = event => {
        // a pause before speaking again becomes punctuation: 3 s = comma, 5 s = full stop
        const now = Date.now();
        const gap = now - this.internals.lastActivity;
        this.internals.lastActivity = now;
        if (!this.internals.pendingPause && gap >= PAUSE_COMMA_MS) {
          this.internals.pendingPause = gap >= PAUSE_PERIOD_MS ? 'period' : 'comma';
        }

        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const text = result[0].transcript;
          if (result.isFinal) this.insertDictation(text);
          else interim += text;
        }
        this.interim = interim;
      };

      recognition.onerror = event => {
        if (event.error === 'aborted' || event.error === 'no-speech') return;
        this.internals.wantListening = false;
        this.voiceMessage = VOICE_ERRORS[event.error] || `Voice input error: ${event.error}`;
      };

      recognition.onend = () => {
        this.internals.recognition = null;
        // the browser ends the session after a silence: keep going while the mic is on
        if (this.internals.wantListening) {
          try {
            this.launchRecognition();
            return;
          } catch (e) {
            this.internals.wantListening = false;
          }
        }
        this.listening = false;
        this.interim = '';
      };

      try {
        recognition.start();
      } catch (e) {
        this.internals.wantListening = false;
        this.listening = false;
      }
    },
    stopVoice() {
      this.internals.wantListening = false;
      if (this.internals.recognition) {
        try { this.internals.recognition.stop(); } catch (e) { /* already stopped */ }
      }
      this.listening = false;
      this.voiceTarget = null;
      this.interim = '';
    },
    insertDictation(text) {
      const clean = String(text || '').trim();
      if (!clean) return;

      const japanese = this.voiceLang === 'ja-JP';
      const pause = this.internals.pendingPause;
      this.internals.pendingPause = '';
      this.dirty = true;

      if (this.voiceTarget === 'tags') {
        this.tagInput = clean.replace(/[、。,.]+$/, '');
        this.commitTagInput();
        return;
      }

      if (this.voiceTarget === 'title') {
        const title = this.draft.title;
        const separator = japanese || !title || /\s$/.test(title) ? '' : ' ';
        this.draft.title = (title + separator + clean).slice(0, 200);
        return;
      }

      const content = this.draft.content;
      const at = Math.min(this.internals.insertAt ?? content.length, content.length);
      let before = content.slice(0, at);
      const after = content.slice(at);

      // pause before this sentence: close the previous one (not at the very start, not twice)
      if (pause && before.trim() && !ENDS_WITH_MARK.test(before)) {
        const marks = PAUSE_MARKS[this.voiceLang] || DEFAULT_PAUSE_MARKS;
        before = before.replace(/\s+$/, '') + marks[pause];
      }

      // Japanese has no spaces between words; the other languages do
      const separator = japanese || !before || /\s$/.test(before) ? '' : ' ';
      const inserted = separator + clean;

      this.draft.content = before + inserted + after;
      this.internals.insertAt = before.length + inserted.length;
    },

    // --- keyboard: Esc back to the list ---
    onKeydown(e) {
      if (!this.note || this.editing) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;

      if (e.key === 'ArrowLeft' && this.prevNote) {
        this.openNote(this.prevNote.id);
      } else if (e.key === 'ArrowRight' && this.nextNote) {
        this.openNote(this.nextNote.id);
      } else if (e.key === 'Escape') {
        this.backToList();
      }
    },
    onBeforeUnload(e) {
      if (this.editing && this.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    },
  },
  watch: {
    note: {
      immediate: true,
      handler(now, before) {
        this.stopVoice();
        this.editing = false;
        this.dirty = false;
        if (now === 'new') this.startNew();

        // back on the list: the router scrolls to the top, so restore after it
        if (!now && before) {
          this.$nextTick(() => requestAnimationFrame(() => window.scrollTo(0, this.listScroll || 0)));
        }
      },
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown);
    window.addEventListener('beforeunload', this.onBeforeUnload);
  },
  beforeUnmount() {
    this.stopVoice();
    window.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  },
  beforeRouteLeave() {
    return this.confirmDiscard();
  },
  beforeRouteUpdate() {
    return this.confirmDiscard();
  },
  template,
}

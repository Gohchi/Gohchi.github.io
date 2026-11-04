export default /*html*/`
  <div class="notes">
    <MainHeader
      title="NOTES"
    >
      <PhraseToRuby class="phrases-header-jp" zoom :text="'ノート'"></PhraseToRuby>

      <div v-if="!note" class="keyboard-toolbar-buttons topics-toolbar">
        <button
          type="button"
          class="topics-search-toggle"
          :class="{ open: searchOpen }"
          title="Search notes"
          aria-label="Search notes"
          :aria-expanded="searchOpen"
          @click.stop="toggleSearch"
        >
          🔍
          <span v-if="activeFilterCount" class="topics-badge">{{ activeFilterCount }}</span>
        </button>

        <div class="topics-search" :class="{ open: searchOpen }">
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            class="topics-search-input"
            placeholder="Search title or content..."
            aria-label="Search notes"
            autocomplete="off"
            enterkeyhint="search"
            @keydown.enter="onSearchEnter"
            @keydown.esc="onSearchEscape"
          />
          <FilterMenu
            label="Search in"
            title="Where to search"
            :options="scopeOptions"
            :modelValue="searchScope"
            @update:modelValue="setScope"
          />
          <button
            v-if="activeFilterCount"
            type="button"
            class="topics-clear"
            title="Clear filters"
            aria-label="Clear filters"
            @click="clearFilters()"
          >✕</button>
        </div>
      </div>
    </MainHeader>

    <main>
      <!-- ================= LIST ================= -->
      <template v-if="!note">
        <nav v-if="viewMode === 'folders'" class="folder-path" aria-label="Folder">
          <template v-for="(crumb, index) in [{ id: null, name: 'All notes' }, ...breadcrumb]" :key="crumb.id ?? 'root'">
            <span v-if="index" class="crumb-sep" aria-hidden="true">›</span>
            <button
              type="button"
              class="topic-chip crumb"
              :class="[{ on: index === breadcrumb.length }, dropClass('crumb', crumb.id)]"
              :title="dragging ? 'Drop here to move it into ' + crumb.name : crumb.name"
              @click="openFolder(crumb.id)"
              @dragover="onDragOver($event, 'crumb', crumb.id)"
              @dragleave="onDragLeave($event, 'crumb', crumb.id)"
              @drop="onDrop($event, 'crumb', crumb.id)"
            ><template v-if="index">📁 </template>{{ crumb.name }}</button>
          </template>
        </nav>

        <form v-if="folderFormOpen" class="folder-form" @submit.prevent="submitFolder()">
          <input
            ref="folderInput"
            v-model="folderName"
            type="text"
            maxlength="40"
            :placeholder="renamingFolder ? 'Folder name' : 'New folder name'"
            aria-label="Folder name"
            @keydown.esc="closeFolderForm()"
          />
          <label v-if="renamingFolder" class="folder-parent">
            <span>Inside</span>
            <select v-model="folderParent" aria-label="Move the folder inside">
              <option :value="null">All notes</option>
              <option v-for="option in parentOptions" :key="option.id" :value="option.id" :disabled="currentFolder && option.id === currentFolder.id">{{ option.label }}</option>
            </select>
          </label>
          <button type="submit" class="action-pill">{{ renamingFolder ? 'Rename' : 'Create' }}</button>
          <button type="button" class="action-pill" @click="closeFolderForm()">Cancel</button>
        </form>

        <div class="view-bar">
          <div class="view-group" role="group" aria-label="View">
            <button
              v-for="option in viewOptions" :key="option.key"
              type="button"
              class="topic-chip"
              :class="{ on: viewMode === option.key }"
              :aria-pressed="viewMode === option.key"
              @click="setView(option.key)"
            >{{ option.icon }} {{ option.label }}</button>
          </div>
          <div class="view-group" role="group" aria-label="Sort by">
            <button
              v-for="option in sortOptions" :key="option.key"
              type="button"
              class="topic-chip"
              :class="{ on: sortMode === option.key }"
              :aria-pressed="sortMode === option.key"
              @click="setSort(option.key)"
            >{{ option.label }}</button>
          </div>
        </div>

        <div class="topic-summary">
          <span v-if="isFiltering">{{ filteredNotes.length }} / {{ allNotes.length }} notes</span>
          <span v-else>
            <template v-if="viewMode === 'folders' && visibleFolders.length">{{ visibleFolders.length }} folders · </template>{{ filteredNotes.length }} notes
          </span>
          <button
            v-if="tagFilter"
            type="button"
            class="tag tag-filter"
            title="Remove tag filter"
            @click="tagFilter = ''"
          >#{{ tagFilter }} ✕</button>
          <span class="spacer"></span>
          <template v-if="currentFolder && viewMode === 'folders'">
            <button type="button" class="filter-link" @click="startRename()">Rename folder</button>
            <button type="button" class="filter-link danger" @click="removeFolder()">Delete folder</button>
          </template>
          <button type="button" class="action-pill" title="New folder" @click="openFolderForm()">+ Folder</button>
          <button type="button" class="action-pill primary" @click="newNote()">+ New note</button>
        </div>

        <article v-if="allNotes.length === 0 && folders.length === 0" class="unknown">
          <h1 class="title">No notes yet</h1>
          <h2 class="subtitle">Notes are saved only in this browser.</h2>
          <button class="go-back" @click.prevent="newNote()">Write the first one</button>
        </article>

        <article v-else-if="listIsEmpty" class="unknown">
          <template v-if="isFiltering">
            <h1 class="title">Empty list</h1>
            <h2 class="subtitle">Clear filters to see more items</h2>
            <button class="go-back" @click.prevent="clearFilters()">Clear filters</button>
          </template>
          <template v-else-if="viewMode === 'folders'">
            <h1 class="title">This folder is empty</h1>
            <h2 class="subtitle">Drop notes or folders here, or create a new note.</h2>
          </template>
          <template v-else>
            <h1 class="title">Nothing here</h1>
            <h2 class="subtitle">Create a note or a folder to start.</h2>
          </template>
        </article>

        <!-- folders view: subfolders as cards, then the notes of the folder -->
        <ul v-if="viewMode === 'folders'" class="topic-list">
          <li
            v-for="folder in visibleFolders" :key="folder.id"
            class="topic-preview folder-card"
            :class="[dropClass('folder', folder.id), { dragging: dragging && dragging.id === folder.id }]"
            tabindex="0"
            role="link"
            draggable="true"
            @click="openFolder(folder.id)"
            @keydown.enter="openFolder(folder.id)"
            @dragstart="onDragStart($event, 'folder', folder.id)"
            @dragend="onDragEnd()"
            @dragover="onDragOver($event, 'folder', folder.id)"
            @dragleave="onDragLeave($event, 'folder', folder.id)"
            @drop="onDrop($event, 'folder', folder.id)"
          >
            <div class="topic-preview-top">
              <span class="topic-kind">📁 Folder</span>
            </div>
            <h3 class="topic-preview-title note-title">{{ folder.name }}</h3>
            <p class="topic-preview-subtitle">
              {{ folder.counts.notes }} notes<template v-if="folder.counts.folders"> · {{ folder.counts.folders }} folders</template>
            </p>
          </li>

          <li
            v-for="card in cards" :key="card.id"
            class="topic-preview"
            :class="[dropClass('note', card.id), { dragging: dragging && dragging.id === card.id }]"
            tabindex="0"
            role="link"
            draggable="true"
            @click="openNote(card.id)"
            @keydown.enter="openNote(card.id)"
            @dragstart="onDragStart($event, 'note', card.id)"
            @dragend="onDragEnd()"
            @dragover="onDragOver($event, 'note', card.id)"
            @dragleave="onDragLeave($event, 'note', card.id)"
            @drop="onDrop($event, 'note', card.id)"
          >
            <div class="topic-preview-top">
              <span class="topic-kind">📝 Note<template v-if="card.folderName"> · {{ card.folderName }}</template></span>
              <span class="note-date">{{ card.date }}</span>
            </div>

            <h3 class="topic-preview-title note-title" :class="{ untitled: card.untitled }">
              <PhraseToRuby :text="card.title"></PhraseToRuby>
            </h3>

            <p v-if="card.content" class="topic-preview-subtitle note-excerpt">
              <PhraseToRuby :text="card.excerpt"></PhraseToRuby>
            </p>

            <div v-if="card.tags.length" class="tag-list">
              <span
                v-for="tag in card.tags.slice(0, 3)" :key="tag"
                class="tag"
                :class="{ on: tagFilter === tag }"
                @click.stop="filterByTag(tag)"
              >{{ tag }}</span>
            </div>
          </li>
        </ul>

        <!-- month / week view: notes grouped by creation date -->
        <template v-else-if="viewMode === 'month' || viewMode === 'week'">
          <section v-for="group in groups" :key="group.key" class="note-group">
            <h2 class="group-title">{{ group.label }} <span class="count">{{ group.cards.length }}</span></h2>
            <ul class="topic-list">
            <li
                v-for="card in group.cards" :key="card.id"
                class="topic-preview"
                :class="[dropClass('note', card.id), { dragging: dragging && dragging.id === card.id }]"
                tabindex="0"
                role="link"
                draggable="true"
                @click="openNote(card.id)"
                @keydown.enter="openNote(card.id)"
                @dragstart="onDragStart($event, 'note', card.id)"
                @dragend="onDragEnd()"
                @dragover="onDragOver($event, 'note', card.id)"
                @dragleave="onDragLeave($event, 'note', card.id)"
                @drop="onDrop($event, 'note', card.id)"
              >
                <div class="topic-preview-top">
                  <span class="topic-kind">📝 Note<template v-if="card.folderName"> · {{ card.folderName }}</template></span>
                  <span class="note-date">{{ card.date }}</span>
                </div>
  
                <h3 class="topic-preview-title note-title" :class="{ untitled: card.untitled }">
                  <PhraseToRuby :text="card.title"></PhraseToRuby>
                </h3>
  
                <p v-if="card.content" class="topic-preview-subtitle note-excerpt">
                  <PhraseToRuby :text="card.excerpt"></PhraseToRuby>
                </p>
  
                <div v-if="card.tags.length" class="tag-list">
                  <span
                    v-for="tag in card.tags.slice(0, 3)" :key="tag"
                    class="tag"
                    :class="{ on: tagFilter === tag }"
                    @click.stop="filterByTag(tag)"
                  >{{ tag }}</span>
                </div>
              </li>
            </ul>
          </section>
        </template>

        <!-- tree view -->
        <ul v-else-if="viewMode === 'tree'" class="note-tree">
          <!-- the top level: drop a note or folder here to take it out of its folder -->
          <li
            class="tree-row root"
            :class="dropClass('crumb', null)"
            :title="dragging ? 'Drop here to move it to the top level' : 'Top level'"
            @dragover="onDragOver($event, 'crumb', null)"
            @dragleave="onDragLeave($event, 'crumb', null)"
            @drop="onDrop($event, 'crumb', null)"
          >
            <span class="tree-toggle" aria-hidden="true"></span>
            <span class="tree-name">Root</span>
            <span class="tree-meta">{{ dragging ? 'drop here for the top level' : '' }}</span>
          </li>
          <li
            v-for="row in treeRows" :key="row.kind + row.id"
            class="tree-row"
            :class="[row.kind, dropClass(row.kind, row.id), { dragging: dragging && dragging.id === row.id }]"
            :style="{ '--depth': row.depth }"
            tabindex="0"
            role="treeitem"
            draggable="true"
            @click="row.kind === 'folder' ? toggleCollapsed(row.id) : openNote(row.id)"
            @keydown.enter="row.kind === 'folder' ? toggleCollapsed(row.id) : openNote(row.id)"
            @dragstart="onDragStart($event, row.kind, row.id)"
            @dragend="onDragEnd()"
            @dragover="onDragOver($event, row.kind, row.id)"
            @dragleave="onDragLeave($event, row.kind, row.id)"
            @drop="onDrop($event, row.kind, row.id)"
          >
            <template v-if="row.kind === 'folder'">
              <span class="tree-toggle" aria-hidden="true">{{ row.closed ? '▸' : '▾' }}</span>
              <span class="tree-name">📁 {{ row.name }}</span>
              <span class="tree-meta">{{ row.counts.notes }}</span>
            </template>
            <template v-else>
              <span class="tree-toggle" aria-hidden="true"></span>
              <span class="tree-name" :class="{ untitled: row.card.untitled }">📝 <PhraseToRuby :text="row.card.title"></PhraseToRuby></span>
              <span class="tree-meta">{{ row.card.date }}</span>
            </template>
          </li>
        </ul>
      </template>

      <!-- ================= EDITOR ================= -->
      <template v-else-if="editing">
        <div class="topic-bar">
          <button type="button" @click.prevent="cancelEdit()">&#8592; Cancel</button>
          <span class="spacer"></span>
          <button type="button" class="save-button" @click.prevent="saveDraft()">Save</button>
        </div>

        <form class="note-editor" @submit.prevent="saveDraft()">
          <div class="field-with-mic">
            <input
              ref="titleInput"
              v-model="draft.title"
              type="text"
              class="note-title-input"
              placeholder="Title"
              aria-label="Title"
              maxlength="200"
              autocomplete="off"
              @input="dirty = true"
            />
            <button
              type="button"
              class="mic-button"
              :class="{ on: listening && voiceTarget === 'title' }"
              :disabled="!voiceSupported"
              :aria-pressed="listening && voiceTarget === 'title'"
              title="Dictate the title"
              aria-label="Dictate the title"
              @click="toggleVoice('title')"
            ><span class="mic" :class="{ pulse: listening && voiceTarget === 'title' }">🎤</span></button>
          </div>

          <div class="note-row">
            <label class="note-field">
              <span>Folder</span>
              <select v-model="draft.folder" @change="dirty = true">
                <option :value="null">No folder</option>
                <option v-for="option in folderOptions" :key="option.id" :value="option.id">{{ option.label }}</option>
              </select>
            </label>

            <div class="note-field grow">
              <span>Tags</span>
              <div class="tag-input">
                <span v-for="tag in draft.tags" :key="tag" class="tag">
                  #{{ tag }}
                  <button type="button" :aria-label="'Remove tag ' + tag" @click="removeDraftTag(tag)">✕</button>
                </span>
                <input
                  v-model="tagInput"
                  type="text"
                  placeholder="Add a tag..."
                  aria-label="Add a tag"
                  autocomplete="off"
                  enterkeyhint="done"
                  @keydown="onTagKeydown"
                  @blur="commitTagInput()"
                />
                <button
                  type="button"
                  class="mic-button small"
                  :class="{ on: listening && voiceTarget === 'tags' }"
                  :disabled="!voiceSupported"
                  :aria-pressed="listening && voiceTarget === 'tags'"
                  title="Dictate a tag"
                  aria-label="Dictate a tag"
                  @click="toggleVoice('tags')"
                ><span class="mic" :class="{ pulse: listening && voiceTarget === 'tags' }">🎤</span></button>
              </div>
              <div v-if="tagSuggestions.length" class="tag-suggestions">
                <button
                  v-for="tag in tagSuggestions.slice(0, 8)" :key="tag"
                  type="button"
                  class="tag"
                  @click="addSuggestedTag(tag)"
                >+ {{ tag }}</button>
              </div>
            </div>
          </div>

          <div class="voice-bar">
            <button
              type="button"
              class="action-pill voice-button"
              :class="{ on: listening && voiceTarget === 'content' }"
              :disabled="!voiceSupported"
              :aria-pressed="listening && voiceTarget === 'content'"
              :title="voiceSupported ? 'Dictate the content. A pause of 3 s adds a comma, 5 s a full stop.' : 'Voice typing is not supported in this browser'"
              @click="toggleVoice('content')"
            >
              <span class="mic" :class="{ pulse: listening && voiceTarget === 'content' }" aria-hidden="true">🎤</span>
              {{ listening && voiceTarget === 'content' ? 'Stop' : 'Voice to text' }}
            </button>

            <div class="voice-langs" role="group" aria-label="Voice language">
              <button
                v-for="item in voiceLangs" :key="item.lang"
                type="button"
                class="topic-chip"
                :class="{ on: voiceLang === item.lang }"
                :disabled="!voiceSupported"
                @click="setVoiceLang(item.lang)"
              >{{ item.label }}</button>
            </div>
          </div>

          <textarea
            ref="contentInput"
            v-model="draft.content"
            class="note-content-input"
            :class="{ listening }"
            placeholder="Write your note, or press the microphone and speak..."
            aria-label="Content"
            rows="12"
            @input="dirty = true"
            @blur="rememberCaret"
          ></textarea>

          <p v-if="interim" class="voice-interim" aria-live="polite">🎤 {{ interim }}</p>
          <p v-if="listening && !interim" class="voice-interim" aria-live="polite">🎤 Listening ({{ voiceTarget }})...</p>
          <p v-if="voiceMessage" class="voice-message" role="status">{{ voiceMessage }}</p>
          <p v-if="!voiceSupported" class="voice-message">Voice typing needs Chrome, Edge or Safari.</p>

          <div class="phrase-actions">
            <button type="submit" class="action-pill primary">Save note</button>
            <button type="button" class="action-pill" @click="cancelEdit()">Cancel</button>
          </div>
        </form>
      </template>

      <!-- ================= UNKNOWN ================= -->
      <template v-else-if="!currentNote">
        <article class="unknown">
          <h1 class="title">Unknown note</h1>
          <h2 class="subtitle">This note doesn't exist (it may have been deleted).</h2>
          <button class="go-back" @click.prevent="backToList()">Back to notes</button>
        </article>
      </template>

      <!-- ================= DETAIL ================= -->
      <template v-else>
        <div class="topic-bar">
          <button type="button" @click.prevent="backToList()" title="Back to notes (Esc)">&#8592; Notes</button>
          <span class="spacer"></span>
          <button
            type="button"
            :disabled="!prevNote"
            title="Previous note (←)"
            aria-label="Previous note"
            @click="prevNote && openNote(prevNote.id)"
          >&#8249;</button>
          <span v-if="noteIndex >= 0" class="topic-position">{{ noteIndex + 1 }} / {{ navList.length }}</span>
          <button
            type="button"
            :disabled="!nextNote"
            title="Next note (→)"
            aria-label="Next note"
            @click="nextNote && openNote(nextNote.id)"
          >&#8250;</button>
        </div>

        <article class="topic-article" :style="zoomLevel">
          <div class="topic-head">
            <div class="topic-preview-top">
              <span class="topic-kind">📝 Note<template v-if="currentMeta.folderName"> · {{ currentMeta.folderName }}</template></span>
            </div>

            <h1 class="topic-title note-title" :class="{ untitled: currentMeta.untitled }">
              <PhraseToRuby :text="currentMeta.title"></PhraseToRuby>
            </h1>

            <p class="note-dates">
              <PhraseToRuby :text="'作成'"></PhraseToRuby> {{ currentMeta.dateTime }}<template v-if="currentMeta.edited"> · <PhraseToRuby :text="'編集'"></PhraseToRuby> {{ currentMeta.edited }}</template>
            </p>

            <div v-if="currentMeta.tags.length" class="tag-list">
              <button
                v-for="tag in currentMeta.tags" :key="tag"
                type="button"
                class="tag"
                title="Show notes with this tag"
                @click="filterByTag(tag)"
              >#{{ tag }}</button>
            </div>

            <div class="phrase-actions">
              <button type="button" class="action-pill" @click="startEdit()">✎ Edit</button>
              <button type="button" class="action-pill danger" @click="removeNote()">🗑 Delete</button>
            </div>
          </div>

          <section class="topic-section">
            <p v-if="currentNote.content" class="note-body">
              <PhraseToRuby :text="currentNote.content"></PhraseToRuby>
            </p>
            <p v-else class="note-body empty">This note has no content yet.</p>
          </section>
        </article>

        <nav class="topic-pager" aria-label="More notes">
          <button v-if="prevNote" type="button" class="pager prev" @click="openNote(prevNote.id)">
            <small>&#8592; Previous</small>
            <span>{{ prevNote.title || 'Untitled' }}</span>
          </button>
          <button v-if="nextNote" type="button" class="pager next" @click="openNote(nextNote.id)">
            <small>Next &#8594;</small>
            <span>{{ nextNote.title || 'Untitled' }}</span>
          </button>
        </nav>
      </template>
    </main>
  </div>
`;

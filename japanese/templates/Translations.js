export default /*html*/`
  <div class="book-translations">
    <MainHeader
      :title="book ? (currentBookMeta ? currentBookMeta.title : '') : 'TRANSLATIONS'"
      @onChangeFurigana="furiganaStore.switchFurigana()"
    >
      <div class="header-content">
        <PhraseToRuby zoom :text="'翻訳'" />
        <div class="icon-button books-icon" title="select book" @click.prevent="backToBookList()"></div>
        <div class="page-info" v-if="book && hasContent">
          <span class="chapter" v-if="chapter">{{ chapter }}</span>
          <div class="page-number" v-if="showPageNumber">{{ pageNumber }}</div>
        </div>
      </div>
    </MainHeader>

    <main>
      <template v-if="!book">
        <section class="book-list">
          <h1 class="title">Translations</h1>
          <h2 class="subtitle">Select a book to read</h2>
          <ul class="book-grid">
            <li v-for="item in books" :key="item.id"
              class="book-item"
              @click="selectBook(item.id)"
            >
              <div class="book-title">{{ item.title }}</div>
              <div class="book-subtitle">{{ item.subtitle }}</div>
              <div class="book-eng-title">{{ item.engTitle }}</div>
            </li>
          </ul>
        </section>
      </template>

      <template v-else-if="loadingBook">
        <article class="unknown">
          <h1 class="title">Loading...</h1>
        </article>
      </template>

      <template v-else-if="!hasContent">
        <article class="unknown">
          <h1 class="title">{{ currentBookMeta ? currentBookMeta.title : 'Unknown book' }}</h1>
          <h2 class="subtitle">{{ currentBookMeta ? currentBookMeta.subtitle : '' }}</h2>
          <p>Translation not started yet.</p>
          <button class="go-back" @click.prevent="backToBookList()">Back to book list</button>
        </article>
      </template>

      <template v-else>
        <template v-if="type === 'unknown'">
          <article class="unknown">
            <h1 class="title">Unknown Page</h1>
            <h2 class="subtitle">This page is not available.</h2>
            <button class="go-back" @click.prevent="goToIndex()">Go back to Index</button>
          </article>
        </template>

        <template v-if="type === 'main'">
          <article :class="{ 'tategaki': writingDirection === 'tategaki', 'main': true }">
            <h1 class="title">
              <PhraseToRuby :text="title">
              <template v-if="showTranslation">
                <br />
                <span class="translation">{{ page[lang]?.title }}</span>
              </template>
            </h1>
            <h2 class="subtitle">
              <PhraseToRuby :text="subtitle">
              <template v-if="showTranslation">
                <br />
                <span class="translation">{{ page[lang]?.subtitle }}</span>
              </template>
            </h2>
          </article>
        </template>

        <template v-if="type === 'index'">
          <article class="index">
            <h1 class="title">{{ title }}</h1>
            <h2 class="subtitle"><PhraseToRuby :text="subtitle"></h2>
            <ul>
              <li v-for="([name, pageNum], index) in chapters" :key="index"
                class="index-item"
                @click="pageSelected = pageNum"
              >
                {{ name }}..........{{ pageNum }}
              </li>
            </ul>
            <ul class="index-footer">
              <li v-for="(text, index) in footer" :key="index">{{ text }}</li>
            </ul>
          </article>
        </template>

        <template v-if="!type">
          <article
            :class="{ 'tategaki': writingDirection === 'tategaki', 'content': true }"
            :style="zoomLevel"
          >
            <div class="chapter-title" v-if="chapterFirstPage">{{ chapter }}</div>
            <template v-for="(line, index) in content" :key="index">
              <br v-if="line === ''" />
              <template v-if="typeof line === 'number'">
                <div class="chapter-number">&#12298; {{ line }} &#12299;</div>
              </template>
              <template v-else>
                <div class="phrase"><PhraseToRuby :text="line"></div>
                <template v-if="showTranslation && line !== ''">
                  <span class="translation">{{ page[lang][index] }}</span>
                </template>
              </template>
            </template>
          </article>
        </template>

        <div class="actions">
          <button class="next-page" title="つぎ" :disabled="last" @click="nextPage()">&#8592; 次</button>
          <div class="lang-actions">
            <button class="lang-icon"
              :title="showTranslation ? 'Turn off translation' : 'Turn on translation'"
              @click="switchTranslation()"
            >&#127760; {{ showTranslation ? 'on' : 'off' }}</button>
            <template v-if="showTranslation">
              <button class="lang-eng" @click="setLang('eng')" :class="{ active: lang === 'eng' }">ENG</button>
              <button class="lang-esp" @click="setLang('esp')" :class="{ active: lang === 'esp' }">ESP</button>
            </template>
            <template v-if="!showTranslation">
              <button class="tategaki tategaki-button"
                :title="!showTranslation ? 'たてがき' : undefined"
                @click="setWritingDirection('tategaki')"
                :class="{ active: writingDirection === 'tategaki' }"
                :disabled="showTranslation"
              >縦書き</button>
              <button class="yokogaki tategaki-button"
                :title="!showTranslation ? 'よこがき' : undefined"
                @click="setWritingDirection('yokogaki')"
                :class="{ active: writingDirection === 'yokogaki' }"
                :disabled="showTranslation"
              >横書き</button>
            </template>
          </div>
          <button class="prev-page" title="まえ" :disabled="first" @click="prevPage()">前 &#8594;</button>
        </div>
      </template>
    </main>
    <footer>
      <div class="disclaimer" v-if="!hideDisclaimer">
        This is a fan translation for educational purposes. All rights belong to the original creators and publishers. Please support the official release.
      </div>
      <button class="close-disclaimer" @click="hideDisclaimer = true" v-if="!hideDisclaimer">Close</button>
    </footer>
  </div>
`
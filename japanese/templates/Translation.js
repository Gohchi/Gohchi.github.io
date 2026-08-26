export default /*html*/`
  <div class="berserk-novel">
    <MainHeader
      title="小説 ベルセルク"
      @onChangeFurigana="furiganaStore.switchFurigana()"
      @onOpenZoom="zoomStore.openZoom()"
    >
      <div class="page-info">
        <span class="chapter" v-if="chapter">{{ chapter }}</span>
        <div class="page-number" v-if="showPageNumber">{{ pageNumber }}</div>
      </div>
    </MainHeader>

    <main>
      <template v-if="type === 'unknown'">
        <article class="unknown">
          <h1 class="title">Unknown Page</h1>
          <h2 class="subtitle">This page is not available.</h2>
          <button class="go-back" @click.prevent="goToIndex()">Go back to Index</button>
        </article>
      </template>
      
      <template v-if="type === 'main'">
        <article
          :class="{ 'tategaki': writingDirection === 'tategaki', 'main': true }"
        >
          <h1 class="title">
            <PhraseToRuby :text="title"></PhraseToRuby>
            <template v-if="showTranslation">
              <br />
              <span class="translation">{{ page[lang]?.title }}</span>
            </template>
          </h1>
          <h2 class="subtitle">
            <PhraseToRuby :text="subtitle"></PhraseToRuby>
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
          <h2 class="subtitle">
            <PhraseToRuby :text="subtitle"></PhraseToRuby>
          </h2>
          <ul>
            <li v-for="([name, pageNum], index) in chapters" :key="index"
              class="index-item"
              @click="pageSelected = pageNum"
            >
              {{ name }}..........{{ pageNum }}
            </li>
          </ul>
          <ul class="index-footer">
            <li v-for="(text, index) in footer" :key="index">
              {{ text }}
            </li>
          </ul>
        </article>
      </template>

      <template v-if="!type">
        <article
          :class="{ 'tategaki': writingDirection === 'tategaki', 'content': true }"
          :style="'zoom: ' + zoomStore.zoomLevel + '%'"
        >
          <div class="chapter-title" v-if="chapterFirstPage">{{ chapter }}</div>
          <template v-for="(line, index) in content" :key="index">
            <br v-if="line === ''" />
            <template v-if="typeof line === 'number'">
              <div class="chapter-number">&#12298; {{ line }} &#12299;</div>
            </template>
            <template v-else>
              <div class="phrase">
                <PhraseToRuby
                  :text="line"
                  :furigana="furiganaStore.showFurigana"
                ></PhraseToRuby>
              </div>
              <template v-if="showTranslation && line !== ''">
                <span class="translation">{{ page[lang][index] }}</span>
              </template>
            </template>
          </template>
        </article>
      </template>
      
      <div class="actions">
        <template v-if="zoomStore.showZoomMenu">
          <div class="zoom-level">
            <input
              type="range"
              id="zoom-level"
              name="zoom-level"
              min="100"
              max="200"
              :value="zoomStore.zoomLevel ?? 100"
              step="1"
              @change="e => zoomStore.onZoomChange(e)"
            />
            <label for="zoom-level">Zoom</label>
          </div>
          <button @click="zoomStore.confirmZoomLevel()">&#10004;</button>
          <button @click="zoomStore.cancelZoomLevel()">&#10060;</button>
        </template>
        <template v-else>
          <button class="next-page" title="つぎ"
            :disabled="last"
            @click="nextPage()"
          >&#8592; 次</button>
          <div class="lang-actions">
            <button
              class="lang-icon"
              :title="showTranslation ? 'Turn off translation' : 'Turn on translation'"
              @click="switchTranslation()"
            >&#127760; {{ showTranslation ? 'on' : 'off' }}</button>
            <template v-if="showTranslation">
              <button class="lang-eng"
                @click="setLang('eng')"
                :class="{ active: lang === 'eng' }"
              >ENG</button>
              <button class="lang-esp"
                @click="setLang('esp')"
                :class="{ active: lang === 'esp' }"
              >ESP</button>
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
          <button class="prev-page" title="まえ"
            :disabled="first"
            @click="prevPage()"
          >前 &#8594;</button>
        </template>
      </div>
    </main>
    <footer>
      <div class="disclaimer" v-if="!hideDisclaimer">
        This is a fan translation for educational purposes. All rights to "Berserk: The Flame Dragon Knight" belong to Young Animal Comics and the original creators. Please support the official release.
      </div>
      <button class="close-disclaimer" @click="hideDisclaimer = true" v-if="!hideDisclaimer">Close</button>
    </footer>
  </div>
`
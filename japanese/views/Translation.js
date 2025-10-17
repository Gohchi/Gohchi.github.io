import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';

import { translations } from 'data/translations.js';


export default {
  components: {
    PhraseToRuby,
    MainHeader,
  },
  methods: {
    switchFurigana() {
      this.furigana = !this.furigana;
    },
    goToIndex() {
      const index = this.translations.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
    },
    openZoom() {
      this.showMenu = false;
      this.prevZoomLevel = this.zoomLevel;
      this.showZoomMenu = true;
    },
    confirmZoomLevel() {
      this.showZoomMenu = false;
      localStorage.setItem('zoom-level', this.zoomLevel);
    },
    cancelZoomLevel() {
      this.zoomLevel = this.prevZoomLevel;
      this.showZoomMenu = false;
    },
    onZoomChange(e) {
      this.zoomLevel = e.target.value;
    },
    nextPage() {
      document.querySelector('article').scrollTo(0, 0);
      this.pageSelected += 1;
      localStorage.setItem('last-page-visited', this.pageSelected);
    },
    prevPage() {
      document.querySelector('article').scrollTo(0, 0);
      this.pageSelected -= 1;
      localStorage.setItem('last-page-visited', this.pageSelected);
    },
    switchTranslation() {
      this.showTranslation = !this.showTranslation;
      this.writingDirection = 'yokogaki';
      localStorage.setItem('show-translation', this.showTranslation);
      localStorage.setItem('writing-direction', this.writingDirection);
    },
    setLang(value) {
      this.lang = value;
      localStorage.setItem('lang', value);
    },
    setWritingDirection(value) {
      this.writingDirection = value;
      localStorage.setItem('writing-direction', value);
    }
  },
  mounted() {
  },
  data() {
    const zoomLevel = localStorage.getItem('zoom-level');
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      "showMenu": false,
      "translations": translations,
      "pageSelected": lastPageVisited ? +lastPageVisited : 1, // Default to the first page
      "hideDisclaimer": true,
      "lang": lang ?? 'eng', // Default language
      "showTranslation": showTranslation !== null ? showTranslation === 'true' : true,
      "writingDirection": writingDirection ?? 'yokogaki', // Default writing direction - tategaki | yokogaki
      "showZoomMenu": false,
      "zoomLevel": zoomLevel ?? 100,
      "prevZoomLevel": zoomLevel ?? 100,
      "furigana": true,
      "selectedArticle": null,
      "voices": [],
      "selectedVoice": null,
    }
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
    type() {
      if (!this.translations[this.pageSelected-1]) {
        return 'unknown';
      }

      return this.page.type;
    },
    title() {
      return this.page.title;
    },
    subtitle() {
      return this.page.subtitle;
    },
    chapters() {
      return this.page.chapters;
    },
    content() {
      return this.page.content;
    },
    footer() {
      return this.page.footer;
    },
    showPageNumber() {
      return !this.page.hidePageNumber;
    },
    pageNumber() {
      return this.pageSelected?.toString().padStart(3, '0');
    },
    chapter() {
      return this.page.chapter;
    },
    chapterFirstPage() {
      return this.page.chapterFirstPage;
    },
    first() {
      if (this.pageSelected > this.translations.length) {
        return true; // If the selected page is out of bounds, consider it as the first page
      }
      return this.pageSelected === 1;
    },
    last() {
      if (this.pageSelected > this.translations.length) {
        return true; // If the selected page is out of bounds, consider it as the last page
      }
      return this.pageSelected === this.translations.length;
    }
  },
  template: /*html*/`
    <div class="berserk-novel">
      <main-header
        title="小説 ベルセルク"
        @on-change-furigana="furigana = !furigana"
        @on-open-zoom="openZoom()"
      >
        <div class="page-info">
          <span class="chapter" v-if="chapter">{{ chapter }}</span>
          <div class="page-number" v-if="showPageNumber">{{ pageNumber }}</div>
        </div>
      </main-header>

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
              <phrase-to-ruby :text="title"></phrase-to-ruby>
              <template v-if="showTranslation">
                <br />
                <span class="translation">{{ page[lang]?.title }}</span>
              </template>
            </h1>
            <h2 class="subtitle">
              <phrase-to-ruby :text="subtitle"></phrase-to-ruby>
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
              <phrase-to-ruby :text="subtitle"></phrase-to-ruby>
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
            :style="'zoom: ' + zoomLevel + '%'"
          >
            <div class="chapter-title" v-if="chapterFirstPage">{{ chapter }}</div>
            <template v-for="(line, index) in content" :key="index">
              <br v-if="line === ''" />
              <template v-if="typeof line === 'number'">
                <div class="chapter-number">&#12298; {{ line }} &#12299;</div>
              </template>
              <template v-else>
                <div class="phrase">
                  <phrase-to-ruby
                    :text="line"
                    :furigana="furigana"
                  ></phrase-to-ruby>
                </div>
                <template v-if="showTranslation && line !== ''">
                  <span class="translation">{{ page[lang][index] }}</span>
                </template>
              </template>
            </template>
          </article>
        </template>
        
        <div class="actions">
          <template v-if="showZoomMenu">
            <div class="zoom-level">
              <input
                type="range"
                id="zoom-level"
                name="zoom-level"
                min="100"
                max="200"
                :value="zoomLevel ?? 100"
                step="1"
                @change="onZoomChange"
              />
              <label for="zoom-level">Zoom</label>
            </div>
            <button @click="confirmZoomLevel()">&#10004;</button>
            <button @click="cancelZoomLevel()">&#10060;</button>
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
}
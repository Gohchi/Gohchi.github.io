import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';

import { topics } from 'data/topics.js';


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
      const index = this.topics.findIndex(({ type }) => type === 'index') + 1;
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
      "topics": topics,
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
      return this.topics[this.pageSelected-1] || {};
    },
    type() {
      if (!this.topics[this.pageSelected-1]) {
        return 'unknown';
      }

      return this.page.type;
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
      if (this.pageSelected > this.topics.length) {
        return true; // If the selected page is out of bounds, consider it as the first page
      }
      return this.pageSelected === 1;
    },
    last() {
      if (this.pageSelected > this.topics.length) {
        return true; // If the selected page is out of bounds, consider it as the last page
      }
      return this.pageSelected === this.topics.length;
    }

  },
  template: /*html*/`
    <div class="topics">
      <main-header
        title="TOPICS"
        @on-change-furigana="furigana = !furigana"
        @on-open-zoom="openZoom()"
      >
        <phrase-to-ruby :text="'話題'"></phrase-to-ruby>
      </main-header>

      <main>
        <template v-if="type === 'unknown'">
          <article class="unknown">
            <h1 class="title">Unknown Page</h1>
            <h2 class="subtitle">This page is not available.</h2>
            <button class="go-back" @click.prevent="goToIndex()">Go back to Index</button>
          </article>
        </template>
        
        <template v-for="(item, index) in topics" :key="index">
          <template v-if="type === 'standard'">
            <article>
              <h1 class="title">
                <div>{{ item.title }}</div>
              </h1>
              <h2 class="subtitle">
                <div>{{ item.subtitle }}</div>
              </h2>
              <div class="sources">
                <span>source:</span>
                <template v-for="(source, i) in item.sources" :key="i" :href="source">
                  <a :href="source">{{ i+1 }}</a>
                </template>
              </div>
            </article>
          </template>

          <template v-if="type === 'resource'">
            <article>
              <h1 class="title">
                <div>{{ item.title }}</div>
              </h1>
              <h2 class="subtitle">
                <div>{{ item.subtitle }}</div>
              </h2>
            </article>
          </template>
        </template>
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
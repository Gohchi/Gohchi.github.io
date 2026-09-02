import PhraseToRuby from 'components/PhraseToRuby.js';
import MainHeader from 'components/MainHeader.js';
import ListOfItems from 'components/ListOfItems.js';
import Sources from 'components/Sources.js';
import template from 'templates/Topics.js';

import { topics } from 'data/topics.js';

import {
  zoomStore,
  furiganaStore
} from 'store';

export default {
  components: {
    PhraseToRuby,
    MainHeader,
    ListOfItems,
    Sources,
  },
  methods: {
    goToIndex() {
      const index = this.topics.findIndex(({ type }) => type === 'index') + 1;
      this.pageSelected = index;
    },
  },
  mounted() {
  },
  data() {
    const lastPageVisited = localStorage.getItem('topics-last-page-visited');

    return {
      "topics": topics,
      "pageSelected": lastPageVisited ? +lastPageVisited : 1, // Default to the first page
      "hideDisclaimer": true,
      "selectedArticle": null,
      "titleFilters": "",
      "subtitleFilters": "",
      zoomStore,
      furiganaStore
    }
  },
  computed: {
    filteredTopics() {
      return this.topics.filter(item => {
        if (this.titleFilters === "" && this.subtitleFilters === "") {
          return true; // No filters applied, include all topics
        }

        let titleFilter = false;
        let subtitleFilter = false;

        if (this.titleFilters) {
          const titleFilters = this.titleFilters?.split(' ').map(filter => filter.toLowerCase());
          titleFilter = item.title.split(' ').some(word => titleFilters.some(filter => word.toLowerCase().includes(filter)));
        }

        if (this.subtitleFilters) {
          const subtitleFilters = this.subtitleFilters?.split(' ').map(filter => filter.toLowerCase());
          subtitleFilter = subtitleFilters?.length === 0 || item.subtitle.split(' ').some(word => subtitleFilters.some(filter => word.toLowerCase().includes(filter)));
        }

        return titleFilter || subtitleFilter;
      });
    },
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
  template
}
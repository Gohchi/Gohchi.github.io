import { useRouter } from 'vue-router';

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
  props: {
    topic: String, // route param slug; undefined = show the preview list
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    selectTopic(id) {
      this.router.push({ name: 'topics', params: { topic: id } });
    },
    backToList() {
      this.router.push({ name: 'topics' });
    },
  },
  data() {
    return {
      topics,
      hideDisclaimer: true,
      titleFilters: '',
      subtitleFilters: '',
      furiganaStore,
    };
  },
  computed: {
    zoomLevel() {
      return zoomStore.getZoomLevel();
    },
    filteredTopics() {
      return this.topics.filter(item => {
        if (this.titleFilters === '' && this.subtitleFilters === '') {
          return true;
        }

        let titleFilter = false;
        let subtitleFilter = false;

        if (this.titleFilters) {
          const titleFilters = this.titleFilters.split(' ').map(f => f.toLowerCase());
          titleFilter = item.title.split(' ').some(word => titleFilters.some(filter => word.toLowerCase().includes(filter)));
        }

        if (this.subtitleFilters) {
          const subtitleFilters = this.subtitleFilters.split(' ').map(f => f.toLowerCase());
          subtitleFilter = item.subtitle
            ?.split(' ').some(word => subtitleFilters.some(filter => word.toLowerCase().includes(filter))) ?? false;
        }

        return titleFilter || subtitleFilter;
      });
    },
    currentTopic() {
      if (!this.topic) return null;
      return this.topics.find(item => item.id === this.topic) || null;
    },
    relatedTopics() {
      if (!this.currentTopic) return [];
      const currentTags = this.currentTopic.tags || [];
      if (!currentTags.length) return [];

      return this.topics
        .filter(item => item.id !== this.currentTopic.id)
        .map(item => ({
          ...item,
          sharedTagCount: (item.tags || []).filter(tag => currentTags.includes(tag)).length,
        }))
        .filter(item => item.sharedTagCount > 0)
        .sort((a, b) => b.sharedTagCount - a.sharedTagCount)
        .slice(0, 4);
    },
  },
  template,
}
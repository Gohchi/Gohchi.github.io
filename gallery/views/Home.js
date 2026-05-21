import AppHeader from 'components/AppHeader.js';
import AppFooter from 'components/AppFooter.js';
import HeroScene from 'components/HeroScene.js';
import SelectionPanel from 'components/SelectionPanel.js';
import RelatedPanel from 'components/RelatedPanel.js';
import ExploreSection from 'components/ExploreSection.js';

import template from 'templates/Home.js';

import { movies } from 'data/movies.js';

export default {
  // setup(props) {
  //   const { text } = toRefs(props);
    
  //   return {
  //     "text": text,
  //   };
  // },
  components: {
    AppHeader,
    AppFooter,
    HeroScene,
    SelectionPanel,
    RelatedPanel,
    ExploreSection,
  },
  methods: {
    getRelatedImages(currentImage) {
      return this.movies
        .filter(img => img.id !== currentImage.id)
        .map(img => {
          let score = 0;

          if (img.director === currentImage.director) {
            score += 5;
          }

          const sharedMood = img.mood.filter((m) =>
            currentImage.mood.includes(m)
          ).length;

          const sharedVisuals = img.visualTags.filter((v) =>
            currentImage.visualTags.includes(v)
          ).length;

          score += sharedMood * 3;
          score += sharedVisuals * 2;

          return {
            ...img,
            score,
          }
        })
        .sort((a, b) => b.score - a.score);
    },
  },
  data() {
    const zoomLevel = localStorage.getItem('zoom-level');
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    return {
      "movies": movies,
      "lang": lang ?? 'eng', // Default language
      "selection": {
        bb001: 2,
        matrix001: 1,
      }
    };
  },
  computed: {
    page() {
      return this.translations[this.pageSelected-1] || {};
    },
    featured() {
      return this.movies[0];
    },
    related() {
      return this.getRelatedImages(this.featured);
    },
    selectedImages() {
      return Object.entries(this.selection)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => {
          const img = this.movies.find(m => m.id === id);
          return {
            ...img,
            qty,
          };
        });
    }
  },
  template,
};
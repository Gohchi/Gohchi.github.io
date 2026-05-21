import AppHeader from 'components/AppHeader.js';
import AppFooter from 'components/AppFooter.js';
import HeroScene from 'components/HeroScene.js';
import SelectionPanel from 'components/SelectionPanel.js';
import RelatedPanel from 'components/RelatedPanel.js';
import ExploreSection from 'components/ExploreSection.js';

import template from 'templates/Home.js';

import { movies } from 'data/movies.js';

export default {
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
    removeAll(id) {
      delete this.selection[id];
      this.selection = { ...this.selection }; // trigger reactivity
    },
    removeOne(id) {
      this.selection = { ...this.selection, [id]: this.selection[id] - 1 }; // trigger reactivity
    },
    addOne(id) {
      this.selection = { ...this.selection, [id]: (this.selection[id] || 0) + 1 }; // trigger reactivity
    },

    selectImage(id) {
      this.featured = this.movies.find(m => m.id === id) || this.featured;

      if (window && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    
    updateHashFromSelection() {
      try {
        const parts = Object.entries(this.selection)
          .filter(([_, v]) => Number(v) > 0)
          .map(([k, v]) => `${k}:${v}`);
        const hash = parts.length ? `#${parts.join(',')}` : '#';
        if (window && window.location) {
          // replaceState so navigation isn't cluttered
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', hash);
          } else {
            window.location.hash = hash;
          }
        }
      } catch (e) {
        // ignore
      }
    },
  },
  watch: {
    selection(newValue, oldValue) {
      this.updateHashFromSelection();
    }
  },
  data() {
    const zoomLevel = localStorage.getItem('zoom-level');
    const lastPageVisited = localStorage.getItem('last-page-visited');
    const showTranslation = localStorage.getItem('show-translation');
    const writingDirection = localStorage.getItem('writing-direction');
    const lang = localStorage.getItem('lang');

    const parseSelectionFromHash = () => {
      try {
        const hash = (window && window.location && window.location.hash) || '';
        if (!hash) return null;
        const cleaned = hash.replace(/^#\/?/, '');
        if (!cleaned) return null;
        const parts = cleaned.split(',');
        const sel = {};
        parts.forEach(part => {
          const [key, val] = part.split(':').map(s => s && s.trim());
          if (key && val && !Number.isNaN(Number(val))) {
            sel[key] = Number(val);
          }
        });
        return Object.keys(sel).length ? sel : null;
      } catch (e) {
        return null;
      }
    };

    const parsedSelection = parseSelectionFromHash();

    return {
      "movies": movies,
      "lang": lang ?? 'eng', // Default language
      "selection": parsedSelection || {},
      "featured": movies[0],
    };
  },
  computed: {
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
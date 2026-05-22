import AppHeader from 'components/AppHeader.js';
import AppFooter from 'components/AppFooter.js';
import HeroScene from 'components/HeroScene.js';
import SelectionPanel from 'components/SelectionPanel.js';
import RelatedPanel from 'components/RelatedPanel.js';
import ExploreSection from 'components/ExploreSection.js';
import Notifications from 'components/Notifications.js';

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
    Notifications
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

      this.showCart = false;
      this.scrollToTop();
    },
    scrollToExplore() {
      const exploreSection = document.getElementById('explore');
      if (exploreSection) {
        const elementTop = exploreSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementTop - 140, behavior: 'smooth' });
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
    scrollToTop() {
      if (window && window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    goHome() {
      this.showCart = false;
      this.exploring = false;
      this.scrollToTop();
    },
    swapCart() {
      this.showCart = !this.showCart;
      this.exploring = false;
      this.featured = null;
      this.scrollToTop();
    },
    explore(){ 
      this.exploring = !this.exploring;
      this.showCart = false;
      this.featured = null;
      this.scrollToTop();
    },
    shareHash() {
      return this.selectedImages
        .map(({ id, qty }) => `${id}:${qty}`)
        .join(',');
    },
    sendNotification(title, message, error = false) {
      if (this.notification && this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }

      this.notification = {
        title,
        message,
        error,
      };
      
      this.notification.timeout = setTimeout(() => {
        this.notification = null;
      }, 3000);
    },
    share() {
      const hash = this.shareHash();
      const baseURL = 'https://www.fromprototype.com/gallery/#/';
      const url = baseURL + hash;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.sendNotification('Success', 'Selection URL copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy URL: ', err);
          this.sendNotification('Error', 'Failed to copy URL. Please try copying manually: ' + url, true);
        });
    },
    confirmOrder() {
      const hash = this.shareHash();
      const baseURL = 'https://www.fromprototype.com/gallery/%23/';
      const baseFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSf_8pQla0dXNVhgsWmsY98ObZwQUY1_Zf-uJ5uisJ5C7CBTkg/viewform?usp=pp_url&entry.654069638=';
      const url = baseFormURL + baseURL + hash;
      window.open(url, '_blank', 'noopener');
    }
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
      "featured": null,
      "showCart": false,
      "exploring": false,
      "notification": null,
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
    },
    totalItems() {
      return this.selection ? Object.values(this.selection).reduce((sum, qty) => sum + qty, 0) : null;
    },
    isDesktop() {
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024; // default to desktop width if window is not available
      return windowWidth >= 768;
    }
  },
  template,
};
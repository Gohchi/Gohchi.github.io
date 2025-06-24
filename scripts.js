import { createApp } from 'vue';
import Book from './modules/Book.js';
import Element from './modules/Element.js';

createApp({
  components: {
    Book,
    Element
  },
  methods: {
    getFragment() {
      return window.location.hash ? window.location.hash.substring(1) : '';
    },
    openWindow(url) {
      window.open(url);
    },
    selectTab(tab) {
      this.showDropdown = false;
      this.selectedTab = tab;
      this.redirectCheck(tab);
    },
    redirectCheck(tab) {
      if (tab === 'about-me') {
        window.open('devontrain', '_blank');
      } else if (tab === 'contact') {
        window.open('https://github.com/Gohchi', '_blank');
      }
    }
  },
  data() {
    const fragment = this.getFragment();

    this.redirectCheck(fragment);

    return {
      bgSvgMode: false,
      showBook: false, //window.innerWidth > 1200,
      showDropdown: false,
      selectedTab: fragment ?? 'home',
      projects: [
        // { id: 'project01', url: 'https://github.com/Gohchi/', title: 'Go to Github♥', text: 'Check my repos!' },
        { id: 'project02', url: 'https://slots-marshall-lee.vercel.app/', title: 'A simple slots game demo in Phaser 3.', text: 'SLOTS game made in Phaser 3' },
        // {
        //   id: 'project03',
        //   url: 'devontrain',
        //   title: 'This is a very old project. Started in a tiny cellphone with a QWERTY keyboard on my long trips to my job. '
        //       + 'It\'s not a good memory at all. But it\'s experience.',
        //   text: 'Show me the magic'
        // },
        // { id: 'project04', url: 'metro/main.html' },
        { id: 'project05', url: 'hangeul', title: 'A simple tool to practice numbers in Hangeul.', text: 'Hangeul - Number generator' },
        { id: 'project13', url: 'japanese', title: 'My notes for my Japanese learning journey.', text: 'Japanese notes' },
        { id: 'project06', url: 'tools', title: 'A simple tool to create a pattern from an image.', text: 'Mosaicos - Pattern generator' },
        { id: 'project07', url: 'portrait', title: 'Test with Three.js with a model I created', text: 'ThreeJS - Portrait' },
        { id: 'project08', url: 'ygo', title: 'My collection of Yu-Gi-Oh! cards', text: 'Yu-Gi-Oh! collection' },
        // { id: 'project09', url: '3DS', title: '3DS tools', text: '3DS tools' },
        { id: 'project10', url: 'gametracker', title: 'Game trackers (currently only for Disgaea)', text: 'Game Tracker' },
        { id: 'project11', url: 'PSVita', title: 'PS Vita tools', text: 'PS Vita tools' },
        { id: 'project12', url: 'my-links', title: 'A tools for links', text: 'My links tool' },
      ]
    }
  },
  computed: {
    showProjects() {
      const fragment = window.location.hash ? window.location.hash.substring(1) : '';
      return ['projects'].includes(fragment);
    }
  }
}).mount('#app');
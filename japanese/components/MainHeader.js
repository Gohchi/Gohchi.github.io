import { toRefs, defineEmits } from 'vue';


export default {
  props: {
    title: String,
    isHome: Boolean,
    hideFurigana: Boolean,
    hideZoom: Boolean,
  },
  setup(props, { emit }) {
    const {
      title,
      isHome,
      hideFurigana,
      hideZoom,
    } = toRefs(props);

    return {
      title,
      isHome,
      onChangeFurigana: () => emit('onChangeFurigana'),
      onOpenZoom: () => emit('onOpenZoom'),
      hideFurigana,
      hideZoom,
    };
  },
  data() {
    return {
      showMenu: false,
    };
  },
  components: {
  },
  methods: {
  },
  template: /*html*/`
    <header>
      <div class="title">
        {{ title }}
        <slot></slot>
      </div>
      
      <ul class="menu-index" v-if="showMenu">
        <li><a href="#">COMMON PHRASES 〠</a></li>
        <li><router-link to="/translation">小説 ベルセルク： 炎竜の騎士</router-link></li>
        <li><router-link to="/kana-keyboard">KANA KEYBOARD</router-link></li>
        <li><router-link to="/topics">TOPICS</router-link></li>
        <li v-if="!hideFurigana"><a href="#" @click.prevent="onChangeFurigana()">Switch furigana</a></li>
        <li v-if="!hideZoom"><a href="#" @click.prevent="onOpenZoom()">Zoom level</a></li>
      </ul>
      
      <div class="icon-menu" @click="showMenu=!showMenu">
      </div>
    </header>
  `,
}
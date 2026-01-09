import { toRefs, defineEmits } from 'vue';


export default {
  props: {
    title: String,
    hideFurigana: Boolean,
    hideZoom: Boolean,
  },
  setup(props, { emit }) {
    const {
      title,
      hideFurigana,
      hideZoom,
    } = toRefs(props);

    return {
      title,
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
        <li><router-link to="/">Go back</router-link></li>
        <li v-if="!hideFurigana"><a href="#" @click.prevent="onChangeFurigana()">Switch furigana</a></li>
        <li v-if="!hideZoom"><a href="#" @click.prevent="onOpenZoom()">Zoom level</a></li>
      </ul>
      
      <div class="icon-menu" @click="showMenu=!showMenu">
      </div>
    </header>
  `,
}
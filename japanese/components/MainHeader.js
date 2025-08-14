import { toRefs, defineEmits } from 'vue';

import { goTo } from "../tools.js";


export default {
  props: {
    title: String,
  },
  setup(props, { emit }) {
    const {
      title,
    } = toRefs(props);

    return {
      title,
      onChangeFurigana: () => emit('onChangeFurigana'),
      onOpenZoom: () => emit('onOpenZoom'),
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
    goTo,
  },
  template: /*html*/`
    <header>
      <div class="title">
        {{ title }}
        <slot></slot>
      </div>
      
      <ul class="menu-index" v-if="showMenu">
        <li><a href="#" @click.prevent="goTo('./')">Go back</a></li>
        <li><a href="#" @click.prevent="onChangeFurigana()">Switch furigana</a></li>
        <li><a href="#" @click.prevent="onOpenZoom()">Zoom level</a></li>
      </ul>
      
      <div class="icon-menu" @click="showMenu=!showMenu">
      </div>
    </header>
  `,
}
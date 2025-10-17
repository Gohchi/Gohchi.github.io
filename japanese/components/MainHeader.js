import { toRefs, defineEmits } from 'vue';


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
  },
  template: /*html*/`
    <header>
      <div class="title">
        {{ title }}
        <slot></slot>
      </div>
      
      <ul class="menu-index" v-if="showMenu">
        <li><router-link to="/">Go back</router-link></li>
        <li><a href="#" @click.prevent="onChangeFurigana()">Switch furigana</a></li>
        <li><a href="#" @click.prevent="onOpenZoom()">Zoom level</a></li>
      </ul>
      
      <div class="icon-menu" @click="showMenu=!showMenu">
      </div>
    </header>
  `,
}
import { toRefs } from 'vue';

export default {
  props: {
    sources: Array,
  },
  setup(props) {
    const { sources } = toRefs(props);
    
    return {
      sources,
    };
  },
  template: /*html*/`
    <div class="sources">
      <span>source:</span>
      <template v-for="({url, title}, i) in sources" :key="i">
        <a :href="url" target="_blank" rel="noopener noreferrer">
          {{ title || i+1 }}
        </a>
      </template>
    </div>
  `,
}
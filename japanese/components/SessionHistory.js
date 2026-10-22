import { toRefs } from 'vue';

export default {
  props: {
    entries: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const { entries } = toRefs(props);
    return { entries };
  },
  data() {
    return {
      show: false,
    };
  },
  template: /*html*/`
    <section v-if="entries.length" class="session-history">
      <h3>Session history</h3>
      <ul>
        <li v-if="!show" class="buttons" @click="show = true">Show</li>
        <li v-else class="buttons" @click="show = false">Hide</li>
        <li
          v-if="show"
          v-for="entry in entries" :key="entry.id"
          :class="entry.isCorrect ? 'history-ok' : 'history-bad'"
        >
          <span class="history-icon">{{ entry.isCorrect ? '✅' : '❌' }}</span>
          <span class="history-prompt">
            {{ entry.prompt }}<template v-if="entry.detail"> ({{ entry.detail }})</template>
          </span>
          <span class="history-chosen">chose: {{ entry.chosen }}</span>
          <span v-if="!entry.isCorrect" class="history-correct">correct: {{ entry.correctAnswer }}</span>
        </li>
      </ul>
    </section>
  `,
}
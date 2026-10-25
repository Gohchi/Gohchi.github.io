import { toRefs } from 'vue';

import { speak } from 'tools';

export default {
  props: {
    items: Array,
  },
  setup(props) {
    const { items } = toRefs(props);

    return {
      items,
    };
  },
  computed: {
    // union of the keys of every item (the first item may not have all of them)
    columns() {
      const keys = [];
      (this.items || []).forEach(item => {
        Object.keys(item).forEach(key => {
          if (!keys.includes(key)) keys.push(key);
        });
      });
      return keys;
    },
  },
  methods: {
    listen(item) {
      const text = item.kana || item.kanji;
      if (text) speak(text);
    },
  },
  template: /*html*/`
    <div class="table-wrap">
      <table class="list-of-items">
        <thead>
          <tr>
            <th v-for="key in columns" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items" :key="index"
            title="Click to listen"
            @click="listen(item)"
          >
            <td v-for="key in columns" :key="key" :class="'col-' + key">{{ item[key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
}
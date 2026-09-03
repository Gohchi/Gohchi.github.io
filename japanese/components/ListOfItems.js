import { toRefs } from 'vue';

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
  template: /*html*/`
    <table class="list-of-items">
      <thead>
        <tr>
          <th v-for="key in Object.keys(items[0] || {})" :key="key">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td v-for="key in Object.keys(items[0] || {})" :key="key">{{ item[key] }}</td>
        </tr>
      </tbody>
    </table>
  `,
}
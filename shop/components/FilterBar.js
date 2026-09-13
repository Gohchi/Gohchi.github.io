import { categories } from '../data/categories.js';

export default {
  props: {
    modelValue: String, // selected type id
    searchQuery: String,
    hideSold: Boolean,
  },
  setup(props, { emit }) {
    return {
      categories,
      selectType: id => emit('update:modelValue', id),
      updateSearch: value => emit('update:searchQuery', value),
      toggleHideSold: () => emit('update:hideSold', !props.hideSold),
    };
  },
  template: /*html*/`
    <div class="flex flex-col gap-4 mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectType(cat.id)"
          class="rounded-full px-4 py-1.5 text-sm border transition-colors cursor-pointer"
          :class="modelValue === cat.id
            ? 'bg-white text-black border-white'
            : 'border-zinc-800 text-zinc-300 hover:border-zinc-600'"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <input
          :value="searchQuery"
          @input="updateSearch($event.target.value)"
          type="search"
          placeholder="Search by name, tag, franchise..."
          class="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm w-full max-w-sm outline-none focus:border-zinc-600"
        />

        <label class="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
          <input type="checkbox" :checked="hideSold" @change="toggleHideSold()" />
          Hide sold items
        </label>
      </div>
    </div>
  `,
};

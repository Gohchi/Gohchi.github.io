export default {
  template: /*html*/`
    <div :class="small ? '' : 'mb-4 flex gap-2 items-center'">
      <label class="block text-sm font-medium text-white mb-1">{{ prop }}:</label>
      <input
        v-model="game[prop]"
        :placeholder="prop"
        class="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500"
      />
      <button v-if="button"
        @click="changeImage"
        class="cursor-pointer inline-flex items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:border-zinc-500"
      >
        change
      </button>
    </div>
  `,
  props: {
    game: {
      type: Object,
      required: true,
    },
    prop: {
      type: String,
      required: true,
    },
    small: {
      type: Boolean,
    },
    button: {
      type: Boolean,
    }
  },
  setup(props, { emit }) {
    return {
      changeImage: () => emit('changeImage', props.game),
    };
  },
};

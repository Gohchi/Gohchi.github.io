export default {
  props: { modelValue: { type: Number, default: 0 }, stars: { type: Number, default: 5 }, readonly: Boolean },
  emits: ['update:modelValue'],
  template: /*html*/`
    <div class="rating" :class="{ active: !readonly }">
      <ul><li v-for="n in stars" :key="n" :class="{ rated: n <= modelValue }"
        @click="!readonly && $emit('update:modelValue', n)"></li></ul>
    </div>`,
};
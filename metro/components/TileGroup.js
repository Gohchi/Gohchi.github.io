export default {
  props: {
    title: String,
    size: String,   // one | two | three | four | five | six | seven (width in tile columns)
  },
  template: /*html*/`
    <div class="tile-group" :class="size">
      <span v-if="title" class="tile-group-title">{{ title }}</span>
      <slot />
    </div>`,
};
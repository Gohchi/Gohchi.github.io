export default {
  props: {
    color: { type: String, default: 'dark' },   // dark, darkBlue, darkTeal, ... (tile-area-<color>)
    title: String,
  },
  template: /*html*/`
    <div class="tile-area" :class="'tile-area-' + color">
      <h1 v-if="title" class="tile-area-title">{{ title }}</h1>
      <slot name="user" />
      <slot />
    </div>`,
};
export default {
  props: {
    icon: String,
    disabled: Boolean,
  },
  methods: {
    click() {
      this.$emit('onClick');
    },
  },
  template: /*html*/`
    <button
      class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
      aria-label="Orientation"
      :disabled="disabled"
      @click="click()"
    >{{ icon }}</button>
  `,
};
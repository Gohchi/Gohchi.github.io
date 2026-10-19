export default {
  props: {
    id: String,
    icon: String,
    options: Object,
    openMenu: Function,
    selected: String,
    ariaLabel: String,
  },
  methods: {
    change(key) {
      this.$emit('change', key);
    },
  },
  template: /*html*/`
    <div class="mdc-menu-surface--anchor">
      <button :id="'button-' + id"
        class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
        :aria-label="ariaLabel || 'Menu option'"
        @click="openMenu(id)"
      >{{ icon }}</button>
      <div :id="'menu-' + id" class="mdc-menu mdc-menu-surface">
        <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
          <component v-for="[key, value] in options">
            <li class="mdc-list-item" role="menuitem"
              v-bind:class="(selected==key ? 'mdc-list-item--selected' : null)"
              @click="change(key)"
            >
              <span class="mdc-list-item__ripple"></span>
              <span class="mdc-list-item__text">{{ value }}</span>
            </li>
          </component>
        </ul>
      </div>
    </div>
  `,
};
export default {
  props: { fixed: String, theme: String },  // 'top' | 'bottom'; 'dark' | 'light' | 'white'
  template: /*html*/`
    <nav class="navigation-bar" :class="[theme, fixed && 'fixed-' + fixed]">
      <nav class="navigation-bar-content"><slot /></nav>
    </nav>`,
};
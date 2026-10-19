// Navigation-bar menu that collapses behind a hamburger (.pull-menu) at <= 800px.
// Inline display:block only when opened; otherwise the CSS decides (hidden on mobile, visible on desktop).
export default {
  data: () => ({ open: false }),
  template: /*html*/`
    <div>
      <a href="#" class="pull-menu" @click.prevent="open = !open"></a>
      <ul class="element-menu" :style="open ? { display: 'block' } : null" @click="open = false"><slot /></ul>
    </div>`,
};